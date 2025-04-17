// Samuel Boaz de Morais Gonçalves

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyjcxBgHXVJAWJHwP_27HMVybn2sC6jLw",
  authDomain: "auth-firebase-projeto-au-7c1a2.firebaseapp.com",
  projectId: "auth-firebase-projeto-au-7c1a2",
  storageBucket: "auth-firebase-projeto-au-7c1a2.firebasestorage.app",
  messagingSenderId: "529280438008",
  appId: "1:529280438008:web:12cde8fc63a61795fc350d",
  measurementId: "G-B5426SKQ61"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app); 
setPersistence(auth, browserLocalPersistence);
const db = getFirestore(app);

export { app, auth, db, collection, getDocs };
