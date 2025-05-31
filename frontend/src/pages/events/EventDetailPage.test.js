import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import EventDetailPage from './EventDetailPage';

// Mock the useParams and useNavigate hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => mockNavigate,
}));

// Mock the API service
jest.mock('../../../services/eventService', () => ({
  getEventById: jest.fn().mockResolvedValue({
    data: {
      id: 1,
      title: 'Test Event',
      description: 'Test Description',
      start_time: '2025-02-01T10:00:00.000Z',
      end_time: '2025-02-01T12:00:00.000Z',
      location: 'Test Location',
      status: 'upcoming',
      created_by: 1,
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z',
      tasks: [],
      attendees: [],
      budget: null,
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
          <Routes>
            <Route path="/events/:id" element={children} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

describe('EventDetailPage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    renderWithProviders(<EventDetailPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders event details after loading', async () => {
    renderWithProviders(<EventDetailPage />);
    
    // Wait for event to load
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
    
    // Check if event details are rendered
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText(/february 1, 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/10:00 am - 12:00 pm/i)).toBeInTheDocument();
  });

  test('navigates back to events list when back button is clicked', async () => {
    renderWithProviders(<EventDetailPage />);
    
    // Wait for event to load
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
    
    // Click the back button
    const backButton = screen.getByLabelText(/back/i);
    backButton.click();
    
    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/events');
  });

  test('displays error message when event is not found', async () => {
    // Mock the API to reject with a 404 error
    const error = new Error('Event not found');
    error.response = { status: 404 };
    
    jest.spyOn(require('../../../services/eventService'), 'getEventById')
      .mockRejectedValueOnce(error);
    
    // Mock console.error to prevent error logs in test output
    const originalError = console.error;
    console.error = jest.fn();
    
    renderWithProviders(<EventDetailPage />);
    
    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/event not found/i)).toBeInTheDocument();
    });
    
    // Restore console.error
    console.error = originalError;
  });

  test('displays tabs with event details and related content', async () => {
    // Mock the event with additional data
    const mockEvent = {
      id: 1,
      title: 'Test Event',
      description: 'Test Description',
      start_time: '2025-02-01T10:00:00.000Z',
      end_time: '2025-02-01T12:00:00.000Z',
      location: 'Test Location',
      status: 'upcoming',
      created_by: 1,
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z',
      tasks: [
        { id: 1, title: 'Task 1', status: 'pending' },
        { id: 2, title: 'Task 2', status: 'completed' },
      ],
      attendees: [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'confirmed' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'pending' },
      ],
      budget: {
        id: 1,
        total_amount: 1000,
        spent_amount: 500,
      },
    };
    
    jest.spyOn(require('../../../services/eventService'), 'getEventById')
      .mockResolvedValueOnce({ data: mockEvent });
    
    renderWithProviders(<EventDetailPage />);
    
    // Wait for event to load
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
    
    // Check if tabs are rendered
    expect(screen.getByRole('tab', { name: /details/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /attendees/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /budget/i })).toBeInTheDocument();
    
    // Check if the default tab (Details) is active
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    
    // Test tab switching
    const tasksTab = screen.getByRole('tab', { name: /tasks/i });
    tasksTab.click();
    
    // Check if tasks are displayed
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });
});
