import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en';
import trTranslation from './locales/tr';

// Initialize i18next
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: enTranslation,
      tr: trTranslation
    },
    lng: localStorage.getItem('language') || 'en', // default language
    fallbackLng: 'en', // fallback language
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      useSuspense: false // prevents suspense during loading
    }
  });

export default i18n;
