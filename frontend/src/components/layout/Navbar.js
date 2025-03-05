import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Badge,
  Button,
  Divider,
  ListItemIcon,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { toggleDrawer } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = ({ drawerWidth }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { drawerOpen } = useSelector((state) => state.ui);
  const { t } = useTranslation();
  
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  const handleMenuClick = (path) => {
    handleCloseUserMenu();
    navigate(path);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: (theme) =>
          theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        ...(drawerOpen && {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }),
        backgroundColor: 'white',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => dispatch(toggleDrawer())}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: 'primary.main',
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            {t('app_title')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Notifications */}
          <Tooltip title={t('notifications')}>
            <IconButton
              onClick={handleOpenNotificationsMenu}
              size="large"
              aria-label="show notifications"
              color="inherit"
              sx={{
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
                },
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon color="primary" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* User Menu */}
          {user && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={t('profile')}>
                <IconButton 
                  onClick={handleOpenUserMenu} 
                  sx={{ 
                    p: 0.5,
                    border: '2px solid',
                    borderColor: 'primary.light',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  {user.firstName ? (
                    <Avatar 
                      alt={`${user.firstName} ${user.lastName}`}
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      {user.firstName[0]}
                      {user.lastName ? user.lastName[0] : ''}
                    </Avatar>
                  ) : (
                    <AccountCircleIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ 
                  mt: '45px',
                  '& .MuiPaper-root': {
                    borderRadius: 2,
                    minWidth: 180,
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
                    '& .MuiMenu-list': {
                      padding: '8px',
                    },
                  },
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {user.firstName ? `${user.firstName} ${user.lastName}` : t('user')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email || ''}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <MenuItem onClick={() => handleMenuClick('/dashboard')} sx={{ borderRadius: 1 }}>
                  <ListItemIcon>
                    <DashboardOutlinedIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <Typography variant="body2">{t('nav_dashboard')}</Typography>
                </MenuItem>
                
                <MenuItem onClick={() => handleMenuClick('/profile')} sx={{ borderRadius: 1 }}>
                  <ListItemIcon>
                    <PersonOutlineIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <Typography variant="body2">{t('nav_profile')}</Typography>
                </MenuItem>
                
                <Divider sx={{ my: 1 }} />
                
                <MenuItem onClick={handleLogout} sx={{ borderRadius: 1 }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <Typography variant="body2" color="error.main">{t('nav_logout')}</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
