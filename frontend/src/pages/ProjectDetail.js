import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  fetchProjectById, 
  updateProject, 
  deleteProject,
  clearCurrentProject 
} from '../redux/slices/projectSlice';
import { 
  fetchTasksByProject, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../redux/slices/taskSlice';
import { 
  setProjectDialogOpen, 
  setTaskDialogOpen, 
  openConfirmDialog, 
  closeConfirmDialog 
} from '../redux/slices/uiSlice';

// Validation schemas
const ProjectSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters')
    .required('Description is required'),
});

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
  dueDate: Yup.date()
    .nullable(),
});

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProject, loading: projectLoading } = useSelector((state) => state.projects);
  const { projectTasks, loading: tasksLoading } = useSelector((state) => state.tasks);
  const { projectDialogOpen, taskDialogOpen, confirmDialogOpen, confirmDialogProps } = useSelector((state) => state.ui);
  
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    dispatch(fetchProjectById(id));
    dispatch(fetchTasksByProject(id));
    
    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch, id]);

  const handleOpenProjectDialog = () => {
    dispatch(setProjectDialogOpen(true));
  };

  const handleCloseProjectDialog = () => {
    dispatch(setProjectDialogOpen(false));
  };

  const handleOpenTaskDialog = (task = null) => {
    setEditingTask(task);
    dispatch(setTaskDialogOpen(true));
  };

  const handleCloseTaskDialog = () => {
    setEditingTask(null);
    dispatch(setTaskDialogOpen(false));
  };

  const handleSubmitProject = (values) => {
    dispatch(updateProject({ id, projectData: values }));
    handleCloseProjectDialog();
  };

  const handleSubmitTask = (values, { resetForm }) => {
    if (editingTask) {
      dispatch(updateTask({ id: editingTask.id, taskData: values }));
    } else {
      dispatch(createTask({ ...values, projectId: id }));
    }
    resetForm();
    handleCloseTaskDialog();
  };

  const handleDeleteProject = () => {
    dispatch(
      openConfirmDialog({
        title: 'Delete Project',
        message: `Are you sure you want to delete "${currentProject?.name}"? This action cannot be undone and will delete all associated tasks.`,
        confirmAction: () => {
          dispatch(deleteProject(id));
          dispatch(closeConfirmDialog());
          navigate('/projects');
        },
        cancelAction: () => dispatch(closeConfirmDialog()),
      })
    );
  };

  const handleDeleteTask = (task) => {
    dispatch(
      openConfirmDialog({
        title: 'Delete Task',
        message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
        confirmAction: () => {
          dispatch(deleteTask(task.id));
          dispatch(closeConfirmDialog());
        },
        cancelAction: () => dispatch(closeConfirmDialog()),
      })
    );
  };

  const loading = projectLoading || tasksLoading;

  if (loading && !currentProject) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentProject && !loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Project not found
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/projects')}
          sx={{ mt: 2 }}
        >
          Back to Projects
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/projects')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {currentProject?.name}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleOpenProjectDialog}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteProject}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Project Details */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Project Details
        </Typography>
        <Typography variant="body1" paragraph>
          {currentProject?.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(currentProject?.createdAt).toLocaleDateString()}
            </Typography>
            {currentProject?.updatedAt && (
              <Typography variant="body2" color="text.secondary">
                Last Updated: {new Date(currentProject?.updatedAt).toLocaleDateString()}
              </Typography>
            )}
          </Box>
          <Chip
            label={`${projectTasks.length} Tasks`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* Tasks Section */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Tasks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenTaskDialog()}
        >
          Add Task
        </Button>
      </Box>

      {tasksLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projectTasks.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" gutterBottom>
                  No tasks found for this project
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenTaskDialog()}
                  sx={{ mt: 2 }}
                >
                  Create First Task
                </Button>
              </Paper>
            </Grid>
          ) : (
            projectTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {task.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {task.description}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={task.status}
                        color={
                          task.status === 'Completed'
                            ? 'success'
                            : task.status === 'In Progress'
                            ? 'info'
                            : 'warning'
                        }
                        size="small"
                      />
                      {task.dueDate && (
                        <Typography variant="caption" color="text.secondary">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenTaskDialog(task)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteTask(task)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Project Edit Dialog */}
      <Dialog open={projectDialogOpen} onClose={handleCloseProjectDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <Formik
          initialValues={{
            name: currentProject?.name || '',
            description: currentProject?.description || '',
          }}
          validationSchema={ProjectSchema}
          onSubmit={handleSubmitProject}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Project Name"
                  fullWidth
                  variant="outlined"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <Field
                  as={TextField}
                  margin="dense"
                  name="description"
                  label="Description"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseProjectDialog}>Cancel</Button>
                <Button type="submit" variant="contained">
                  Update
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onClose={handleCloseTaskDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <Formik
          initialValues={{
            title: editingTask?.title || '',
            description: editingTask?.description || '',
            status: editingTask?.status || 'Pending',
            dueDate: editingTask?.dueDate || '',
          }}
          validationSchema={TaskSchema}
          onSubmit={handleSubmitTask}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue, values }) => (
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
                  name="status"
                  label="Status"
                  fullWidth
                  variant="outlined"
                  error={touched.status && Boolean(errors.status)}
                  helperText={touched.status && errors.status}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
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
                  {editingTask ? 'Update' : 'Create'}
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

export default ProjectDetail;
