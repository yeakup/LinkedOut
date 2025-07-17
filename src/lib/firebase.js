import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAYtkZQL-yvVFeWzXem7SFIP3HE6rHw47c",
  authDomain: "linkedout-acb57.firebaseapp.com",
  projectId: "linkedout-acb57",
  storageBucket: "linkedout-acb57.firebasestorage.app",
  messagingSenderId: "254427337134",
  appId: "1:254427337134:web:bfa984e7f62f25c814b83f",
  measurementId: "G-EWM8RMH84L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

