import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import EventsPage from './EventsPage';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the API service
jest.mock('../../services/eventService', () => ({
  getEvents: jest.fn().mockResolvedValue({
    data: [
      {
        id: 1,
        title: 'Test Event 1',
        description: 'Test Description 1',
        start_time: '2025-02-01T10:00:00.000Z',
        end_time: '2025-02-01T12:00:00.000Z',
        location: 'Test Location 1',
        status: 'upcoming',
      },
      {
        id: 2,
        title: 'Test Event 2',
        description: 'Test Description 2',
        start_time: '2025-03-01T14:00:00.000Z',
        end_time: '2025-03-01T16:00:00.000Z',
        location: 'Test Location 2',
        status: 'upcoming',
      },
    ],
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

describe('EventsPage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    renderWithProviders(<EventsPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders events after loading', async () => {
    renderWithProviders(<EventsPage />);
    
    // Wait for events to load
    await waitFor(() => {
      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      expect(screen.getByText('Test Event 2')).toBeInTheDocument();
    });
    
    // Check if event details are rendered
    expect(screen.getByText('Test Location 1')).toBeInTheDocument();
    expect(screen.getByText('Test Location 2')).toBeInTheDocument();
  });

  test('navigates to create event page when create button is clicked', async () => {
    renderWithProviders(<EventsPage />);
    
    // Wait for events to load
    await waitFor(() => {
      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
    });
    
    // Click the create button
    const createButton = screen.getByRole('button', { name: /create event/i });
    fireEvent.click(createButton);
    
    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/events/create');
  });

  test('displays empty state when no events are found', async () => {
    // Mock the API to return an empty array
    const mockGetEvents = jest.fn().mockResolvedValue({ data: [] });
    jest.spyOn(require('../../services/eventService'), 'getEvents').mockImplementation(mockGetEvents);
    
    renderWithProviders(<EventsPage />);
    
    // Wait for the empty state to be displayed
    await waitFor(() => {
      expect(screen.getByText(/no events found/i)).toBeInTheDocument();
    });
    
    // Check if the create event button is still visible
    expect(screen.getByRole('button', { name: /create event/i })).toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    // Mock the API to reject with an error
    const errorMessage = 'Failed to fetch events';
    const mockGetEvents = jest.fn().mockRejectedValue(new Error(errorMessage));
    jest.spyOn(require('../../services/eventService'), 'getEvents').mockImplementation(mockGetEvents);
    
    // Mock console.error to prevent error logs in test output
    const originalError = console.error;
    console.error = jest.fn();
    
    renderWithProviders(<EventsPage />);
    
    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/error loading events/i)).toBeInTheDocument();
    });
    
    // Restore console.error
    console.error = originalError;
  });
});
