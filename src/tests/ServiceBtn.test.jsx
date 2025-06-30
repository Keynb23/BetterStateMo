import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
// Import both ServiceBtns AND SingleServiceBtn from the same file
import { ServiceBtns, SingleServiceBtn } from '../context/ServiceBtns'; // Changed to import both
import { useServiceContext } from '../context/ServiceContext';
import { useBackendCart } from '../context/BackendCart';
import { serviceTypes } from '../context/serviceTypes';

// Mock the context and hooks
jest.mock('../context/ServiceContext', () => ({
  useServiceContext: jest.fn(),
}));

jest.mock('../context/BackendCart', () => ({
  useBackendCart: jest.fn(),
}));

jest.mock('../context/serviceTypes', () => ({
  serviceTypes: [
    { id: '1', title: 'Service A' }, // Changed name to title to match your serviceData structure
    { id: '2', title: 'Service B' },
    { id: '3', title: 'Service C' },
  ],
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ServiceBtns', () => {
  const mockSelectAllServices = jest.fn();
  const mockClearServices = jest.fn();
  const mockAddService = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useServiceContext.mockReturnValue({
      selectedServices: [],
      selectAllServices: mockSelectAllServices,
      clearServices: mockClearServices,
      toggleService: jest.fn(), // Added toggleService for SingleServiceBtn tests
    });
    useBackendCart.mockReturnValue({
      addService: mockAddService,
    });
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the "Select All" button', () => {
    render(<ServiceBtns />);
    expect(screen.getByRole('button', { name: /select all/i })).toBeInTheDocument();
  });

  it('does not render "Schedule Appointment" button when no services are selected', () => {
    render(<ServiceBtns />);
    expect(screen.queryByRole('button', { name: /schedule appointment/i })).not.toBeInTheDocument();
  });

  it('renders "Schedule Appointment" button when services are selected', () => {
    useServiceContext.mockReturnValue({
      selectedServices: ['1'],
      selectAllServices: mockSelectAllServices,
      clearServices: mockClearServices,
      toggleService: jest.fn(),
    });
    render(<ServiceBtns />);
    expect(screen.getByRole('button', { name: /schedule appointment/i })).toBeInTheDocument();
  });

  describe('Select All / Deselect All functionality', () => {
    it('calls selectAllServices and addService for each service when "Select All" is clicked', () => {
      render(<ServiceBtns />);
      const selectAllButton = screen.getByRole('button', { name: 'Select All' });
      fireEvent.click(selectAllButton);

      const allServiceIds = serviceTypes.map(service => service.id);
      expect(mockSelectAllServices).toHaveBeenCalledWith(allServiceIds);
      allServiceIds.forEach(id => {
        expect(mockAddService).toHaveBeenCalledWith(id);
      });
      expect(mockAddService).toHaveBeenCalledTimes(allServiceIds.length);
    });

    it('changes button text to "Deselect All" when all services are selected', () => {
      useServiceContext.mockReturnValue({
        selectedServices: serviceTypes.map(service => service.id),
        selectAllServices: mockSelectAllServices,
        clearServices: mockClearServices,
        toggleService: jest.fn(),
      });
      render(<ServiceBtns />);
      expect(screen.getByRole('button', { name: 'Deselect All' })).toBeInTheDocument();
    });

    it('calls clearServices when "Deselect All" is clicked', () => {
      useServiceContext.mockReturnValue({
        selectedServices: serviceTypes.map(service => service.id),
        selectAllServices: mockSelectAllServices,
        clearServices: mockClearServices,
        toggleService: jest.fn(),
      });
      render(<ServiceBtns />);
      const deselectAllButton = screen.getByRole('button', { name: 'Deselect All' });
      fireEvent.click(deselectAllButton);

      expect(mockClearServices).toHaveBeenCalledTimes(1);
      expect(mockSelectAllServices).not.toHaveBeenCalled();
    });
  });

  it('calls navigate to /setapt when "Schedule Appointment" is clicked', () => {
    useServiceContext.mockReturnValue({
      selectedServices: ['1'],
      selectAllServices: mockSelectAllServices,
      clearServices: mockClearServices,
      toggleService: jest.fn(),
    });
    render(
      <Router>
        <ServiceBtns />
      </Router>
    );
    const scheduleAppointmentButton = screen.getByRole('button', { name: /schedule appointment/i });
    fireEvent.click(scheduleAppointmentButton);

    expect(mockNavigate).toHaveBeenCalledWith('/setapt');
  });
});

// --- NEW TEST SUITE FOR SingleServiceBtn ---
describe('SingleServiceBtn', () => {
  const mockToggleService = jest.fn();
  const mockAddService = jest.fn();

  beforeEach(() => {
    useServiceContext.mockReturnValue({
      selectedServices: [],
      toggleService: mockToggleService,
      selectAllServices: jest.fn(), // Add these if not already in ServiceContext mock
      clearServices: jest.fn(),     // Add these if not already in ServiceContext mock
    });
    useBackendCart.mockReturnValue({
      addService: mockAddService,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with "Select" text when not selected', () => {
    render(<SingleServiceBtn serviceId="1" serviceTitle="Pool Opening" />);
    expect(screen.getByRole('button', { name: 'Select Pool Opening' })).toBeInTheDocument();
  });

  it('renders correctly with "Selected" text and checkmark when selected', () => {
    useServiceContext.mockReturnValue({
      selectedServices: ['1'],
      toggleService: mockToggleService,
      selectAllServices: jest.fn(),
      clearServices: jest.fn(),
    });
    render(<SingleServiceBtn serviceId="1" serviceTitle="Pool Opening" />);
    expect(screen.getByRole('button', { name: '✓ Selected Pool Opening' })).toBeInTheDocument();
  });

  it('calls toggleService and addService when clicked', () => {
    render(<SingleServiceBtn serviceId="1" serviceTitle="Pool Opening" />);
    fireEvent.click(screen.getByRole('button', { name: 'Select Pool Opening' }));

    expect(mockToggleService).toHaveBeenCalledWith('1');
    expect(mockAddService).toHaveBeenCalledWith('1');
    expect(mockToggleService).toHaveBeenCalledTimes(1);
    expect(mockAddService).toHaveBeenCalledTimes(1);
  });
});