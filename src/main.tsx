import React from 'react';
import ReactDOM from 'react-dom/client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import App from './components/App';
import './reset.css';
import './global.css';
import { logAnalyticsEvent, AnalyticsEvent } from './firebase';

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
      en: {
        translation: {
          rollDice: 'Roll the Dice',
          wait: 'Wait...',
          play: 'Play',
          gameEndedForPlayer: 'Player "{{name}} reached the finish!"',
          modals: {
            continueButton: 'Shizzle my nizzle',
            rules: {
              title: 'Snakes & Ladders is a fancy board game! Players are rolling the dice and moving on board. The winner is the one who gets to the finish cell faster than the others.',
              ladder: 'The player moves from the beginning of the ladder to its top',
              snake: 'When hit on the head of a snake, the player descends to its tail',
              coffin: 'When hitting the coffin, the player moves to the first square',
              praiseHands: 'The player gets an extra life-antidote that saves him from the snake bite',
              snakesNest: 'If you hit a nest of snakes, an additional snake appears on the board',
            },
            endGame: {
              title: 'Game is ended',
              restart: 'Play again',
            },
            selectGameMode: {
              title: 'Выбери режим',
              vsBot: 'VS bot',
              vsPlayer: 'VS player',
            },
            promo: {
              greeting: {
                title: 'Hey, дружище! Тебя приветствует abc хип-хоп и команда. Мы написали эту игру в поддержку моего первого микстейпа «Змеи и Лестницы». Предлагаю тебе ПАРИ! Сейчас мы сыграем одну партейку, параллельно можно будет слушать треки релиза... Если выиграешь ты — я предложу тебе поучаствовать в конкурсе с денежными призами и не только. Если же победа будет за мной — ты поддержишь микстейп «Змеи и Лестницы» лайком и репостом. После этого можно будет сыграть еще раз, если захочешь. Будем рады, если найдешь баги ;)',
              },
              endGame: {
                grats: 'Ты победил!',
                relief: 'Ты проиграл, но не беда! С тебя, конечно же, обещанный лайк, репост, комментарий, и что самое важное, прослушивание! НО мы хотели бы, чтобы ты тоже мог принять участие в конкурсе.',
                contest: {
                  conditions: {
                    title: 'Условия конкурса:',
                    first: 'Быть подписанным на паблик abc хип-хоп VK',
                    second: 'Лайк и репост записи с микстейпом',
                    third: 'Комментарий под записью с микстейпом',
                  },
                  prize: {
                    title: 'Призы:',
                    gold: '1 место: $$$ — смотри сумму в паблике; настольная игра «Змеи и лестницы» (вышлем почтой); и стихотворение на заказ от меня!',
                    silver: '2 место: настольная игра «Змеи и лестницы» (вышлем почтой); и стихотворение на заказ от меня!',
                    bronze: '3 место: cтикерпак (?); и стихотворение от меня!',
                  },
                }
              },
            },
          },
        }
      },
      ru: {
        translation: {
          rollDice: 'Бросить кубик',
          wait: 'Подождите...',
          play: 'Начать игру',
          gameEndedForPlayer: 'Игрок "{{name}}" добрался до финиша!',
          modals: {
            continueButton: 'Понял-принял',
            rules: {
              title: 'Змеи и лестницы — увлекательная настольная игра! Игроки кидают кубик и ходят по игровому полю. Победит тот, кто быстрее остальных доберется до финиша.',
              ladder: 'Игрок передвигается от начала лестницы к ее верху',
              snake: 'При попадании на голову змеи игрок спускается к ее хвосту',
              coffin: 'При попадании на гроб игрок перемещается на первую клетку',
              praiseHands: 'Игрок получает дополнительную жизнь-антидот, спасающую его от змеи',
              snakesNest: 'При попадании на гнездо змей на доске появляется дополнительная змея',
            },
            endGame: {
              title: 'Игра окончена',
              restart: 'Начать заново',
            },
            selectGameMode: {
              title: 'Выбери режим',
              vsBot: 'VS bot',
              vsPlayer: 'VS player',
            },
            promo: {
              greeting: {
                title: 'Hey, дружище! Тебя приветствует abc хип-хоп и команда. Мы написали эту игру в поддержку моего первого микстейпа «Змеи и Лестницы». Предлагаю тебе ПАРИ! Сейчас мы сыграем одну партейку, параллельно можно будет слушать треки релиза... Если выиграешь ты — я предложу тебе поучаствовать в конкурсе с денежными призами и не только. Если же победа будет за мной — ты поддержишь микстейп «Змеи и Лестницы» лайком и репостом. После этого можно будет сыграть еще раз, если захочешь. Будем рады, если найдешь и сообшишь нам о багах ;)',
              },
              endGame: {
                grats: 'Ты победил!',
                relief: 'Ты проиграл, но не беда! С тебя, конечно же, обещанный лайк, репост, комментарий, и что самое важное, прослушивание! НО мы хотели бы, чтобы ты тоже мог принять участие в конкурсе.',
                contest: {
                  conditions: {
                    title: 'Условия конкурса:',
                    first: 'Быть подписанным на паблик abc хип-хоп VK',
                    second: 'Лайк и репост записи с микстейпом',
                    third: 'Комментарий под записью с микстейпом',
                  },
                  prize: {
                    title: 'Призы:',
                    gold: '1 место: $$$ — смотри сумму в паблике; настольная игра «Змеи и лестницы» (вышлем почтой); и стихотворение на заказ от меня!',
                    silver: '2 место: настольная игра «Змеи и лестницы» (вышлем почтой); и стихотворение на заказ от меня!',
                    bronze: '3 место: cтикерпак (?); и стихотворение от меня!',
                  },
                }
              },
            },
          },
        }
      },
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
