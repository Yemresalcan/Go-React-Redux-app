import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, ToggleButtonGroup, ToggleButton, Typography, Tooltip, alpha } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  
  const handleLanguageChange = (event, newLanguage) => {
    if (newLanguage !== null) {
      i18n.changeLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title={t('change_language')}>
        <ToggleButtonGroup
          value={i18n.language}
          exclusive
          onChange={handleLanguageChange}
          aria-label="language selector"
          size="small"
          sx={{
            '& .MuiToggleButtonGroup-grouped': {
              border: 0,
              borderRadius: '8px !important',
              mx: 0.5,
              px: 1.5,
              py: 0.5,
              fontWeight: 600,
              fontSize: '0.75rem',
              transition: 'all 0.2s ease-in-out',
              '&.Mui-selected': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.18),
                },
              },
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
              },
            },
          }}
        >
          <ToggleButton 
            value="en" 
            aria-label="English"
            sx={{
              color: i18n.language === 'en' ? 'primary.main' : 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                width: 18, 
                height: 18, 
                borderRadius: '50%', 
                display: 'inline-block',
                backgroundImage: 'url(https://flagcdn.com/w20/gb.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                mr: 0.5,
              }} 
            />
            EN
          </ToggleButton>
          <ToggleButton 
            value="tr" 
            aria-label="Turkish"
            sx={{
              color: i18n.language === 'tr' ? 'primary.main' : 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                width: 18, 
                height: 18, 
                borderRadius: '50%', 
                display: 'inline-block',
                backgroundImage: 'url(https://flagcdn.com/w20/tr.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                mr: 0.5,
              }} 
            />
            TR
          </ToggleButton>
        </ToggleButtonGroup>
      </Tooltip>
    </Box>
  );
};

export default LanguageSwitcher;
