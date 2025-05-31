import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/api';
import { setTokens, setUser, removeTokens, getUser } from '../../utils/auth';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(email, password);
      const { access_token, refresh_token, user } = response.data;
      
      // Save tokens and user data to localStorage
      setTokens(access_token, refresh_token);
      setUser(user);
      
      return { user };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      const { access_token, refresh_token, user } = response.data;
      
      // Save tokens and user data to localStorage
      setTokens(access_token, refresh_token);
      setUser(user);
      
      return { user };
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getMe();
      const user = response.data;
      
      // Update user data in localStorage
      setUser(user);
      
      return { user };
    } catch (error) {
      // If there's an error, remove tokens and user data
      removeTokens();
      return rejectWithValue('Session expired. Please log in again.');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(userData);
      const user = response.data;
      
      // Update user data in localStorage
      setUser(user);
      
      return { user };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      await authApi.changePassword(currentPassword, newPassword);
      return {};
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to change password');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  // In a real app, you might want to call a logout API endpoint here
  removeTokens();
  return {};
});

// Initial state
const initialState = {
  user: getUser(),
  isAuthenticated: !!getUser(),
  isLoading: false,
  error: null,
  success: false,
};

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = payload.user;
      state.success = true;
    });
    builder.addCase(login.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload || 'Login failed';
    });
    
    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = payload.user;
      state.success = true;
    });
    builder.addCase(register.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload || 'Registration failed';
    });
    
    // Fetch current user
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = payload.user;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = payload;
    });
    
    // Update profile
    builder.addCase(updateProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.user = payload.user;
      state.success = true;
    });
    builder.addCase(updateProfile.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload || 'Failed to update profile';
    });
    
    // Change password
    builder.addCase(changePassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.isLoading = false;
      state.success = true;
    });
    builder.addCase(changePassword.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload || 'Failed to change password';
    });
    
    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

// Export actions
export const { clearError, clearSuccess } = authSlice.actions;

// Export selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthSuccess = (state) => state.auth.success;

export default authSlice.reducer;
