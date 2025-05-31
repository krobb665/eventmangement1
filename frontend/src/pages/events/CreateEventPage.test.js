import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import userEvent from '@testing-library/user-event';
import CreateEventPage from './CreateEventPage';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the API service
jest.mock('../../../services/eventService', () => ({
  createEvent: jest.fn().mockResolvedValue({
    data: {
      id: 1,
      title: 'New Test Event',
      description: 'New Test Description',
      start_time: '2025-03-01T10:00:00.000Z',
      end_time: '2025-03-01T12:00:00.000Z',
      location: 'New Test Location',
      status: 'upcoming',
    },
  }),
}));

const theme = createTheme();

const renderWithProviders = (ui, { store = configureStore({ reducer: {} }), ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          {children}
        </Router>
      </ThemeProvider>
    </Provider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

describe('CreateEventPage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders the create event form', () => {
    renderWithProviders(<CreateEventPage />);
    
    // Check if the form elements are rendered
    expect(screen.getByRole('heading', { name: /create new event/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/event title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date & time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date & time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create event/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderWithProviders(<CreateEventPage />);
    
    // Submit the form without filling any fields
    const submitButton = screen.getByRole('button', { name: /create event/i });
    fireEvent.click(submitButton);
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/start time is required/i)).toBeInTheDocument();
      expect(screen.getByText(/end time is required/i)).toBeInTheDocument();
      expect(screen.getByText(/location is required/i)).toBeInTheDocument();
    });
  });

  test('submits the form with valid data', async () => {
    const { container } = renderWithProviders(<CreateEventPage />);
    const user = userEvent.setup();
    
    // Fill in the form
    await user.type(screen.getByLabelText(/event title/i), 'New Test Event');
    await user.type(screen.getByLabelText(/description/i), 'New Test Description');
    
    // Set start date and time
    const startDateTimeInput = container.querySelector('input[name="start_time"]');
    fireEvent.change(startDateTimeInput, { target: { value: '2025-03-01T10:00' } });
    
    // Set end date and time
    const endDateTimeInput = container.querySelector('input[name="end_time"]');
    fireEvent.change(endDateTimeInput, { target: { value: '2025-03-01T12:00' } });
    
    await user.type(screen.getByLabelText(/location/i), 'New Test Location');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create event/i });
    await user.click(submitButton);
    
    // Check if the API was called with the correct data
    await waitFor(() => {
      expect(require('../../../services/eventService').createEvent).toHaveBeenCalledWith({
        title: 'New Test Event',
        description: 'New Test Description',
        start_time: '2025-03-01T10:00:00.000Z',
        end_time: '2025-03-01T12:00:00.000Z',
        location: 'New Test Location',
      });
    });
    
    // Check if navigation occurred after successful submission
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/events/1');
    });
  });

  test('cancels form and navigates back', async () => {
    renderWithProviders(<CreateEventPage />);
    
    // Click the cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/events');
  });

  test('displays error when event creation fails', async () => {
    // Mock the API to reject with an error
    const errorMessage = 'Failed to create event';
    jest.spyOn(require('../../../services/eventService'), 'createEvent')
      .mockRejectedValueOnce(new Error(errorMessage));
    
    // Mock console.error to prevent error logs in test output
    const originalError = console.error;
    console.error = jest.fn();
    
    const { container } = renderWithProviders(<CreateEventPage />);
    const user = userEvent.setup();
    
    // Fill in the form with valid data
    await user.type(screen.getByLabelText(/event title/i), 'New Test Event');
    await user.type(screen.getByLabelText(/description/i), 'New Test Description');
    
    // Set start date and time
    const startDateTimeInput = container.querySelector('input[name="start_time"]');
    fireEvent.change(startDateTimeInput, { target: { value: '2025-03-01T10:00' } });
    
    // Set end date and time
    const endDateTimeInput = container.querySelector('input[name="end_time"]');
    fireEvent.change(endDateTimeInput, { target: { value: '2025-03-01T12:00' } });
    
    await user.type(screen.getByLabelText(/location/i), 'New Test Location');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create event/i });
    await user.click(submitButton);
    
    // Check if the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/error creating event/i)).toBeInTheDocument();
    });
    
    // Restore console.error
    console.error = originalError;
  });

  test('validates end time is after start time', async () => {
    const { container } = renderWithProviders(<CreateEventPage />);
    const user = userEvent.setup();
    
    // Fill in the form with invalid date range
    await user.type(screen.getByLabelText(/event title/i), 'Invalid Date Range Event');
    
    // Set start date and time
    const startDateTimeInput = container.querySelector('input[name="start_time"]');
    fireEvent.change(startDateTimeInput, { target: { value: '2025-03-01T14:00' } });
    
    // Set end date and time to be before start time
    const endDateTimeInput = container.querySelector('input[name="end_time"]');
    fireEvent.change(endDateTimeInput, { target: { value: '2025-03-01T12:00' } });
    
    await user.type(screen.getByLabelText(/location/i), 'Test Location');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create event/i });
    await user.click(submitButton);
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/end time must be after start time/i)).toBeInTheDocument();
    });
    
    // Verify the form was not submitted
    expect(require('../../../services/eventService').createEvent).not.toHaveBeenCalled();
  });
});
