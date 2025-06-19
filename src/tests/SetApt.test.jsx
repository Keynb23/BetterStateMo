import React from 'react'; // Add this line
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SetApt from '../pages/SetApt'; // Adjusted path

// ... rest of your code
// Corrected Jest mocks:
jest.mock('../context/ServiceContext', () => {
  const React = jest.requireActual('react');

  // We need a shared reference for the mock functions
  const mockToggleService = jest.fn();
  const mockSetSelectedServices = jest.fn();
  const mockSelectedServices = []; // Initial empty array for the mock

  // This will be the mock hook instance
  const useServiceContext = jest.fn();

  const MockServiceContextProvider = ({ children, initialSelectedServices }) => {
    const [selectedServices, setSelectedServices] = React.useState(initialSelectedServices || []);

    // Effect to update the mock hook's return value whenever selectedServices changes
    React.useEffect(() => {
      useServiceContext.mockReturnValue({
        selectedServices,
        toggleService: mockToggleService,
        setSelectedServices: mockSetSelectedServices,
      });
      // Important: Also update the externally accessible mockSelectedServices if needed for assertions
      // In this specific pattern, we directly use `useServiceContext().selectedServices`
      // So, this is mostly for the initial state.
    }, [selectedServices]); // Rerun when internal state changes

    // Set the initial value immediately on mount for the first render
    React.useLayoutEffect(() => {
      useServiceContext.mockReturnValue({
        selectedServices,
        toggleService: mockToggleService,
        setSelectedServices: mockSetSelectedServices,
      });
    }, []);

    // Override the mockToggleService to actually manipulate the internal state
    // This allows the component to update the context state as it would in a real app
    mockToggleService.mockImplementation((serviceId) => {
      setSelectedServices(prev => {
        if (prev.includes(serviceId)) {
          return prev.filter(id => id !== serviceId);
        } else {
          return [...prev, serviceId];
        }
      });
    });

    mockSetSelectedServices.mockImplementation((newServices) => {
        setSelectedServices(newServices);
    });


    return <>{children}</>;
  };

  return {
    useServiceContext,
    MockServiceContextProvider,
    // Export the internal mock functions for direct assertion in tests
    _mockToggleService: mockToggleService,
    _mockSetSelectedServices: mockSetSelectedServices,
  };
});

// Other mocks remain the same
jest.mock('../lib/firestoreService');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(() => ({ state: null })),
}));

jest.mock('../context/serviceTypes', () => ({
  serviceTypes: [
    { id: 'pool_cleaning', title: 'Pool Cleaning' },
    { id: 'filter_repair', title: 'Filter Repair' },
    { id: 'leak_detection', title: 'Leak Detection' },
  ],
}));


// Import the mocked functions (these are the *mocked* ones from the jest.mock calls)
import { useServiceContext, MockServiceContextProvider, _mockToggleService, _mockSetSelectedServices } from '../context/ServiceContext';
import { addAppointment } from '../lib/firestoreService';
import { useNavigate, useLocation } from 'react-router-dom';


// Helper function to render component with mocks
const renderWithProviders = (ui, { route = '/', locationState = null, initialSelectedServices = [] } = {}) => {
  useLocation.mockReturnValue({ state: locationState });
  
  // Set an initial return value for useServiceContext *before* the component renders,
  // in case the component calls it immediately on render.
  // The MockServiceContextProvider will then override/update this.
  useServiceContext.mockReturnValue({
    selectedServices: initialSelectedServices,
    toggleService: _mockToggleService, // Use the shared mock function
    setSelectedServices: _mockSetSelectedServices, // Use the shared mock function
  });
  
  // Clear the internal mock implementations of toggleService and setSelectedServices
  // to prevent state leakage between renders if MockServiceContextProvider re-initializes them.
  _mockToggleService.mockClear();
  _mockSetSelectedServices.mockClear();

  return render(
    <MemoryRouter initialEntries={[route]}>
      <MockServiceContextProvider initialSelectedServices={initialSelectedServices}>
        {ui}
      </MockServiceContextProvider>
    </MemoryRouter>
  );
};


describe('SetApt Component', () => {
  let mockNavigate;

  beforeEach(() => {
    // Reset mocks before each test
    addAppointment.mockClear();
    useNavigate.mockClear();
    useLocation.mockClear();
    
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    // Ensure useFakeTimers is called right at the beginning of beforeEach
    jest.useFakeTimers(); 
  });

  afterEach(() => {
    // Ensure runOnlyPendingTimers is only called if fake timers are active
    // This warning should be gone with jest.useFakeTimers() at the top of beforeEach
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders correctly and displays initial elements', () => {
    renderWithProviders(<SetApt />);
    expect(screen.getByText(/let's get you scheduled!/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm appointment/i })).toBeInTheDocument();
  });

  test('prefills customer info from location state on mount', () => {
    const customerInfo = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '987-654-3210',
      address: '456 Oak Ave',
    };
    renderWithProviders(<SetApt />, { locationState: { customerInfo } });
    expect(screen.getByLabelText(/name/i)).toHaveValue('Jane Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('jane@example.com');
    expect(screen.getByLabelText(/phone number/i)).toHaveValue('987-654-3210');
    expect(screen.getByLabelText(/address/i)).toHaveValue('456 Oak Ave');
  });

  test('allows user to input appointment details and contact info', () => {
    renderWithProviders(<SetApt />);
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-12-25' } });
    fireEvent.change(screen.getByLabelText(/time/i), { target: { value: 'morning' } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '111-222-3333' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '789 Pine St' } });

    expect(screen.getByLabelText(/date/i)).toHaveValue('2025-12-25');
    expect(screen.getByLabelText(/time/i)).toHaveValue('morning');
    expect(screen.getByLabelText(/name/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/phone number/i)).toHaveValue('111-222-3333');
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/address/i)).toHaveValue('789 Pine St');
  });

  test('toggles early contact preference', () => {
    renderWithProviders(<SetApt />);
    const earlyContactButton = screen.getByRole('button', { name: '✔' });
    expect(earlyContactButton).not.toHaveClass('Early-contact-btn-clicked');
    fireEvent.click(earlyContactButton);
    expect(earlyContactButton).toHaveClass('Early-contact-btn-clicked');
    fireEvent.click(earlyContactButton); // Click again to toggle off
    expect(earlyContactButton).not.toHaveClass('Early-contact-btn-clicked');
  });

  test('displays selected services and allows removal', () => {
    renderWithProviders(<SetApt />, { initialSelectedServices: ['pool_cleaning', 'filter_repair'] });
    expect(screen.getByText('Pool Cleaning')).toBeInTheDocument();
    expect(screen.getByText('Filter Repair')).toBeInTheDocument();

    const poolCleaningRemoveButton = within(screen.getByText('Pool Cleaning').closest('li')).getByRole('button', { name: 'X' });
    fireEvent.click(poolCleaningRemoveButton);
    
    // We expect the *internal* mockToggleService to have been called
    expect(_mockToggleService).toHaveBeenCalledTimes(1); 
    expect(_mockToggleService).toHaveBeenCalledWith('pool_cleaning');

    // After removal, expect the service to be gone from the displayed list
    // This requires an additional render step if the component's state changes
    // If the component re-renders quickly, you might need waitFor:
    // await waitForElementToBeRemoved(() => screen.queryByText('Pool Cleaning'));
  });

  test('allows adding services not currently selected', () => {
    renderWithProviders(<SetApt />, { initialSelectedServices: ['pool_cleaning'] });

    expect(screen.getByText('Filter Repair')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Filter Repair' }));
    expect(_mockToggleService).toHaveBeenCalledWith('filter_repair');
    
    expect(screen.getByText('Leak Detection')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Leak Detection' }));
    expect(_mockToggleService).toHaveBeenCalledWith('leak_detection');
    expect(_mockToggleService).toHaveBeenCalledTimes(2);
  });


  test('submits appointment data and navigates to home on success', async () => {
    // Ensure setSelectedServices on the mock context also sets the actual state
    // for the component's internal logic, this is handled by MockServiceContextProvider
    // We only need to ensure the initial services are set correctly for renderWithProviders
    
    renderWithProviders(<SetApt />, { initialSelectedServices: ['pool_cleaning'] }); // Pass initial services here

    // Fill out form
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-12-25' } });
    fireEvent.change(screen.getByLabelText(/time/i), { target: { value: 'morning' } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '111-222-3333' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '789 Pine St' } });
    fireEvent.click(screen.getByRole('button', { name: '✔' })); // Toggle early contact

    // Click confirm button
    fireEvent.click(screen.getByRole('button', { name: /confirm appointment/i }));

    // Expect addAppointment to be called with the correct data
    await waitFor(() => {
      expect(addAppointment).toHaveBeenCalledTimes(1);
      const args = addAppointment.mock.calls[0][0];
      expect(args.selectedServices).toEqual(['pool_cleaning']); // Should reflect the initialSelectedServices
      expect(args.earlyContact).toBe(true);
      expect(args.date).toBe('2025-12-25');
      expect(args.time).toBe('morning');
      expect(args.name).toBe('Test User');
      expect(args.phone).toBe('111-222-3333');
      expect(args.email).toBe('test@example.com');
      expect(args.address).toBe('789 Pine St');
      expect(args.createdAt).toBeInstanceOf(Date);
    });

    // Expect thank you message to appear
    expect(screen.getByText(/thank you for scheduling your appointment!/i)).toBeInTheDocument();

    // Fast-forward timers to trigger navigation
    jest.advanceTimersByTime(2000);

    // Expect navigation to home page
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('displays error message on appointment submission failure', async () => {
    addAppointment.mockImplementationOnce(() => Promise.reject(new Error('Firebase error')));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<SetApt />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Fail User' } });
    fireEvent.click(screen.getByRole('button', { name: /confirm appointment/i }));

    await waitFor(() => {
      expect(addAppointment).toHaveBeenCalledTimes(1);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to save appointment:", expect.any(Error));
    consoleErrorSpy.mockRestore();
  });
});