import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventsApi } from '../../services/api';

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (params, { rejectWithValue }) => {
    try {
      const response = await eventsApi.getEvents(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch events');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await eventsApi.getEventById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch event');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await eventsApi.createEvent(eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const response = await eventsApi.updateEvent(id, eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await eventsApi.deleteEvent(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete event');
    }
  }
);

export const uploadEventCover = createAsyncThunk(
  'events/uploadEventCover',
  async ({ eventId, file }, { rejectWithValue }) => {
    try {
      const response = await eventsApi.uploadEventCover(eventId, file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload event cover');
    }
  }
);

const initialState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 1,
  },
  filters: {
    status: null,
    search: '',
    sortBy: 'start_date',
    sortOrder: 'asc',
  },
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    setEventFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetEventFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Fetch Events
    builder.addCase(fetchEvents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchEvents.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.events = payload.items || [];
      state.pagination = {
        page: payload.page || 1,
        perPage: payload.per_page || 10,
        total: payload.total || 0,
        totalPages: payload.pages || 1,
      };
    });
    builder.addCase(fetchEvents.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Fetch Event By ID
    builder.addCase(fetchEventById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchEventById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.currentEvent = payload;
    });
    builder.addCase(fetchEventById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Create Event
    builder.addCase(createEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createEvent.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.events.unshift(payload);
    });
    builder.addCase(createEvent.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Update Event
    builder.addCase(updateEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateEvent.fulfilled, (state, { payload }) => {
      state.loading = false;
      const index = state.events.findIndex(event => event.id === payload.id);
      if (index !== -1) {
        state.events[index] = payload;
      }
      if (state.currentEvent && state.currentEvent.id === payload.id) {
        state.currentEvent = payload;
      }
    });
    builder.addCase(updateEvent.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Delete Event
    builder.addCase(deleteEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteEvent.fulfilled, (state, { payload: eventId }) => {
      state.loading = false;
      state.events = state.events.filter(event => event.id !== eventId);
      if (state.currentEvent && state.currentEvent.id === eventId) {
        state.currentEvent = null;
      }
    });
    builder.addCase(deleteEvent.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Upload Event Cover
    builder.addCase(uploadEventCover.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(uploadEventCover.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (state.currentEvent) {
        state.currentEvent.cover_image = payload.cover_image;
      }
    });
    builder.addCase(uploadEventCover.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

// Export actions
export const {
  clearCurrentEvent,
  setEventFilters,
  resetEventFilters,
  setPagination,
} = eventSlice.actions;

// Selectors
export const selectEvents = (state) => state.events.events;
export const selectCurrentEvent = (state) => state.events.currentEvent;
export const selectEventsLoading = (state) => state.events.loading;
export const selectEventsError = (state) => state.events.error;
export const selectEventsPagination = (state) => state.events.pagination;
export const selectEventFilters = (state) => state.events.filters;

export default eventSlice.reducer;
