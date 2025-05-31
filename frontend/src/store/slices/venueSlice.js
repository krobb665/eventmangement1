import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { venuesApi } from '../../services/api';

export const fetchVenues = createAsyncThunk(
  'venues/fetchVenues',
  async (params, { rejectWithValue }) => {
    try {
      const response = await venuesApi.getVenues(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch venues');
    }
  }
);

export const fetchVenueById = createAsyncThunk(
  'venues/fetchVenueById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await venuesApi.getVenueById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch venue');
    }
  }
);

export const createVenue = createAsyncThunk(
  'venues/createVenue',
  async (venueData, { rejectWithValue }) => {
    try {
      const response = await venuesApi.createVenue(venueData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create venue');
    }
  }
);

export const updateVenue = createAsyncThunk(
  'venues/updateVenue',
  async ({ id, venueData }, { rejectWithValue }) => {
    try {
      const response = await venuesApi.updateVenue(id, venueData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update venue');
    }
  }
);

export const deleteVenue = createAsyncThunk(
  'venues/deleteVenue',
  async (id, { rejectWithValue }) => {
    try {
      await venuesApi.deleteVenue(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete venue');
    }
  }
);

const initialState = {
  venues: [],
  currentVenue: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 1,
  },
  filters: {
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
  },
};

const venueSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {
    clearCurrentVenue: (state) => {
      state.currentVenue = null;
    },
    setVenueFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetVenueFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Fetch Venues
    builder.addCase(fetchVenues.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchVenues.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.venues = payload.items || [];
      state.pagination = {
        page: payload.page || 1,
        perPage: payload.per_page || 10,
        total: payload.total || 0,
        totalPages: payload.pages || 1,
      };
    });
    builder.addCase(fetchVenues.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Fetch Venue By ID
    builder.addCase(fetchVenueById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchVenueById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.currentVenue = payload;
    });
    builder.addCase(fetchVenueById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Create Venue
    builder.addCase(createVenue.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createVenue.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.venues.unshift(payload);
    });
    builder.addCase(createVenue.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Update Venue
    builder.addCase(updateVenue.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateVenue.fulfilled, (state, { payload }) => {
      state.loading = false;
      const index = state.venues.findIndex(venue => venue.id === payload.id);
      if (index !== -1) {
        state.venues[index] = payload;
      }
      if (state.currentVenue && state.currentVenue.id === payload.id) {
        state.currentVenue = payload;
      }
    });
    builder.addCase(updateVenue.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Delete Venue
    builder.addCase(deleteVenue.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteVenue.fulfilled, (state, { payload: venueId }) => {
      state.loading = false;
      state.venues = state.venues.filter(venue => venue.id !== venueId);
      if (state.currentVenue && state.currentVenue.id === venueId) {
        state.currentVenue = null;
      }
    });
    builder.addCase(deleteVenue.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

// Export actions
export const {
  clearCurrentVenue,
  setVenueFilters,
  resetVenueFilters,
  setPagination,
} = venueSlice.actions;

// Selectors
export const selectVenues = (state) => state.venues.venues;
export const selectCurrentVenue = (state) => state.venues.currentVenue;
export const selectVenuesLoading = (state) => state.venues.loading;
export const selectVenuesError = (state) => state.venues.error;
export const selectVenuesPagination = (state) => state.venues.pagination;
export const selectVenueFilters = (state) => state.venues.filters;

export default venueSlice.reducer;
