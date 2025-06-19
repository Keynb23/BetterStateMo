import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ServiceContext } from '../context/ServiceContext'; // Adjust path if needed
import SetApt from '../pages/SetApt'; // Adjust path if needed

// ----- Mocking External Dependencies -----

// 1. Mock the entire firestoreService module
// We replace `addAppointment` with a Jest mock function (jest.fn())
// This allows us to track its calls without hitting the actual database.
import { addAppointment } from '../lib/firestoreService';
jest.mock('../lib/firestoreService', () => ({
  addAppointment: jest.fn().mockResolvedValue('mock-appointment-id-123'),
}));

// 2. Mock the navigate function from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Keep original router functionality
  useNavigate: () => mockNavigate, // Replace useNavigate with our mock
}));

// ----- Test Suite -----

describe('SetApt Component Submission', () => {

  // A reusable helper function to render the component with all necessary providers
  const renderComponent = (providerProps) => {
    return render(
      <ServiceContext.Provider value={providerProps}>
        <MemoryRouter>
          <SetApt />
        </MemoryRouter>
      </ServiceContext.Provider>
    );
  };

  // Clear mock history before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks();
    // Also reset the Date mock if you are using it
    jest.useRealTimers();
  });

  test('should call addAppointment with correct data on form submission', async () => {
    // ARRANGE: Set up the test environment and initial state

    // We'll use timers to control setTimeout in the component
    jest.useFakeTimers(); 
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    // Define the mock context value and the data we will "type" into the form
    const mockContextValue = {
      selectedServices: ['service-lawn-care', 'service-gutter-cleaning'],
      toggleService: jest.fn(),
    };
    
    const formData = {
      date: '2025-07-15',
      time: 'morning',
      name: 'Jane Doe',
      phone: '555-123-4567',
      email: 'jane.doe@example.com',
      address: '123 Main St, Anytown, USA',
    };

    renderComponent(mockContextValue);

    // ACT: Simulate a user filling out the form and submitting it

    // Fill out the form fields
    await user.type(screen.getByLabelText(/name/i), formData.name);
    await user.type(screen.getByLabelText(/phone number/i), formData.phone);
    await user.type(screen.getByLabelText(/email/i), formData.email);
    await user.type(screen.getByLabelText(/address/i), formData.address);

    // Select date and time
    // Note: React Testing Library doesn't have a great way to select a date,
    // so we target the input directly. This assumes a simple <input type="date">
    const dateInput = screen.getByText(/what days work best for you/i).nextSibling;
    await user.type(dateInput, formData.date);
    
    await user.selectOptions(screen.getByRole('combobox'), [screen.getByText('Morning')]);

    // Click the "Confirm Appointment" button
    const confirmButton = screen.getByRole('button', { name: /confirm appointment/i });
    await user.click(confirmButton);

    // ASSERT: Verify the outcome is as expected

    // 1. Check if the `addAppointment` function was called exactly once
    expect(addAppointment).toHaveBeenCalledTimes(1);

    // 2. Check that `addAppointment` was called with the correct payload
    // `expect.any(Date)` is used because the `createdAt` timestamp is generated
    // at the moment of submission, so we can't predict its exact value.
    expect(addAppointment).toHaveBeenCalledWith({
      selectedServices: mockContextValue.selectedServices,
      earlyContact: false, // Default state
      date: formData.date,
      time: formData.time,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      createdAt: expect.any(Date),
    });

    // 3. (Optional but recommended) Verify the UI updates to the "Thank You" message
    await waitFor(() => {
      expect(screen.getByText(/thank you for scheduling your appointment!/i)).toBeInTheDocument();
    });

    // 4. (Optional but recommended) Verify the redirect is triggered after the timeout
    // Advance the timers by the 2000ms defined in the component's setTimeout
    jest.advanceTimersByTime(2000);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});