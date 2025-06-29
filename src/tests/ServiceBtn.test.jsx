import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ServiceBtns } from '../context/ServiceBtn'; // Changed back to relative
import { useServiceContext } from '../context/ServiceContext'; // Changed back to relative
import { useBackendCart } from '../context/BackendCart';     // Changed back to relative
import { serviceTypes } from '../context/serviceTypes';       // Changed back to relative

// Mock the context and hooks
jest.mock('../context/ServiceContext', () => ({ // Changed back to relative
  useServiceContext: jest.fn(),
}));

jest.mock('../context/BackendCart', () => ({ // Changed back to relative
  useBackendCart: jest.fn(),
}));

jest.mock('../context/serviceTypes', () => ({ // Changed back to relative
  serviceTypes: [
    { id: '1', name: 'Service A' },
    { id: '2', name: 'Service B' },
    { id: '3', name: 'Service C' },
  ],
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// ... (rest of your test file remains the same)
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
      });
      render(<ServiceBtns />);
      expect(screen.getByRole('button', { name: 'Deselect All' })).toBeInTheDocument();
    });

    it('calls clearServices when "Deselect All" is clicked', () => {
      useServiceContext.mockReturnValue({
        selectedServices: serviceTypes.map(service => service.id),
        selectAllServices: mockSelectAllServices,
        clearServices: mockClearServices,
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