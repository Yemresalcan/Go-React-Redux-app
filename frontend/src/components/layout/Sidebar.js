import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Chip,
  alpha,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { setDrawerOpen } from '../../redux/slices/uiSlice';

const Sidebar = ({ drawerWidth }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { drawerOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  // Menu items with translations and modern icons
  const menuItems = [
    { text: t('nav_dashboard'), icon: <DashboardOutlinedIcon />, path: '/dashboard' },
    { text: t('nav_projects'), icon: <FolderOutlinedIcon />, path: '/projects' },
    { text: t('nav_tasks'), icon: <AssignmentOutlinedIcon />, path: '/tasks' },
    { text: t('nav_profile'), icon: <PersonOutlineOutlinedIcon />, path: '/profile' },
  ];

  const handleDrawerToggle = () => {
    dispatch(setDrawerOpen(!drawerOpen));
  };

  const handleNavigation = (path) => {
    navigate(path);
    // Close drawer on mobile
    if (window.innerWidth < 600) {
      dispatch(setDrawerOpen(false));
    }
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
    }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.03),
      }}>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            fontWeight: 700, 
            color: 'primary.main',
            letterSpacing: '-0.5px',
          }}
        >
          {t('app_title')}
        </Typography>
      </Box>
      
      {user && (
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}>
          <Avatar 
            sx={{ 
              width: 60, 
              height: 60, 
              mb: 1,
              bgcolor: 'primary.main',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            {user.firstName ? user.firstName[0] : ''}
            {user.lastName ? user.lastName[0] : ''}
          </Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user.firstName ? `${user.firstName} ${user.lastName}` : t('user')}
          </Typography>
          <Chip 
            label={t('active')} 
            size="small" 
            color="success" 
            sx={{ mt: 0.5, fontWeight: 500 }}
          />
        </Box>
      )}
      
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  '&.Mui-selected': {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.15),
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                    '& .MuiListItemText-primary': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: isActive ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.95rem',
                  }}
                />
                {isActive && (
                  <Box 
                    sx={{ 
                      width: 4, 
                      height: 20, 
                      borderRadius: 4, 
                      bgcolor: 'primary.main',
                      ml: 1,
                    }} 
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid', 
        borderColor: 'divider',
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.03),
      }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          {t('app_title')} 2025
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          {t('version')} 1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: 'none',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
