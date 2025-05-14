// 1️ Firebase init
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAg-Qc46CzCYdN_JGayHuR7xYxlsryUpZc",
  authDomain: "proctored-system.firebaseapp.com",
  projectId: "proctored-system",
  storageBucket: "proctored-system.firebasestorage.app",
  messagingSenderId: "512898908874",
  appId: "1:512898908874:web:23584b6cad04eb9e0c2a33",
  measurementId: "G-3SL8C6C8RD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 2️ Panel toggles
const container = document.getElementById("container");
document.getElementById("goRegister").onclick = () =>
  container.classList.add("right-panel-active");
document.getElementById("goLogin").onclick = () =>
  container.classList.remove("right-panel-active");

// 3️ Register: set approved=false for teachers + send email verification
document.getElementById("registerForm").addEventListener("submit", async e => {
  e.preventDefault();
  const email = e.target.regEmail.value;
  const pass = e.target.regPassword.value;
  const username = e.target.regUsername.value;
  const role = e.target.regRole.value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = cred.user.uid;

    await setDoc(doc(db, "users", uid), {
      username,
      email,
      role,
      approved: role === "teacher" ? false : true,
      createdAt: new Date(),
      emailVerified: false
    });

    // Send email verification
    await sendEmailVerification(cred.user);

    if (role === "teacher") {
      alert("Registered! Please verify your email. Await admin approval before you can log in.");
    } else {
      alert("Registered! Please verify your email before logging in.");
    }

    container.classList.remove("right-panel-active");
  } catch (err) {
    alert(err.message);
  }
});

// 4️ Login: check email verification, role, and approval
document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const email = e.target.loginEmail.value;
  const pass = e.target.loginPassword.value;

  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);

    // Admin shortcut
    if (email === "admin@gmail.com" && pass === "admin123") {
      window.location.href = "admin.html";
      return;
    }

    // Email verification check
    if (!cred.user.emailVerified) {
      alert("Please verify your email before logging in.");
      return;
    }

    // Get user data from Firestore
    const uid = cred.user.uid;
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) throw new Error("No profile found.");

    const { role, approved } = snap.data();

    if (role === "teacher" && !approved) {
      alert("Your account is pending admin approval.");
      return;
    }

    if (role === "teacher") {
      window.location.href = "profDashboard/professorDashboard.html";
    } else if (role === "student") {
      window.location.href = "studDashboard/studentDashboard.html";
    } else {
      alert("Unknown role.");
    }
  } catch (err) {
    alert(err.message);
  }
});
