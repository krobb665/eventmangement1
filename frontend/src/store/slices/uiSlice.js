import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Sidebar state
  isSidebarOpen: true,
  
  // Theme
  theme: 'light', // 'light' or 'dark'
  
  // Notifications
  notifications: [],
  
  // Loading states
  loading: {},
  
  // Modals
  modals: {},
  
  // Alerts
  alerts: [],
  
  // Mobile view state
  isMobileView: false,
  
  // Current page title
  pageTitle: 'Dashboard',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Toggle sidebar
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    
    // Set sidebar open/closed
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    
    // Toggle theme
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      // Save to localStorage
      localStorage.setItem('theme', state.theme);
    },
    
    // Set theme
    setTheme: (state, action) => {
      if (['light', 'dark'].includes(action.payload)) {
        state.theme = action.payload;
        // Save to localStorage
        localStorage.setItem('theme', state.theme);
      }
    },
    
    // Add notification
    addNotification: (state, action) => {
      const { id, type, message, autoHideDuration = 5000 } = action.payload;
      state.notifications.push({
        id: id || Date.now().toString(),
        type,
        message,
        autoHideDuration,
      });
    },
    
    // Remove notification
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    
    // Set loading state for a specific key
    setLoading: (state, action) => {
      const { key, isLoading } = action.payload;
      state.loading[key] = isLoading;
    },
    
    // Open modal
    openModal: (state, action) => {
      const { modalName, modalProps = {} } = action.payload;
      state.modals[modalName] = {
        isOpen: true,
        ...modalProps,
      };
    },
    
    // Close modal
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals[modalName]) {
        state.modals[modalName].isOpen = false;
      }
    },
    
    // Add alert
    addAlert: (state, action) => {
      const { id, type, message, autoHideDuration = 6000 } = action.payload;
      state.alerts.push({
        id: id || Date.now().toString(),
        type,
        message,
        autoHideDuration,
      });
    },
    
    // Remove alert
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload
      );
    },
    
    // Set mobile view
    setMobileView: (state, action) => {
      state.isMobileView = action.payload;
    },
    
    // Set page title
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload;
      document.title = `${action.payload} | Event Management System`;
    },
  },
});

// Export actions
export const {
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setTheme,
  addNotification,
  removeNotification,
  setLoading,
  openModal,
  closeModal,
  addAlert,
  removeAlert,
  setMobileView,
  setPageTitle,
} = uiSlice.actions;

// Selectors
export const selectIsSidebarOpen = (state) => state.ui.isSidebarOpen;
export const selectTheme = (state) => state.ui.theme;
export const selectNotifications = (state) => state.ui.notifications;
export const selectLoading = (state, key) => state.ui.loading[key] || false;
export const selectModal = (state, modalName) => state.ui.modals[modalName] || { isOpen: false };
export const selectAlerts = (state) => state.ui.alerts;
export const selectIsMobileView = (state) => state.ui.isMobileView;
export const selectPageTitle = (state) => state.ui.pageTitle;

export default uiSlice.reducer;
