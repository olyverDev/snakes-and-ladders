// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
// NOTE: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyA80eWwYwkQ7Y1bmNv7JA5mNH_Fjixw5nA",
  authDomain: "snakes-and-ladders-68d62.firebaseapp.com",
  projectId: "snakes-and-ladders-68d62",
  storageBucket: "snakes-and-ladders-68d62.appspot.com",
  messagingSenderId: "1037197277021",
  appId: "1:1037197277021:web:c7a45b4c02d8c97d5b9ab4",
  measurementId: "G-Z7T7JZSWN5"
};

const firebaseApp = initializeApp(firebaseConfig);
const analyticsInstance = getAnalytics(firebaseApp);

export enum AnalyticsEvent {
  Visit = 'visit',
  PressPlay = 'pressPlay',
  LeaveGame = 'leaveGame',
  Finish = 'finish',
}

export const logAnalyticsEvent = (key: AnalyticsEvent) => {
  logEvent(analyticsInstance, key);
}
