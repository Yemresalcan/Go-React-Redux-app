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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  fetchProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../redux/slices/projectSlice';
import { 
  setProjectDialogOpen, 
  openConfirmDialog, 
  closeConfirmDialog 
} from '../redux/slices/uiSlice';

// Validation schema
const ProjectSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters')
    .required('Description is required'),
});

const ProjectList = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.projects);
  const { projectDialogOpen, confirmDialogOpen, confirmDialogProps } = useSelector((state) => state.ui);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleOpenProjectDialog = (project = null) => {
    setEditingProject(project);
    dispatch(setProjectDialogOpen(true));
  };

  const handleCloseProjectDialog = () => {
    setEditingProject(null);
    dispatch(setProjectDialogOpen(false));
  };

  const handleSubmitProject = (values, { resetForm }) => {
    if (editingProject) {
      dispatch(updateProject({ id: editingProject.id, projectData: values }));
    } else {
      dispatch(createProject(values));
    }
    resetForm();
    handleCloseProjectDialog();
  };

  const handleDeleteProject = (project) => {
    dispatch(
      openConfirmDialog({
        title: 'Delete Project',
        message: `Are you sure you want to delete "${project.name}"? This action cannot be undone.`,
        confirmAction: () => {
          dispatch(deleteProject(project.id));
          dispatch(closeConfirmDialog());
        },
        cancelAction: () => dispatch(closeConfirmDialog()),
      })
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Projects</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenProjectDialog()}
        >
          New Project
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.length === 0 ? (
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
                  No projects found
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Create your first project to get started
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenProjectDialog()}
                  sx={{ mt: 2 }}
                >
                  Create Project
                </Button>
              </Box>
            </Grid>
          ) : (
            projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {project.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/projects/${project.id}`}
                    >
                      View Details
                    </Button>
                    <Box>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenProjectDialog(project)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteProject(project)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Mobile FAB for adding new project */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { sm: 'none' },
        }}
        onClick={() => handleOpenProjectDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Project Dialog */}
      <Dialog open={projectDialogOpen} onClose={handleCloseProjectDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        <Formik
          initialValues={{
            name: editingProject?.name || '',
            description: editingProject?.description || '',
          }}
          validationSchema={ProjectSchema}
          onSubmit={handleSubmitProject}
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
                  {editingProject ? 'Update' : 'Create'}
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

export default ProjectList;
