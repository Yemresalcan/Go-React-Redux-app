import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const handleLanguageChange = (event, newLanguage) => {
    if (newLanguage !== null) {
      i18n.changeLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
      <ToggleButtonGroup
        value={i18n.language}
        exclusive
        onChange={handleLanguageChange}
        aria-label="language selector"
        size="small"
      >
        <ToggleButton value="en" aria-label="English">
          EN
        </ToggleButton>
        <ToggleButton value="tr" aria-label="Turkish">
          TR
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default LanguageSwitcher;
