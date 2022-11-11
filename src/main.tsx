import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './reset.css';
import './global.css';

import { logAnalyticsEvent, AnalyticsEvent } from './firebase';

logAnalyticsEvent(AnalyticsEvent.Visit);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
