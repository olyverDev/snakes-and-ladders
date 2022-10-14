import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './reset.css';
import './global.css';
import Game from './game';

new Game();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
