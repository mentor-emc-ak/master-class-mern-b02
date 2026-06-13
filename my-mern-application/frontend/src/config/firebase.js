import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDtah06O79DZ9k5VEqGDImPMK7-UTuOoT0',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'emc-master-class-mern-b02.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'emc-master-class-mern-b02',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'emc-master-class-mern-b02.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '245271310803',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:245271310803:web:cf1b7983b054fa1d523f26',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
