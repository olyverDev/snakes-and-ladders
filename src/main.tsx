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
          rollDice: 'Roll the Dice',
          play: 'Play',
          loading: 'Loading...',
          rules: {
            base: 'Snakes & Ladders is a fancy board game! Players are rolling the dice and moving on board. The winner is the one who gets to the finish cell faster than the others.',
            ladder: 'The player moves from the beginning of the ladder to its top',
            snake: 'When hit on the head of a snake, the player descends to its tail',
            coffin: 'When hitting the coffin, the player moves to the first square',
            praiseHands: 'The player gets an extra life-antidote that saves him from the snake bite',
            snakesNest: 'If you hit a nest of snakes, an additional snake appears on the board',
            continueButton: 'Sure',
          },
        }
      },
      ru: {
        translation: {
          rollDice: 'Бросить кубик',
          play: 'Начать игру',
          loading: 'Подождите...',
          rules: {
            base: 'Змеи и лестницы — увлекательная настольная игра! Игроки кидают кубик и ходят по игровому полю. Победит тот, кто быстрее остальных доберется до финиша.',
            ladder: 'Игрок передвигается от начала лестницы к ее верху',
            snake: 'При попадании на голову змеи игрок спускается к ее хвосту',
            coffin: 'При попадании на гроб игрок перемещается на первую клетку',
            praiseHands: 'Игрок получает дополнительную жизнь-антидот, спасающую его от змеи',
            snakesNest: 'При попадании на гнездо змей на доске появляется дополнительная змея',
            continueButton: 'Понял-принял',
          },
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
