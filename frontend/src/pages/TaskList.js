import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);
  const { projects, loading: projectsLoading } = useSelector((state) => state.projects);
  const { taskDialogOpen, confirmDialogOpen, confirmDialogProps } = useSelector((state) => state.ui);
  const { t } = useTranslation();
  
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Validation schema with translations
  const TaskSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, t('min_length', { field: t('task_title'), length: 3 }))
      .max(100, t('max_length', { field: t('task_title'), length: 100 }))
      .required(t('required', { field: t('task_title') })),
    description: Yup.string()
      .max(500, t('max_length', { field: t('description'), length: 500 }))
      .required(t('required', { field: t('description') })),
    status: Yup.string()
      .oneOf(['Pending', 'In Progress', 'Completed'], t('invalid_status'))
      .required(t('required', { field: t('status') })),
    projectId: Yup.string()
      .required(t('required', { field: t('project') })),
    dueDate: Yup.date()
      .nullable(),
  });

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
    // Format the date correctly for the API
    const formattedValues = {
      ...values,
      dueDate: values.dueDate ? values.dueDate + 'T00:00:00Z' : null
    };
    
    if (editingTask) {
      dispatch(updateTask({ id: editingTask.id, taskData: formattedValues }));
    } else {
      dispatch(createTask(formattedValues));
    }
    resetForm();
    handleCloseTaskDialog();
  };

  const handleDeleteTask = (task) => {
    dispatch(
      openConfirmDialog({
        title: t('delete_task_title'),
        message: t('delete_task_message', { title: task.title }),
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
        <Typography variant="h4">{t('tasks')}</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={toggleFilters}
            sx={{ mr: 1 }}
          >
            {t('filters')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenTaskDialog()}
          >
            {t('new_task')}
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      {showFilters && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">{t('status')}</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={filterStatus}
                  label={t('status')}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="">{t('all')}</MenuItem>
                  <MenuItem value="Pending">{t('pending')}</MenuItem>
                  <MenuItem value="In Progress">{t('in_progress')}</MenuItem>
                  <MenuItem value="Completed">{t('completed')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth size="small">
                <InputLabel id="project-filter-label">{t('project')}</InputLabel>
                <Select
                  labelId="project-filter-label"
                  id="project-filter"
                  value={filterProject}
                  label={t('project')}
                  onChange={(e) => setFilterProject(e.target.value)}
                >
                  <MenuItem value="">{t('all_projects')}</MenuItem>
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
                {t('clear')}
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
                  {t('no_tasks_found')}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {filterStatus || filterProject 
                    ? t('try_changing_filters')
                    : t('create_first_task')}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenTaskDialog()}
                  sx={{ mt: 2 }}
                >
                  {t('create_task')}
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
                        label={t(task.status.toLowerCase().replace(' ', '_'))}
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
                          {t('due_date')}: {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                    {task.projectId && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {t('project')}: {projects.find(p => p.id === task.projectId)?.name || t('unknown')}
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
                      {t('view')}
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
        <DialogTitle>{editingTask ? t('edit_task') : t('create_task')}</DialogTitle>
        <Formik
          initialValues={{
            title: editingTask?.title || '',
            description: editingTask?.description || '',
            status: editingTask?.status || 'Pending',
            projectId: editingTask?.projectId || '',
            dueDate: editingTask?.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : '',
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
                  label={t('task_title')}
                  fullWidth
                  variant="outlined"
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                />
                <Field
                  as={TextField}
                  margin="dense"
                  name="description"
                  label={t('description')}
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
                  label={t('project')}
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
                  label={t('status')}
                  fullWidth
                  variant="outlined"
                  error={touched.status && Boolean(errors.status)}
                  helperText={touched.status && errors.status}
                >
                  <MenuItem value="Pending">{t('pending')}</MenuItem>
                  <MenuItem value="In Progress">{t('in_progress')}</MenuItem>
                  <MenuItem value="Completed">{t('completed')}</MenuItem>
                </Field>
                <Field
                  as={TextField}
                  margin="dense"
                  name="dueDate"
                  label={t('due_date')}
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
                <Button onClick={handleCloseTaskDialog}>{t('cancel')}</Button>
                <Button type="submit" variant="contained">
                  {editingTask ? t('update') : t('create')}
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
          <Button onClick={() => dispatch(closeConfirmDialog())}>{t('cancel')}</Button>
          <Button onClick={confirmDialogProps.confirmAction} color="error" variant="contained">
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskList;
