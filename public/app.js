// login.js
import {
  auth,
  db
} from "../firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged
// } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc
// } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
} from "firebase/firestore";

// UI toggle
const container = document.getElementById("container");
document.getElementById("goRegister").onclick = () =>
  container.classList.add("right-panel-active");
document.getElementById("goLogin").onclick = () =>
  container.classList.remove("right-panel-active");

// Password strength check
function isStrongPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(password);
}

// Register
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  document.getElementById("loader").style.display = "block";

  const email = e.target.regEmail.value;
  const pass = e.target.regPassword.value;
  const username = e.target.regUsername.value;
  const role = e.target.regRole.value;

  if (!isStrongPassword(pass)) {
    alert("⚠️ Weak password.");
    document.getElementById("loader").style.display = "none";
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = cred.user.uid;
    const locale = navigator.language || "en-IN";

    await setDoc(doc(db, "users", uid), {
      username,
      email,
      role,
      approved: role === "teacher" ? false : true,
      createdAt: new Date(),
      emailVerified: false,
      locale
    });

    await sendEmailVerification(cred.user);
    alert(
      role === "teacher"
        ? "Registered! Verify your email & wait for admin approval."
        : "Registered! Please verify your email before logging in."
    );

    await signOut(auth);
    container.classList.remove("right-panel-active");
  } catch (err) {
    alert(err.message);
  }

  document.getElementById("loader").style.display = "none";
});

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  document.getElementById("loader").style.display = "block";

  const email = e.target.loginEmail.value;
  const pass = e.target.loginPassword.value;

  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);

    if (!cred.user.emailVerified) {
      alert("⚠️ Please verify your email.");
      document.getElementById("loader").style.display = "none";
      await signOut(auth);
      return;
    }

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const snap = await getDoc(doc(db, "users", uid));
        if (!snap.exists()) throw new Error("No profile found.");

        const { role, approved } = snap.data();

        if (role === "teacher" && !approved) {
          alert("⏳ Awaiting admin approval.");
          document.getElementById("loader").style.display = "none";
          await signOut(auth);
          return;
        }

        // Store UID and Email
        sessionStorage.setItem("uid", uid);
        sessionStorage.setItem("email", email);
        localStorage.setItem("uid", uid);
        localStorage.setItem("email", email);

        await updateDoc(doc(db, "users", uid), {
          lastLogin: new Date(),
        });

        if (role === "teacher") {
          window.location.href = "profDashboard/professorDashboard.html";
        } else if (role === "student") {
          window.location.href = "studDashboard/studentDashboard.html";
        } else {
          alert("Unknown role.");
        }
      }
    });
  } catch (err) {
    alert(err.message);
  }

  document.getElementById("loader").style.display = "none";
});
