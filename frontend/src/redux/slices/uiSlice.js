import { createSlice } from '@reduxjs/toolkit';

// UI slice for managing UI state like drawer open/close, dialogs, etc.
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    drawerOpen: false,
    projectDialogOpen: false,
    taskDialogOpen: false,
    confirmDialogOpen: false,
    confirmDialogProps: {
      title: '',
      message: '',
      confirmAction: null,
      cancelAction: null,
    },
  },
  reducers: {
    toggleDrawer: (state) => {
      state.drawerOpen = !state.drawerOpen;
    },
    setDrawerOpen: (state, action) => {
      state.drawerOpen = action.payload;
    },
    toggleProjectDialog: (state) => {
      state.projectDialogOpen = !state.projectDialogOpen;
    },
    setProjectDialogOpen: (state, action) => {
      state.projectDialogOpen = action.payload;
    },
    toggleTaskDialog: (state) => {
      state.taskDialogOpen = !state.taskDialogOpen;
    },
    setTaskDialogOpen: (state, action) => {
      state.taskDialogOpen = action.payload;
    },
    openConfirmDialog: (state, action) => {
      state.confirmDialogOpen = true;
      state.confirmDialogProps = action.payload;
    },
    closeConfirmDialog: (state) => {
      state.confirmDialogOpen = false;
      state.confirmDialogProps = {
        title: '',
        message: '',
        confirmAction: null,
        cancelAction: null,
      };
    },
  },
});

export const {
  toggleDrawer,
  setDrawerOpen,
  toggleProjectDialog,
  setProjectDialogOpen,
  toggleTaskDialog,
  setTaskDialogOpen,
  openConfirmDialog,
  closeConfirmDialog,
} = uiSlice.actions;

export default uiSlice.reducer;
