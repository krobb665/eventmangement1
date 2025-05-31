import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { budgetsApi } from '../../services/api';

export const fetchBudgets = createAsyncThunk(
  'budgets/fetchBudgets',
  async (params, { rejectWithValue }) => {
    try {
      const response = await budgetsApi.getBudgets(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch budgets');
    }
  }
);

export const fetchBudgetById = createAsyncThunk(
  'budgets/fetchBudgetById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await budgetsApi.getBudgetById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch budget');
    }
  }
);

export const createBudget = createAsyncThunk(
  'budgets/createBudget',
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await budgetsApi.createBudget(budgetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create budget');
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budgets/updateBudget',
  async ({ id, budgetData }, { rejectWithValue }) => {
    try {
      const response = await budgetsApi.updateBudget(id, budgetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update budget');
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (id, { rejectWithValue }) => {
    try {
      await budgetsApi.deleteBudget(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete budget');
    }
  }
);

export const fetchBudgetItems = createAsyncThunk(
  'budgets/fetchBudgetItems',
  async (budgetId, { rejectWithValue }) => {
    try {
      const response = await budgetsApi.getBudgetItems(budgetId);
      return { budgetId, items: response.data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch budget items');
    }
  }
);

export const createBudgetItem = createAsyncThunk(
  'budgets/createBudgetItem',
  async ({ budgetId, itemData }, { rejectWithValue }) => {
    try {
      const response = await budgetsApi.createBudgetItem(budgetId, itemData);
      return { budgetId, item: response.data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create budget item');
    }
  }
);

export const updateBudgetItem = createAsyncThunk(
  'budgets/updateBudgetItem',
  async ({ itemId, itemData }, { rejectWithValue }) => {
    try {
      const response = await budgetsApi.updateBudgetItem(itemId, itemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update budget item');
    }
  }
);

export const deleteBudgetItem = createAsyncThunk(
  'budgets/deleteBudgetItem',
  async (itemId, { rejectWithValue }) => {
    try {
      await budgetsApi.deleteBudgetItem(itemId);
      return itemId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete budget item');
    }
  }
);

const initialState = {
  budgets: [],
  currentBudget: null,
  budgetItems: {},
  loading: false,
  error: null,
  pagination: {
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 1,
  },
  filters: {
    event_id: null,
    status: null,
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  },
};

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    clearCurrentBudget: (state) => {
      state.currentBudget = null;
    },
    setBudgetFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetBudgetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Fetch Budgets
    builder.addCase(fetchBudgets.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBudgets.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.budgets = payload.items || [];
      state.pagination = {
        page: payload.page || 1,
        perPage: payload.per_page || 10,
        total: payload.total || 0,
        totalPages: payload.pages || 1,
      };
    });
    builder.addCase(fetchBudgets.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Fetch Budget By ID
    builder.addCase(fetchBudgetById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBudgetById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.currentBudget = payload;
    });
    builder.addCase(fetchBudgetById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Create Budget
    builder.addCase(createBudget.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createBudget.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.budgets.unshift(payload);
    });
    builder.addCase(createBudget.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Update Budget
    builder.addCase(updateBudget.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateBudget.fulfilled, (state, { payload }) => {
      state.loading = false;
      const index = state.budgets.findIndex(budget => budget.id === payload.id);
      if (index !== -1) {
        state.budgets[index] = payload;
      }
      if (state.currentBudget && state.currentBudget.id === payload.id) {
        state.currentBudget = payload;
      }
    });
    builder.addCase(updateBudget.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Delete Budget
    builder.addCase(deleteBudget.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteBudget.fulfilled, (state, { payload: budgetId }) => {
      state.loading = false;
      state.budgets = state.budgets.filter(budget => budget.id !== budgetId);
      if (state.currentBudget && state.currentBudget.id === budgetId) {
        state.currentBudget = null;
      }
    });
    builder.addCase(deleteBudget.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Fetch Budget Items
    builder.addCase(fetchBudgetItems.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBudgetItems.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.budgetItems[payload.budgetId] = payload.items || [];
    });
    builder.addCase(fetchBudgetItems.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Create Budget Item
    builder.addCase(createBudgetItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createBudgetItem.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (state.budgetItems[payload.budgetId]) {
        state.budgetItems[payload.budgetId].push(payload.item);
      } else {
        state.budgetItems[payload.budgetId] = [payload.item];
      }
    });
    builder.addCase(createBudgetItem.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Update Budget Item
    builder.addCase(updateBudgetItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateBudgetItem.fulfilled, (state, { payload }) => {
      state.loading = false;
      // Update the item in the budget items array if it exists
      Object.keys(state.budgetItems).forEach(budgetId => {
        const items = state.budgetItems[budgetId];
        const itemIndex = items.findIndex(item => item.id === payload.id);
        if (itemIndex !== -1) {
          state.budgetItems[budgetId][itemIndex] = payload;
        }
      });
    });
    builder.addCase(updateBudgetItem.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Delete Budget Item
    builder.addCase(deleteBudgetItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteBudgetItem.fulfilled, (state, { payload: itemId }) => {
      state.loading = false;
      // Remove the item from the budget items array if it exists
      Object.keys(state.budgetItems).forEach(budgetId => {
        state.budgetItems[budgetId] = state.budgetItems[budgetId].filter(
          item => item.id !== itemId
        );
      });
    });
    builder.addCase(deleteBudgetItem.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

// Export actions
export const {
  clearCurrentBudget,
  setBudgetFilters,
  resetBudgetFilters,
  setPagination,
} = budgetSlice.actions;

// Selectors
export const selectBudgets = (state) => state.budgets.budgets;
export const selectCurrentBudget = (state) => state.budgets.currentBudget;
export const selectBudgetItems = (budgetId) => (state) => 
  state.budgets.budgetItems[budgetId] || [];
export const selectBudgetsLoading = (state) => state.budgets.loading;
export const selectBudgetsError = (state) => state.budgets.error;
export const selectBudgetsPagination = (state) => state.budgets.pagination;
export const selectBudgetFilters = (state) => state.budgets.filters;

export default budgetSlice.reducer;
