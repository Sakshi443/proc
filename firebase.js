// firebase.js
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAg-Qc46CzCYdN_JGayHuR7xYxlsryUpZc",
  authDomain: "proctored-system.firebaseapp.com",
  projectId: "proctored-system",
  storageBucket: "proctored-system.appspot.com",
  messagingSenderId: "512898908874",
  appId: "1:512898908874:web:23584b6cad04eb9e0c2a33",
  measurementId: "G-3SL8C6C8RD",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
