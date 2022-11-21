import React from 'react';
import ReactDOM from 'react-dom/client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import App from './components/App';
import './reset.css';
import './global.css';
import { logAnalyticsEvent, AnalyticsEvent } from './firebase';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          rollDice: 'Tap to roll the Dice',
          play: 'Play',
          rules: 'Rules',
          loading: 'Loading...',
        }
      },
      ru: {
        translation: {
          rollDice: 'Бросить кости',
          play: 'Начать игру',
          rules: 'Правила',
          loading: 'Подождите...',
        }
      },
    },
    lng: 'ru', // if you're using a language detector, do not define the lng option
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
