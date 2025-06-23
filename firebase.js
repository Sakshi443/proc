// firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAg-Qc46CzCYdN_JGayHuR7xYxlsryUpZc",
  authDomain: "proctored-system.firebaseapp.com",
  projectId: "proctored-system",
  storageBucket: "proctored-system.firebasestorage.app",
  messagingSenderId: "512898908874",
  appId: "1:512898908874:web:23584b6cad04eb9e0c2a33",
  measurementId: "G-3SL8C6C8RD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

