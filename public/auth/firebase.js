// Firebase Web SDK Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAg-Qc46CzCYdN_JGayHuR7xYxlsryUpZc",
  authDomain: "proctored-system.firebaseapp.com",
  projectId: "proctored-system",
  storageBucket: "proctored-system.appspot.com",
  messagingSenderId: "512898908874",
  appId: "1:512898908874:web:23584b6cad04eb9e0c2a33",
  measurementId: "G-3SL8C6C8RD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };

/*
  Project: Proctoring System Login with Firebase Authentication and Image Verification
  Stack: HTML + CSS + JS + Firebase + Face Recognition (Future Integration)
*/

// FILE: firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// const db = getFirestore(app);
// const storage = getStorage(app);

// export { auth, db, storage };
