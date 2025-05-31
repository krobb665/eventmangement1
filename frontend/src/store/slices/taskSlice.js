import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tasksApi } from '../../services/api';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params, { rejectWithValue }) => {
    try {
      const response = await tasksApi.getTasks(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tasksApi.getTaskById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch task');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await tasksApi.createTask(taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await tasksApi.updateTask(id, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await tasksApi.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete task');
    }
  }
);

export const completeTask = createAsyncThunk(
  'tasks/completeTask',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tasksApi.completeTask(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to complete task');
    }
  }
);

const initialState = {
  tasks: [],
  currentTask: null,
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
    priority: null,
    assigned_to: null,
    event_id: null,
    search: '',
    sortBy: 'due_date',
    sortOrder: 'asc',
  },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    setTaskFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetTaskFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Fetch Tasks
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.tasks = payload.items || [];
      state.pagination = {
        page: payload.page || 1,
        perPage: payload.per_page || 10,
        total: payload.total || 0,
        totalPages: payload.pages || 1,
      };
    });
    builder.addCase(fetchTasks.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Fetch Task By ID
    builder.addCase(fetchTaskById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTaskById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.currentTask = payload;
    });
    builder.addCase(fetchTaskById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Create Task
    builder.addCase(createTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createTask.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.tasks.unshift(payload);
    });
    builder.addCase(createTask.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Update Task
    builder.addCase(updateTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateTask.fulfilled, (state, { payload }) => {
      state.loading = false;
      const index = state.tasks.findIndex(task => task.id === payload.id);
      if (index !== -1) {
        state.tasks[index] = payload;
      }
      if (state.currentTask && state.currentTask.id === payload.id) {
        state.currentTask = payload;
      }
    });
    builder.addCase(updateTask.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Delete Task
    builder.addCase(deleteTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteTask.fulfilled, (state, { payload: taskId }) => {
      state.loading = false;
      state.tasks = state.tasks.filter(task => task.id !== taskId);
      if (state.currentTask && state.currentTask.id === taskId) {
        state.currentTask = null;
      }
    });
    builder.addCase(deleteTask.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Complete Task
    builder.addCase(completeTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(completeTask.fulfilled, (state, { payload }) => {
      state.loading = false;
      const index = state.tasks.findIndex(task => task.id === payload.id);
      if (index !== -1) {
        state.tasks[index] = payload;
      }
      if (state.currentTask && state.currentTask.id === payload.id) {
        state.currentTask = payload;
      }
    });
    builder.addCase(completeTask.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

// Export actions
export const {
  clearCurrentTask,
  setTaskFilters,
  resetTaskFilters,
  setPagination,
} = taskSlice.actions;

// Selectors
export const selectTasks = (state) => state.tasks.tasks;
export const selectCurrentTask = (state) => state.tasks.currentTask;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;
export const selectTasksPagination = (state) => state.tasks.pagination;
export const selectTaskFilters = (state) => state.tasks.filters;

export default taskSlice.reducer;
