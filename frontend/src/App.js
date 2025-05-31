import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClerkProvider, SignedIn } from '@clerk/clerk-react';

// Store
import store from './store/store';

// Clerk configuration
import { clerkConfig } from './utils/auth';

// Components
import WebSocketManager from './components/WebSocketManager';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SsoCallbackPage from './pages/auth/SsoCallbackPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
// Import actual page components that exist
import EventsPage from './pages/events/EventsPage';
import EventDetailPage from './pages/events/EventDetailPage';
import CreateEventPage from './pages/events/CreateEventPage';
import EditEventPage from './pages/events/EditEventPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Placeholder components for features coming soon
import ComingSoon from './components/placeholders/ComingSoon';

// Use ComingSoon for pages that don't exist yet
const VenuesPage = () => <ComingSoon title="Venues" />;
const VenueDetailPage = () => <ComingSoon title="Venue Details" />;
const TasksPage = () => <ComingSoon title="Tasks" />;
const TaskDetailPage = () => <ComingSoon title="Task Details" />;
const CreateTaskPage = () => <ComingSoon title="Create Task" />;
const EditTaskPage = () => <ComingSoon title="Edit Task" />;
const VendorsPage = () => <ComingSoon title="Vendors" />;
const VendorDetailPage = () => <ComingSoon title="Vendor Details" />;
const CreateVendorPage = () => <ComingSoon title="Create Vendor" />;
const EditVendorPage = () => <ComingSoon title="Edit Vendor" />;
const StaffPage = () => <ComingSoon title="Staff" />;
const StaffDetailPage = () => <ComingSoon title="Staff Details" />;
const CreateStaffPage = () => <ComingSoon title="Create Staff" />;
const EditStaffPage = () => <ComingSoon title="Edit Staff" />;
const GuestsPage = () => <ComingSoon title="Guests" />;
const GuestDetailPage = () => <ComingSoon title="Guest Details" />;
const CreateGuestPage = () => <ComingSoon title="Create Guest" />;
const EditGuestPage = () => <ComingSoon title="Edit Guest" />;
const BudgetsPage = () => <ComingSoon title="Budgets" />;
const BudgetDetailPage = () => <ComingSoon title="Budget Details" />;
const CreateBudgetPage = () => <ComingSoon title="Create Budget" />;
const EditBudgetPage = () => <ComingSoon title="Edit Budget" />;
const ReportsPage = () => <ComingSoon title="Reports" />;

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#fff',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return (
    <SignedIn>
      <WebSocketManager>
        <MainLayout>
          {children}
        </MainLayout>
      </WebSocketManager>
    </SignedIn>
  );
};

// Auth Layout Wrapper
const AuthLayoutWrapper = ({ children }) => (
  <AuthLayout>
    {children}
  </AuthLayout>
);

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Root route with nested public and protected routes */}
      <Route path="/">
        {/* Public routes */}
        <Route index element={<HomePage />} />
        
        {/* Auth routes */}
        <Route path="login" element={
          <AuthLayoutWrapper>
            <LoginPage />
          </AuthLayoutWrapper>
        } />
        
        <Route path="register" element={
          <AuthLayoutWrapper>
            <RegisterPage />
          </AuthLayoutWrapper>
        } />
        
        <Route path="sso-callback" element={<SsoCallbackPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected routes */}
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          
          {/* Events */}
          <Route path="events">
            <Route index element={<EventsPage />} />
            <Route path="create" element={<CreateEventPage />} />
            <Route path=":id" element={<EventDetailPage />} />
            <Route path=":id/edit" element={<EditEventPage />} />
          </Route>
        
          {/* Venues */}
          <Route path="venues">
            <Route index element={<VenuesPage />} />
            <Route path=":id" element={<VenueDetailPage />} />
          </Route>
          
          {/* Tasks */}
          <Route path="tasks">
            <Route index element={<TasksPage />} />
            <Route path="create" element={<CreateTaskPage />} />
            <Route path=":id" element={<TaskDetailPage />} />
            <Route path=":id/edit" element={<EditTaskPage />} />
          </Route>
          
          {/* Vendors */}
          <Route path="vendors">
            <Route index element={<VendorsPage />} />
            <Route path="create" element={<CreateVendorPage />} />
            <Route path=":id" element={<VendorDetailPage />} />
            <Route path=":id/edit" element={<EditVendorPage />} />
          </Route>
          
          {/* Staff */}
          <Route path="staff">
            <Route index element={<StaffPage />} />
            <Route path="create" element={<CreateStaffPage />} />
            <Route path=":id" element={<StaffDetailPage />} />
            <Route path=":id/edit" element={<EditStaffPage />} />
          </Route>
          
          {/* Guests */}
          <Route path="guests">
            <Route index element={<GuestsPage />} />
            <Route path="create" element={<CreateGuestPage />} />
            <Route path=":id" element={<GuestDetailPage />} />
            <Route path=":id/edit" element={<EditGuestPage />} />
          </Route>
          
          {/* Budgets */}
          <Route path="budgets">
            <Route index element={<BudgetsPage />} />
            <Route path="create" element={<CreateBudgetPage />} />
            <Route path=":id" element={<BudgetDetailPage />} />
            <Route path=":id/edit" element={<EditBudgetPage />} />
          </Route>
          
          {/* Reports */}
          <Route path="reports" element={<ReportsPage />} />
          
          {/* Profile & Settings */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={
        <SignedIn>
          <MainLayout>
            <NotFoundPage />
          </MainLayout>
        </SignedIn>
      } />
    </Routes>
  );
};

// App Component
const App = () => {
  return (
    <ClerkProvider {...clerkConfig}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <WebSocketManager>
            <AppRoutes />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </WebSocketManager>
        </ThemeProvider>
      </Provider>
    </ClerkProvider>
  );
};

export default App;
