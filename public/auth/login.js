// import { auth } from "./firebase.js";
// import {
//   signInWithEmailAndPassword,
// } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

// document.getElementById("loginForm").addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const email = document.getElementById("loginEmail").value;
//   const password = document.getElementById("loginPassword").value;

//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     const role = user.displayName;

//     if (role === "student") {
//       alert("Verify face (simulated)");
//       // Optional: Add face recognition logic
//       window.location.href = "./dashboard/studentDashboard.html";
//     } else if (role === "professor") {
//       window.location.href = "./dashboard/professorDashboard.html";
//     } else {
//       alert("Invalid user role");
//     }
//   } catch (error) {
//     alert(error.message);
//   }
// });
