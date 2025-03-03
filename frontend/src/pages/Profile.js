import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { updateProfile } from '../redux/slices/authSlice';

// Validation schema
const ProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required'),
  lastName: Yup.string()
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
});

// Password validation schema
const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleProfileUpdate = (values, { setSubmitting }) => {
    dispatch(updateProfile(values));
    setSubmitting(false);
  };

  const handlePasswordUpdate = (values, { resetForm, setSubmitting }) => {
    // Here you would typically call an API to update the password
    // For now, we'll just simulate it with a timeout
    setPasswordError(null);
    setPasswordSuccess(false);
    
    setTimeout(() => {
      // Simulate API call success
      setPasswordSuccess(true);
      resetForm();
      setSubmitting(false);
    }, 1000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      
      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 56,
                  height: 56,
                  mr: 2,
                }}
              >
                {user?.firstName ? (
                  `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`
                ) : (
                  <PersonIcon />
                )}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Formik
              initialValues={{
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                username: user?.username || '',
              }}
              validationSchema={ProfileSchema}
              onSubmit={handleProfileUpdate}
              enableReinitialize
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="firstName"
                        label="First Name"
                        variant="outlined"
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="lastName"
                        label="Last Name"
                        variant="outlined"
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="email"
                        label="Email"
                        variant="outlined"
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="username"
                        label="Username"
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || loading}
                        startIcon={loading && <CircularProgress size={20} />}
                      >
                        Update Profile
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
        
        {/* Password Change */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}
            
            {passwordSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Password updated successfully!
              </Alert>
            )}
            
            <Formik
              initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              }}
              validationSchema={PasswordSchema}
              onSubmit={handlePasswordUpdate}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="currentPassword"
                        label="Current Password"
                        type="password"
                        variant="outlined"
                        error={touched.currentPassword && Boolean(errors.currentPassword)}
                        helperText={touched.currentPassword && errors.currentPassword}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="newPassword"
                        label="New Password"
                        type="password"
                        variant="outlined"
                        error={touched.newPassword && Boolean(errors.newPassword)}
                        helperText={touched.newPassword && errors.newPassword}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        variant="outlined"
                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting && <CircularProgress size={20} />}
                      >
                        Change Password
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
