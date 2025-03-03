import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask 
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

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);
  const { projects, loading: projectsLoading } = useSelector((state) => state.projects);
  const { taskDialogOpen, confirmDialogOpen, confirmDialogProps } = useSelector((state) => state.ui);
  
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleOpenTaskDialog = (task = null) => {
    setEditingTask(task);
    dispatch(setTaskDialogOpen(true));
  };

  const handleCloseTaskDialog = () => {
    setEditingTask(null);
    dispatch(setTaskDialogOpen(false));
  };

  const handleSubmitTask = (values, { resetForm }) => {
    if (editingTask) {
      dispatch(updateTask({ id: editingTask.id, taskData: values }));
    } else {
      dispatch(createTask(values));
    }
    resetForm();
    handleCloseTaskDialog();
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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setFilterStatus('');
    setFilterProject('');
  };

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesProject = !filterProject || task.projectId === filterProject;
    return matchesStatus && matchesProject;
  });

  const loading = tasksLoading || projectsLoading;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Tasks</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={toggleFilters}
            sx={{ mr: 1 }}
          >
            Filters
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenTaskDialog()}
          >
            New Task
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      {showFilters && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth size="small">
                <InputLabel id="project-filter-label">Project</InputLabel>
                <Select
                  labelId="project-filter-label"
                  id="project-filter"
                  value={filterProject}
                  label="Project"
                  onChange={(e) => setFilterProject(e.target.value)}
                >
                  <MenuItem value="">All Projects</MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="outlined"
                onClick={clearFilters}
                fullWidth
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredTasks.length === 0 ? (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  border: '1px dashed grey',
                  borderRadius: 1,
                  height: 200,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No tasks found
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {filterStatus || filterProject 
                    ? 'Try changing your filters or create a new task'
                    : 'Create your first task to get started'}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenTaskDialog()}
                  sx={{ mt: 2 }}
                >
                  Create Task
                </Button>
              </Box>
            </Grid>
          ) : (
            filteredTasks.map((task) => (
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
                    {task.projectId && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Project: {projects.find(p => p.id === task.projectId)?.name || 'Unknown'}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/tasks/${task.id}`}
                    >
                      View
                    </Button>
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

      {/* Mobile FAB for adding new task */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { sm: 'none' },
        }}
        onClick={() => handleOpenTaskDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onClose={handleCloseTaskDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <Formik
          initialValues={{
            title: editingTask?.title || '',
            description: editingTask?.description || '',
            status: editingTask?.status || 'Pending',
            projectId: editingTask?.projectId || '',
            dueDate: editingTask?.dueDate || '',
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

export default TaskList;
