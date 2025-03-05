import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { fetchProjects } from '../redux/slices/projectSlice';
import { fetchTasks } from '../redux/slices/taskSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { projects, loading: projectsLoading } = useSelector((state) => state.projects);
  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  // Ensure tasks is an array before filtering
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  
  // Filter tasks by status with additional safety checks
  const completedTasks = safeTasks.filter(task => task && task.status === 'Completed');
  const inProgressTasks = safeTasks.filter(task => task && task.status === 'In Progress');
  const pendingTasks = safeTasks.filter(task => task && task.status === 'Pending');

  const loading = projectsLoading || tasksLoading;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('nav_dashboard')}
      </Typography>
      
      {user && (
        <Typography variant="h6" gutterBottom>
          {t('welcome')}, {user.firstName || user.username}!
        </Typography>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: 'primary.light',
                  color: 'white',
                }}
              >
                <FolderIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h5">{projects.length}</Typography>
                <Typography variant="body1">{t('total_projects')}</Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: 'secondary.light',
                  color: 'white',
                }}
              >
                <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h5">{safeTasks.length}</Typography>
                <Typography variant="body1">{t('total_tasks')}</Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: 'success.light',
                  color: 'white',
                }}
              >
                <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h5">{completedTasks.length}</Typography>
                <Typography variant="body1">{t('completed_tasks')}</Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: 'warning.light',
                  color: 'white',
                }}
              >
                <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h5">{pendingTasks.length}</Typography>
                <Typography variant="body1">{t('status_not_started')}</Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Recent Projects */}
          <Typography variant="h5" gutterBottom>
            {t('recent_projects')}
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {projects.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body1">{t('projects')} {t('not_found_message')}</Typography>
                  <Button
                    component={RouterLink}
                    to="/projects"
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    {t('create_project')}
                  </Button>
                </Paper>
              </Grid>
            ) : (
              projects.slice(0, 3).map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {project.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        component={RouterLink}
                        to={`/projects/${project.id}`}
                      >
                        {t('project_details')}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
          
          {/* Recent Tasks */}
          <Typography variant="h5" gutterBottom>
            {t('recent_tasks')}
          </Typography>
          <Grid container spacing={3}>
            {safeTasks.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body1">{t('tasks')} {t('not_found_message')}</Typography>
                  <Button
                    component={RouterLink}
                    to="/tasks"
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    {t('create_task')}
                  </Button>
                </Paper>
              </Grid>
            ) : (
              safeTasks.slice(0, 3).map((task) => (
                <Grid item xs={12} sm={6} md={4} key={task.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {task.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          color: 
                            task.status === 'Completed'
                              ? 'success.main'
                              : task.status === 'In Progress'
                              ? 'info.main'
                              : 'warning.main',
                        }}
                      >
                        {t('status')}: {task.status === 'Completed' 
                          ? t('status_completed') 
                          : task.status === 'In Progress' 
                          ? t('status_in_progress') 
                          : t('status_not_started')}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        component={RouterLink}
                        to={`/tasks/${task.id}`}
                      >
                        {t('task_details')}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
