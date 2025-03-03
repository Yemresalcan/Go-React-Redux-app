import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching projects...');
      
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
      
      console.log('Making API request to:', `${API_URL}/projects`);
      console.log('With auth header:', config.headers.Authorization);
      
      // API isteği
      const response = await axios.get(`${API_URL}/projects`, config);
      
      console.log('Projects response:', response.data);
      
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
        // Eğer response.data içinde projects array'i varsa
        else if (Array.isArray(response.data.projects)) {
          return response.data.projects;
        }
        // Hiçbir yapı tanınmadıysa boş array döndür
        else {
          console.warn('Unexpected API response structure:', response.data);
          return [];
        }
      } else {
        const message = 'Failed to fetch projects: Empty response';
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      console.error('Fetch projects error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        // Burada logout action'ı dispatch edilebilir
      } else {
        const message = error.response?.data?.error || 'Failed to fetch projects';
        toast.error(message);
      }
      
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/projects/${id}`);
      
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
        const message = 'Failed to fetch project: Empty response';
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to fetch project';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/projects`, projectData);
      
      // API yanıt yapısını kontrol et - backend yapısına göre ayarlandı
      if (response.data) {
        // Eğer response.data.success yapısı varsa
        if (response.data.success === true) {
          toast.success('Project created successfully!');
          return response.data.data || null;
        } 
        // Eğer response.data doğrudan bir object ise
        else if (typeof response.data === 'object') {
          toast.success('Project created successfully!');
          return response.data;
        }
        // Hiçbir yapı tanınmadıysa null döndür
        else {
          console.warn('Unexpected API response structure:', response.data);
          return null;
        }
      } else {
        const message = 'Failed to create project: Empty response';
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create project';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/projects/${id}`, projectData);
      
      // API yanıt yapısını kontrol et - backend yapısına göre ayarlandı
      if (response.data) {
        // Eğer response.data.success yapısı varsa
        if (response.data.success === true) {
          toast.success('Project updated successfully!');
          return response.data.data || null;
        } 
        // Eğer response.data doğrudan bir object ise
        else if (typeof response.data === 'object') {
          toast.success('Project updated successfully!');
          return response.data;
        }
        // Hiçbir yapı tanınmadıysa null döndür
        else {
          console.warn('Unexpected API response structure:', response.data);
          return null;
        }
      } else {
        const message = 'Failed to update project: Empty response';
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update project';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/projects/${id}`);
      
      // API yanıt yapısını kontrol et - backend yapısına göre ayarlandı
      if (response.data) {
        // Eğer response.data.success yapısı varsa
        if (response.data.success === true) {
          toast.success('Project deleted successfully!');
          return id;
        } 
        // Hiçbir yapı tanınmadıysa null döndür
        else {
          console.warn('Unexpected API response structure:', response.data);
          return null;
        }
      } else {
        const message = 'Failed to delete project: Empty response';
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete project';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Project slice
const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearProjectError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Project By Id
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.map(project => 
          project.id === action.payload.id ? action.payload : project
        );
        if (state.currentProject && state.currentProject.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(project => project.id !== action.payload);
        if (state.currentProject && state.currentProject.id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProject, clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;
