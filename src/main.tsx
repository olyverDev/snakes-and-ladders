import React from 'react';
import ReactDOM from 'react-dom/client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import './reset.css';
import './global.css';

import App from './components/App';
import { logAnalyticsEvent, AnalyticsEvent } from './firebase';

import TranslationsRu from './languages/ru';
import TranslationsEn from './languages/en';

const detectSupportedLanguage = () => {
  // @ts-expect-error no 'userLanguage' property in Navigator
  const language = navigator.language || navigator.userLanguage;
  
  if (!language) return 'ru';

  return language.toLowerCase().startsWith('en') ? 'en' : 'ru';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: TranslationsRu,
      en: TranslationsEn,
    },
    lng: detectSupportedLanguage(),
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

logAnalyticsEvent(AnalyticsEvent.Visit);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
