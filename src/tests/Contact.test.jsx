import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Contact from '../pages/Contact'; // CORRECTED PATH: Assumes Contact.jsx is in src/pages/
import { addContactSubmission } from '../lib/firestoreService'; // Import the mockable function

// Mock the firestoreService module
jest.mock('../lib/firestoreService', () => ({
  addContactSubmission: jest.fn(),
}));

describe('Contact Component - Core Submission Logic', () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure isolation
    jest.clearAllMocks();
    // Use fake timers to control setTimeout for test reliability
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers after each test
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // Helper function to fill all required fields and check the confirmation box
  const fillAndConfirmForm = (name, phone, email, message) => {
    fireEvent.change(screen.getByLabelText(/name:/i), { target: { value: name } });
    fireEvent.change(screen.getByLabelText(/phone:/i), { target: { value: phone } });
    fireEvent.change(screen.getByLabelText(/email:/i), { target: { value: email } });
    fireEvent.change(screen.getByLabelText(/message:/i), { target: { value: message } });
    fireEvent.click(screen.getByLabelText(/by submitting this form, you're confirming that the information above is correct\./i));
  };

  // Test Case: Submission prevented if checkbox is not confirmed
  test('submission is prevented if confirmation checkbox is not checked, even if fields are filled', async () => {
    render(<Contact />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    const checkbox = screen.getByLabelText(/by submitting this form, you're confirming that the information above is correct\./i);

    // Fill fields but DO NOT check the confirmation box
    fireEvent.change(screen.getByLabelText(/name:/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/phone:/i), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByLabelText(/email:/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/message:/i), { target: { value: 'This is a test message.' } });

    // Ensure button is disabled before attempting click (it should be disabled because checkbox is unchecked)
    expect(submitButton).toBeDisabled();
    expect(checkbox).not.toBeChecked();

    // Attempt to submit (clicking a disabled button does not trigger form submission)
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Expect addContactSubmission not to have been called because the button was disabled
    expect(addContactSubmission).not.toHaveBeenCalled();

    // The error message "Please confirm..." is only set if handleSubmit is actually called.
    // Since the button is disabled, handleSubmit is not called.
    // Therefore, we assert that the message is NOT in the document.
    expect(screen.queryByText(/please confirm that the information is correct\./i)).not.toBeInTheDocument();

    expect(submitButton).toHaveTextContent('Submit'); // Button text should remain 'Submit'
    expect(submitButton).toBeDisabled(); // Button should remain disabled
  });

  // Test Case: Successful form submission sends data to Firestore and clears form
  test('submits the form successfully, sends data to Firestore, and clears form fields', async () => {
    // Mock addContactSubmission to resolve successfully with a small delay
    addContactSubmission.mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(resolve, 200)) // Simulate async operation with a longer delay
    );

    render(<Contact />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    const nameInput = screen.getByLabelText(/name:/i);
    const phoneInput = screen.getByLabelText(/phone:/i);
    const emailInput = screen.getByLabelText(/email:/i);
    const messageInput = screen.getByLabelText(/message:/i);
    const checkbox = screen.getByLabelText(/by submitting this form, you're confirming that the information above is correct\./i);

    // Fill all required fields and check the confirmation box
    fillAndConfirmForm('Jane Smith', '987-654-3210', 'jane.smith@example.com', 'Inquiry about pool services.');

    // Ensure button is enabled after filling and confirming
    expect(submitButton).not.toBeDisabled();

    // Submit the form (this triggers setIsSubmitting(true) and the async call)
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Expect button to show "Sending..." and be disabled.
    // Use waitFor to ensure the DOM updates reflecting the 'isSubmitting' state are flushed.
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Sending...');
    });
    expect(submitButton).toBeDisabled();

    // Now, advance timers to resolve the mock promise.
    // This will trigger the state update to success/failure and revert isSubmitting.
    await act(async () => {
      jest.advanceTimersByTime(200); // Advance enough to resolve the mock promise
    });

    // Expect addContactSubmission to have been called with correct data
    expect(addContactSubmission).toHaveBeenCalledTimes(1);
    const callArgs = addContactSubmission.mock.calls[0][0];

    expect(callArgs.name).toBe('Jane Smith');
    expect(callArgs.phone).toBe('987-654-3210');
    expect(callArgs.email).toBe('jane.smith@example.com');
    expect(callArgs.message).toBe('Inquiry about pool services.');

    // Expect success message to appear
    await waitFor(() => {
      expect(screen.getByText(/your message has been sent successfully! we will get back to you shortly\./i)).toBeInTheDocument();
    });

    // Expect form fields to be cleared and checkbox reset
    expect(nameInput).toHaveValue('');
    expect(phoneInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(messageInput).toHaveValue('');
    expect(checkbox).not.toBeChecked();

    // Expect button text to revert and become disabled again (due to empty fields)
    expect(submitButton).toHaveTextContent('Submit');
    expect(submitButton).toBeDisabled();
  });

  // Test Case: Failed form submission displays an error message and retains form data
  test('submits the form, displays an error message on failure, and retains form data', async () => {
    // Mock addContactSubmission to reject with an error after a small delay
    addContactSubmission.mockImplementationOnce(() =>
      new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore write failed')), 200)) // Simulate async operation
    );

    render(<Contact />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    const nameInput = screen.getByLabelText(/name:/i);
    const phoneInput = screen.getByLabelText(/phone:/i);
    const emailInput = screen.getByLabelText(/email:/i);
    const messageInput = screen.getByLabelText(/message:/i);
    const checkbox = screen.getByLabelText(/by submitting this form, you're confirming that the information above is correct\./i);

    // Fill all required fields and check the confirmation box
    fillAndConfirmForm('Error User', '111-222-3333', 'error@example.com', 'This message should fail.');

    // Ensure button is enabled
    expect(submitButton).not.toBeDisabled();

    // Submit the form (this triggers setIsSubmitting(true) and the async call)
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Expect button to show "Sending..." and be disabled
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Sending...');
    });
    expect(submitButton).toBeDisabled();

    // Advance timers to reject the mock promise.
    await act(async () => {
      jest.advanceTimersByTime(200); // Advance enough to resolve the mock promise (to rejection)
    });

    // Expect addContactSubmission to have been called
    expect(addContactSubmission).toHaveBeenCalledTimes(1);

    // Expect error message to appear
    await waitFor(() => {
      expect(screen.getByText(/failed to send your message\. please try again\./i)).toBeInTheDocument();
    });

    // Expect form fields NOT to be cleared and checkbox NOT reset on failure
    expect(nameInput).toHaveValue('Error User');
    expect(phoneInput).toHaveValue('111-222-3333');
    expect(emailInput).toHaveValue('error@example.com');
    expect(messageInput).toHaveValue('This message should fail.');
    expect(checkbox).toBeChecked(); // Checkbox should remain checked

    // Expect button text to revert and become enabled again (as fields are still filled and checkbox is checked)
    expect(submitButton).toHaveTextContent('Submit');
    expect(submitButton).not.toBeDisabled();
  });
});
