import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

// Mock the store
const mockStore = configureStore({
  reducer: {
    // Add your reducers here if needed
  },
  preloadedState: {
    // Add your initial state here if needed
  },
});

// Mock the theme
const theme = createTheme();

// Mock components that might cause issues in tests
jest.mock('./components/layout/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('./components/layout/Sidebar', () => () => <div data-testid="sidebar">Sidebar</div>);

// Helper function to render the app with all necessary providers
const renderWithProviders = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  
  return render(
    <Provider store={mockStore}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Router>
            {ui}
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
};

describe('App', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock the localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    
    global.localStorage = localStorageMock;
  });
  
  test('renders the app without crashing', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });
  
  test('renders the login page by default', async () => {
    renderWithProviders(<App />, { route: '/login' });
    
    // Check if the login form is rendered
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    });
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
  
  test('redirects to dashboard when user is authenticated', async () => {
    // Mock the useAuth hook to return an authenticated user
    jest.mock('./contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: {
          id: 1,
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          role: 'admin',
        },
      }),
    }));
    
    renderWithProviders(<App />, { route: '/dashboard' });
    
    // Check if the dashboard is rendered
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    });
  });
  
  test('shows 404 page for unknown routes', async () => {
    renderWithProviders(<App />, { route: '/some-unknown-route' });
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
      expect(screen.getByText(/the page you are looking for does not exist/i)).toBeInTheDocument();
    });
  });
});
