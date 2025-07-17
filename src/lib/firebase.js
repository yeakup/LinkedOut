import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAYtkZQL-yvVFeWzXem7SFIP3HE6rHw47c",
  authDomain: "linkedout-acb57.firebaseapp.com",
  projectId: "linkedout-acb57",
  storageBucket: "linkedout-acb57.firebasestorage.app",
  messagingSenderId: "254427337134",
  appId: "1:254427337134:web:74b31f595f20423f14b83f",
  measurementId: "G-9D0SJD0CTT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
