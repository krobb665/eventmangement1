import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  login as loginAction, 
  register as registerAction, 
  logout as logoutAction, 
  fetchCurrentUser,
  updateProfile as updateProfileAction,
  changePassword as changePasswordAction
} from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const { user, isAuthenticated, isLoading, error, success } = useSelector((state) => ({
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    error: state.auth.error,
    success: state.auth.success,
  }));
  
  // Local state for auth status check
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(fetchCurrentUser()).unwrap();
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setAuthCheckComplete(true);
      }
    };
    
    checkAuth();
  }, [dispatch]);
  
  // Login function
  const login = async (email, password) => {
    try {
      await dispatch(loginAction({ email, password })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };
  
  // Register function
  const register = async (userData) => {
    try {
      await dispatch(registerAction(userData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      await dispatch(logoutAction()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // Update profile function
  const updateProfile = async (userData) => {
    try {
      await dispatch(updateProfileAction(userData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };
  
  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await dispatch(changePasswordAction({ currentPassword, newPassword })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };
  
  // Check if user has specific role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };
  
  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };
  
  const value = {
    user,
    isAuthenticated,
    isLoading: isLoading || !authCheckComplete,
    error,
    success,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    hasAnyRole,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {authCheckComplete ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
