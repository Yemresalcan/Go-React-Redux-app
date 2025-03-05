import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  const { t } = useTranslation();
  
  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          p: 5,
          mt: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          {t('not_found')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('not_found_message')}
        </Typography>
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/"
            size="large"
          >
            {t('go_home')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;
