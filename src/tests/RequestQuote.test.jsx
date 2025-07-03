import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RequestQuote from '../context/RequestQuote'; // Assuming this is the correct path for the component

// Mock the firestoreService module
jest.mock('../lib/firestoreService', () => ({
  addQuoteRequest: jest.fn(),
}));

// Mock the BackendCart context
// The RequestQuote component no longer calls addService based on serviceId,
// so this mock is less critical for *its* specific tests.
// We keep a light mock, but the 'addService' part isn't exercised by this component anymore.
jest.mock('../context/BackendCart', () => ({
  useBackendCart: jest.fn(() => ({
    // addService: jest.fn(), // Not directly used by RequestQuote anymore
    cart: [],
    removeService: jest.fn(),
    clearCart: jest.fn(),
    getSelectedTitles: jest.fn(),
  })),
}));

// Import the mocked functions
import { addQuoteRequest } from '../lib/firestoreService';
// import { useBackendCart } from '../context/BackendCart'; // No longer explicitly needed for assertions here

describe('RequestQuote', () => {
  // Clear mocks before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks();
    // Use Jest's fake timers to control setTimeout for test reliability
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers after each test
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // Test Case 1: Initial render
  test('renders the request quote button and hides the modal initially', () => {
    render(<RequestQuote />);

    // Expect the button to be in the document
    expect(screen.getByRole('button', { name: /request a quote/i })).toBeInTheDocument();

    // Expect the modal to not be in the document
    expect(screen.queryByRole('dialog', { name: /request a quote/i })).not.toBeInTheDocument();
  });

  // Test Case 2: Opening the modal
  test('opens the modal when the request quote button is clicked', async () => {
    render(<RequestQuote />);

    const requestQuoteButton = screen.getByRole('button', { name: /request a quote/i });

    // Click the button
    await act(async () => {
      fireEvent.click(requestQuoteButton);
    });

    // Expect the modal title to be in the document
    expect(screen.getByRole('heading', { name: /request a quote/i })).toBeInTheDocument();

    // Expect input fields to be visible
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tell us what you need/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit request/i })).toBeInTheDocument();
  });

  // REMOVED TEST CASE: 'calls addService with serviceId when opening modal if serviceId is provided'
  // This functionality was removed from RequestQuote.jsx, so the test is no longer relevant.
  // Test Case 3 in your provided code is now removed.

  // Test Case 3 (formerly Test Case 4): `addService` is NOT called when `serviceId` is NOT provided
  // Renumbered this test. If the component no longer calls addService at all on open,
  // this test effectively just confirms that.
  test('does not call addService when opening modal', async () => {
    const mockAddService = jest.fn();
    // Temporarily mock useBackendCart to track calls, even if RequestQuote itself shouldn't call it.
    // If you remove the `addService` from the mock in `jest.mock('../context/BackendCart')` above,
    // then this specific mock implementation might not be necessary, but it's harmless.
    useBackendCart.mockImplementation(() => ({
      addService: mockAddService,
      cart: [],
      removeService: jest.fn(),
      clearCart: jest.fn(),
      getSelectedTitles: jest.fn(),
    }));

    render(<RequestQuote />); // No serviceId prop passed, as it's no longer relevant

    const requestQuoteButton = screen.getByRole('button', { name: /request a quote/i });
    await act(async () => {
      fireEvent.click(requestQuoteButton);
    });

    // Expect addService not to have been called, reflecting the component's current behavior.
    expect(mockAddService).not.toHaveBeenCalled();
  });


  // Test Case 4 (formerly Test Case 5): Closing the modal
  test('closes the modal and clears form fields when the close button is clicked', async () => {
    render(<RequestQuote />);

    const requestQuoteButton = screen.getByRole('button', { name: /request a quote/i });
    await act(async () => {
      fireEvent.click(requestQuoteButton);
    });

    // Fill some fields to check if they clear
    fireEvent.change(screen.getByPlaceholderText(/your name/i), { target: { value: 'Test Name' } });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
      target: { value: '123-456-7890' },
    });
    // Add email and message too, as they are required in the form
    fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/tell us what you need/i), { target: { value: 'Some message here.' } });


    const closeButton = screen.getByRole('button', { name: /×/i }); // '×' is the text content
    await act(async () => {
      fireEvent.click(closeButton);
    });

    // Expect the modal to not be in the document
    expect(screen.queryByRole('heading', { name: /request a quote/i })).not.toBeInTheDocument();

    // Re-open to check if fields are cleared
    await act(async () => {
      fireEvent.click(requestQuoteButton);
    });

    expect(screen.getByPlaceholderText(/your name/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/phone number/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/email address/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/tell us what you need/i)).toHaveValue('');
  });

  // Test Case 5 (formerly Test Case 6): Form submission success
  test('submits the form successfully and displays a success message, then closes', async () => {
    // Mock addQuoteRequest to resolve successfully with a slight delay
    addQuoteRequest.mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(resolve, 50)) // 50ms delay to simulate async operation
    );

    render(<RequestQuote />); // serviceId prop is no longer passed or used here

    // Open the modal
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /request a quote/i }));
    });

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText(/your name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
      target: { value: '987-654-3210' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/tell us what you need/i), {
      target: { value: 'Pool cleaning service.' },
    });

    const submitButton = screen.getByRole('button', { name: /submit request/i });

    // Submit the form
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Expect the button to show "Submitting..." and be disabled during submission
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Submitting...');
    });
    expect(submitButton).toBeDisabled();

    // Advance timers by the duration of the mock promise
    jest.advanceTimersByTime(50);
    
    // Expect addQuoteRequest to be called with correct data (WITHOUT serviceId)
    expect(addQuoteRequest).toHaveBeenCalledTimes(1);
    const callArgs = addQuoteRequest.mock.calls[0][0];

    expect(callArgs.name).toBe('Jane Doe');
    expect(callArgs.phone).toBe('987-654-3210');
    expect(callArgs.email).toBe('jane@example.com');
    expect(callArgs.message).toBe('Pool cleaning service.');
    // REMOVED: expect(callArgs.serviceId).toBe(456); // This expectation is NOT valid anymore
    expect(callArgs.createdAt).toBeInstanceOf(Date);

    // Expect success message to appear
    await waitFor(() => {
      expect(
        screen.getByText(/your quote request has been sent! we will contact you soon./i),
      ).toBeInTheDocument();
    });

    // Expect button text to revert and become enabled again
    expect(submitButton).toHaveTextContent('Submit Request');
    expect(submitButton).not.toBeDisabled();

    // Advance timers for the modal to close (after 2000ms delay in component)
    jest.advanceTimersByTime(2000);

    // Expect the modal to be closed
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /request a quote/i })).not.toBeInTheDocument();
    });
  });

  // Test Case 6 (formerly Test Case 7): Form submission failure
  test('submits the form and displays an error message on failure', async () => {
    // Mock addQuoteRequest to reject with an error
    addQuoteRequest.mockRejectedValueOnce(new Error('Firestore error'));

    render(<RequestQuote />);

    // Open the modal
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /request a quote/i }));
    });

    // Fill all required form fields, INCLUDING the message textarea
    fireEvent.change(screen.getByPlaceholderText(/your name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
      target: { value: '555-123-4567' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/tell us what you need/i), {
      target: { value: 'This is a test message for an error.' }, // NOW FILLED
    });

    const submitButton = screen.getByRole('button', { name: /submit request/i });

    // Submit the form
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Expect the button to show "Submitting..." and be disabled during submission
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Submitting...');
    });
    expect(submitButton).toBeDisabled();

    // Expect submit message to appear after rejection
    await waitFor(() => {
      expect(
        screen.getByText(/failed to send your request\. please try again\./i),
      ).toBeInTheDocument();
    });

    // Expect button text to revert and become enabled again
    expect(submitButton).toHaveTextContent('Submit Request');
    expect(submitButton).not.toBeDisabled();

    // Ensure the modal does NOT close automatically on error
    expect(screen.getByRole('heading', { name: /request a quote/i })).toBeInTheDocument();
  });

  // NEW TEST: Test for tooltip behavior
  test('shows and hides the tooltip on button hover', async () => {
    render(<RequestQuote />);
    // Get the button and then find its closest container with the specific class
    const buttonElement = screen.getByRole('button', { name: /request a quote/i });
    const buttonContainer = buttonElement.closest('.quote-button-fixed-container');

    // Tooltip should not be visible initially
    expect(screen.queryByText(/request quotes, contact, appointment, etc\.\.\./i)).not.toBeVisible();

    // Hover over the container (or the button itself if the CSS targets it)
    fireEvent.mouseEnter(buttonContainer);

    // Tooltip should become visible
    await waitFor(() => {
      expect(screen.getByText(/request quotes, contact, appointment, etc\.\.\./i)).toBeVisible();
    });

    // Mouse leave the container
    fireEvent.mouseLeave(buttonContainer);

    // Tooltip should hide
    await waitFor(() => {
      expect(screen.queryByText(/request quotes, contact, appointment, etc\.\.\./i)).not.toBeVisible();
    });
  });
});