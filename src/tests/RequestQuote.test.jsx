import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RequestQuote from '../context/RequestQuote';

// Mock the firestoreService module
jest.mock('../lib/firestoreService', () => ({
  // Corrected path
  addQuoteRequest: jest.fn(),
}));

// Mock the BackendCart context
jest.mock('../context/BackendCart', () => ({
  // Corrected path
  useBackendCart: jest.fn(() => ({
    addService: jest.fn(),
    cart: [], // Provide a default empty cart
    removeService: jest.fn(),
    clearCart: jest.fn(),
    getSelectedTitles: jest.fn(),
  })),
}));

// Import the mocked functions
import { addQuoteRequest } from '../lib/firestoreService';
import { useBackendCart } from '../context/BackendCart';

describe('RequestQuote', () => {
  // Clear mocks before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation for useBackendCart for consistent state
    useBackendCart.mockImplementation(() => ({
      addService: jest.fn(),
      cart: [],
      removeService: jest.fn(),
      clearCart: jest.fn(),
      getSelectedTitles: jest.fn(),
    }));
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

  // Test Case 3: `addService` is called when `serviceId` is provided
  test('calls addService with serviceId when opening modal if serviceId is provided', async () => {
    const mockAddService = jest.fn();
    useBackendCart.mockImplementation(() => ({
      addService: mockAddService,
      cart: [],
      removeService: jest.fn(),
      clearCart: jest.fn(),
      getSelectedTitles: jest.fn(),
    }));

    render(<RequestQuote serviceId={123} />);

    const requestQuoteButton = screen.getByRole('button', { name: /request a quote/i });
    await act(async () => {
      fireEvent.click(requestQuoteButton);
    });

    expect(mockAddService).toHaveBeenCalledTimes(1);
    expect(mockAddService).toHaveBeenCalledWith(123);
  });

  // Test Case 4: `addService` is NOT called when `serviceId` is NOT provided
  test('does not call addService when opening modal if serviceId is not provided', async () => {
    const mockAddService = jest.fn();
    useBackendCart.mockImplementation(() => ({
      addService: mockAddService,
      cart: [],
      removeService: jest.fn(),
      clearCart: jest.fn(),
      getSelectedTitles: jest.fn(),
    }));

    render(<RequestQuote />); // No serviceId prop

    const requestQuoteButton = screen.getByRole('button', { name: /request a quote/i });
    await act(async () => {
      fireEvent.click(requestQuoteButton);
    });

    expect(mockAddService).not.toHaveBeenCalled();
  });

  // Test Case 5: Closing the modal
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
  });

  // Test Case 6: Form submission success
  test('submits the form successfully and displays a success message, then closes', async () => {
    // Mock addQuoteRequest to resolve successfully
    // ADD A SHORT DELAY HERE using Promise.resolve().then()
    addQuoteRequest.mockImplementationOnce(() =>
      Promise.resolve().then(() => new Promise((resolve) => setTimeout(resolve, 50))),
    ); // Delay for 50ms

    // Jest's fake timers are needed for setTimeout
    jest.useFakeTimers();

    render(<RequestQuote serviceId={456} />);

    // Open the modal
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /request a quote/i }));
    });

    // Fill the form (existing code)
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

    // Now, with the slight delay in the mock, waitFor should catch the 'Submitting...' state
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Submitting...');
    });
    expect(submitButton).toBeDisabled();

    // Rest of your test code for success message, mock calls, and modal closure
    // ... (keep the rest of the test as you have it)
    expect(addQuoteRequest).toHaveBeenCalledTimes(1);
    const callArgs = addQuoteRequest.mock.calls[0][0];
    expect(callArgs.name).toBe('Jane Doe');
    expect(callArgs.phone).toBe('987-654-3210');
    expect(callArgs.email).toBe('jane@example.com');
    expect(callArgs.message).toBe('Pool cleaning service.');
    expect(callArgs.serviceId).toBe(456);
    expect(callArgs.createdAt).toBeInstanceOf(Date);

    await waitFor(() => {
      expect(
        screen.getByText(/your quote request has been sent! we will contact you soon./i),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Submit Request');
    });
    expect(submitButton).not.toBeDisabled();

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /request a quote/i })).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  // Test Case 7: Form submission failure
  test('submits the form and displays an error message on failure', async () => {
    // Mock addQuoteRequest to reject with an error
    addQuoteRequest.mockRejectedValueOnce(new Error('Firestore error'));

    jest.useFakeTimers(); // For `setTimeout` which will be cleared

    render(<RequestQuote />);

    // Open the modal
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /request a quote/i }));
    });

    // Fill the form (only required fields)
    fireEvent.change(screen.getByPlaceholderText(/your name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
      target: { value: '555-123-4567' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'john@example.com' },
    });

    const submitButton = screen.getByRole('button', { name: /submit request/i });

    // Submit the form
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Expect submit message to appear
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

    jest.useRealTimers(); // Restore real timers
  });
});
