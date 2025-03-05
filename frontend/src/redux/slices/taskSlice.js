import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching tasks...');
      
      // Token kontrolü
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        toast.error('Authentication required. Please login.');
        return rejectWithValue('Authentication required');
      }
      
      // Ensure token is set in headers for this request
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      console.log('Making API request to:', `${API_URL}/tasks`);
      console.log('With auth header:', config.headers.Authorization);
      
      // API isteği
      const response = await axios.get(`${API_URL}/tasks`, config);
      
      console.log('Tasks response:', response.data);
      
      // API yanıt yapısını kontrol et - backend yapısına göre ayarlandı
      if (response.data) {
        // Eğer response.data.success yapısı varsa
        if (response.data.success === true) {
          return response.data.data || [];
        } 
        // Eğer response.data doğrudan bir array ise
        else if (Array.isArray(response.data)) {
          return response.data;
        }
        // Eğer response.data içinde tasks array'i varsa
        else if (Array.isArray(response.data.tasks)) {
          return response.data.tasks;
        }
        // Hiçbir yapı tanınmadıysa boş array döndür
        else {
          console.warn('Unexpected API response structure:', response.data);
          return [];
        }
      } else {
        const message = 'Failed to fetch tasks: Empty response';
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      console.error('Fetch tasks error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        // Burada logout action'ı dispatch edilebilir
      } else {
        const message = error.response?.data?.error || 'Failed to fetch tasks';
        toast.error(message);
      }
      
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }
);

export const fetchTasksByProject = createAsyncThunk(
  'tasks/fetchTasksByProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };
      
      console.log('Making API request to:', `${API_URL}/projects/${projectId}/tasks`);
      console.log('With auth header:', config.headers.Authorization);
      
      const response = await axios.get(`${API_URL}/projects/${projectId}/tasks`, config);
      
      console.log('Tasks response:', response.data);
      
      // API yanıt yapısını kontrol et - backend yapısına göre ayarlandı
      if (response.data) {
        // Eğer response.data.success yapısı varsa
        if (response.data.success === true) {
          return response.data.data || [];
        } 
        // Eğer response.data doğrudan bir array ise
        else if (Array.isArray(response.data)) {
          return response.data;
        }
        // Eğer response.data içinde tasks array'i varsa
        else if (Array.isArray(response.data.tasks)) {
          return response.data.tasks;
        }
        // Hiçbir yapı tanınmadıysa boş array döndür
        else {
          console.warn('Unexpected API response structure:', response.data);
          return [];
        }
      } else {
        const message = 'Failed to fetch tasks: Empty response';
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      console.error('Fetch tasks error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        // Burada logout action'ı dispatch edilebilir
      } else {
        const message = error.response?.data?.error || 'Failed to fetch tasks';
        toast.error(message);
      }
      
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };
      
      console.log('Making API request to:', `${API_URL}/tasks/${id}`);
      console.log('With auth header:', config.headers.Authorization);
      
      const response = await axios.get(`${API_URL}/tasks/${id}`, config);
      
      console.log('Task response:', response.data);
      
      // API yanıt yapısını kontrol et - backend yapısına göre ayarlandı
      if (response.data) {
        // Eğer response.data.success yapısı varsa
        if (response.data.success === true) {
          return response.data.data || null;
        } 
        // Eğer response.data doğrudan bir object ise
        else if (typeof response.data === 'object') {
          return response.data;
        }
        // Hiçbir yapı tanınmadıysa null döndür
        else {
          console.warn('Unexpected API response structure:', response.data);
          return null;
        }
      } else {
        const message = 'Failed to fetch task: Empty response';
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      console.error('Fetch task error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        // Burada logout action'ı dispatch edilebilir
      } else {
        const message = error.response?.data?.error || 'Failed to fetch task';
        toast.error(message);
      }
      
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch task');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };
      
      console.log('Making API request to:', `${API_URL}/tasks`);
      console.log('With auth header:', config.headers.Authorization);
      console.log('Task data being sent:', JSON.stringify(taskData, null, 2));
      
      const response = await axios.post(`${API_URL}/tasks`, taskData, config);
      
      console.log('Task response:', response.data);
      
      // API yanıt yapısını kontrol et - backend yapısına göre ayarlandı
      if (response.data) {
        // Eğer response.data.success yapısı varsa
        if (response.data.success === true) {
          toast.success('Task created successfully!');
          return response.data.data || null;
        } 
        // Hiçbir yapı tanınmadıysa null döndür
        else {
          console.warn('Unexpected API response structure:', response.data);
          return null;
        }
      } else {
        const message = 'Failed to create task: Empty response';
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      console.error('Create task error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        // Burada logout action'ı dispatch edilebilir
      } else {
        const message = error.response?.data?.error || 'Failed to create task';
        toast.error(message);
      }
      
      return rejectWithValue(error.response?.data?.error || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };
      
      console.log('Making API request to:', `${API_URL}/tasks/${id}`);
      console.log('With auth header:', config.headers.Authorization);
      console.log('Task data being sent:', JSON.stringify(taskData, null, 2));
      
      const response = await axios.put(`${API_URL}/tasks/${id}`, taskData, config);
      
      console.log('Task response:', response.data);
      
      // API yanıt yapısını kontrol et - backend yapısına göre ayarlandı
      if (response.data) {
        // Eğer response.data.success yapısı varsa
        if (response.data.success === true) {
          toast.success('Task updated successfully!');
          return response.data.data || null;
        } 
        // Hiçbir yapı tanınmadıysa null döndür
        else {
          console.warn('Unexpected API response structure:', response.data);
          return null;
        }
      } else {
        const message = 'Failed to update task: Empty response';
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      console.error('Update task error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        // Burada logout action'ı dispatch edilebilir
      } else {
        const message = error.response?.data?.error || 'Failed to update task';
        toast.error(message);
      }
      
      return rejectWithValue(error.response?.data?.error || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };
      
      console.log('Making API request to:', `${API_URL}/tasks/${id}`);
      console.log('With auth header:', config.headers.Authorization);
      
      const response = await axios.delete(`${API_URL}/tasks/${id}`, config);
      
      console.log('Task response:', response.data);
      
      // API yanıt yapısını kontrol et - backend yapısına göre ayarlandı
      if (response.data) {
        // Eğer response.data.success yapısı varsa
        if (response.data.success === true) {
          toast.success('Task deleted successfully!');
          return id;
        } 
        // Hiçbir yapı tanınmadıysa null döndür
        else {
          console.warn('Unexpected API response structure:', response.data);
          return null;
        }
      } else {
        const message = 'Failed to delete task: Empty response';
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      console.error('Delete task error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        // Burada logout action'ı dispatch edilebilir
      } else {
        const message = error.response?.data?.error || 'Failed to delete task';
        toast.error(message);
      }
      
      return rejectWithValue(error.response?.data?.error || 'Failed to delete task');
    }
  }
);

// Task slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    projectTasks: [],
    currentTask: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Tasks By Project
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTasks = action.payload;
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Task By Id
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        if (state.projectTasks.length > 0 && 
            action.payload.projectId === state.projectTasks[0]?.projectId) {
          state.projectTasks.push(action.payload);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        );
        state.projectTasks = state.projectTasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        );
        if (state.currentTask && state.currentTask.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.projectTasks = state.projectTasks.filter(task => task.id !== action.payload);
        if (state.currentTask && state.currentTask.id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentTask, clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
