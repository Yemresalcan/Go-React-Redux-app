import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  fetchTaskById, 
  updateTask, 
  deleteTask,
  clearCurrentTask 
} from '../redux/slices/taskSlice';
import { fetchProjects } from '../redux/slices/projectSlice';
import { 
  setTaskDialogOpen, 
  openConfirmDialog, 
  closeConfirmDialog 
} from '../redux/slices/uiSlice';

// Validation schema
const TaskSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters')
    .required('Description is required'),
  status: Yup.string()
    .oneOf(['Pending', 'In Progress', 'Completed'], 'Invalid status')
    .required('Status is required'),
  projectId: Yup.string()
    .required('Project is required'),
  dueDate: Yup.date()
    .nullable(),
});

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentTask, loading: taskLoading } = useSelector((state) => state.tasks);
  const { projects, loading: projectsLoading } = useSelector((state) => state.projects);
  const { taskDialogOpen, confirmDialogOpen, confirmDialogProps } = useSelector((state) => state.ui);

  useEffect(() => {
    dispatch(fetchTaskById(id));
    dispatch(fetchProjects());
    
    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentTask());
    };
  }, [dispatch, id]);

  const handleOpenTaskDialog = () => {
    dispatch(setTaskDialogOpen(true));
  };

  const handleCloseTaskDialog = () => {
    dispatch(setTaskDialogOpen(false));
  };

  const handleSubmitTask = (values) => {
    dispatch(updateTask({ id, taskData: values }));
    handleCloseTaskDialog();
  };

  const handleDeleteTask = () => {
    dispatch(
      openConfirmDialog({
        title: 'Delete Task',
        message: `Are you sure you want to delete "${currentTask?.title}"? This action cannot be undone.`,
        confirmAction: () => {
          dispatch(deleteTask(id));
          dispatch(closeConfirmDialog());
          navigate('/tasks');
        },
        cancelAction: () => dispatch(closeConfirmDialog()),
      })
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'info';
      default:
        return 'warning';
    }
  };

  const loading = taskLoading || projectsLoading;

  if (loading && !currentTask) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentTask && !loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Task not found
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/tasks')}
          sx={{ mt: 2 }}
        >
          Back to Tasks
        </Button>
      </Box>
    );
  }

  const project = projects.find(p => p.id === currentTask?.projectId);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/tasks')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Task Details
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleOpenTaskDialog}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteTask}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Task Details */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              {currentTask?.title}
            </Typography>
            <Chip
              label={currentTask?.status}
              color={getStatusColor(currentTask?.status)}
              sx={{ mb: 2 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle1" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {currentTask?.description}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Details
              </Typography>
              
              {project && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Project:
                  </Typography>
                  <Typography variant="body1">
                    {project.name}
                  </Typography>
                </Box>
              )}
              
              {currentTask?.dueDate && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Due Date:
                  </Typography>
                  <Typography variant="body1">
                    {new Date(currentTask.dueDate).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Created:
                </Typography>
                <Typography variant="body1">
                  {new Date(currentTask?.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              
              {currentTask?.updatedAt && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated:
                  </Typography>
                  <Typography variant="body1">
                    {new Date(currentTask.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Task Edit Dialog */}
      <Dialog open={taskDialogOpen} onClose={handleCloseTaskDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <Formik
          initialValues={{
            title: currentTask?.title || '',
            description: currentTask?.description || '',
            status: currentTask?.status || 'Pending',
            projectId: currentTask?.projectId || '',
            dueDate: currentTask?.dueDate || '',
          }}
          validationSchema={TaskSchema}
          onSubmit={handleSubmitTask}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  autoFocus
                  margin="dense"
                  name="title"
                  label="Task Title"
                  fullWidth
                  variant="outlined"
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                />
                <Field
                  as={TextField}
                  margin="dense"
                  name="description"
                  label="Description"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
                <Field
                  as={TextField}
                  select
                  margin="dense"
                  name="projectId"
                  label="Project"
                  fullWidth
                  variant="outlined"
                  error={touched.projectId && Boolean(errors.projectId)}
                  helperText={touched.projectId && errors.projectId}
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  as={TextField}
                  select
                  margin="dense"
                  name="status"
                  label="Status"
                  fullWidth
                  variant="outlined"
                  error={touched.status && Boolean(errors.status)}
                  helperText={touched.status && errors.status}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Field>
                <Field
                  as={TextField}
                  margin="dense"
                  name="dueDate"
                  label="Due Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={touched.dueDate && Boolean(errors.dueDate)}
                  helperText={touched.dueDate && errors.dueDate}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseTaskDialog}>Cancel</Button>
                <Button type="submit" variant="contained">
                  Update
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => dispatch(closeConfirmDialog())}>
        <DialogTitle>{confirmDialogProps.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialogProps.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(closeConfirmDialog())}>Cancel</Button>
          <Button onClick={confirmDialogProps.confirmAction} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskDetail;
