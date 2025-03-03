import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Async thunks
export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
  const response = await axios.get(`${API_URL}/items`);
  return response.data.data;
});

export const addItem = createAsyncThunk('items/addItem', async (newItem) => {
  const response = await axios.post(`${API_URL}/items`, newItem);
  return response.data.data;
});

export const updateItem = createAsyncThunk('items/updateItem', async (item) => {
  const response = await axios.put(`${API_URL}/items/${item.id}`, item);
  return response.data.data;
});

export const deleteItem = createAsyncThunk('items/deleteItem', async (id) => {
  await axios.delete(`${API_URL}/items/${id}`);
  return id;
});

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch items
      .addCase(fetchItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Add item
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      
      // Update item
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      
      // Delete item
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default itemsSlice.reducer;
