import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const role = document.querySelector("input[name='role']:checked").value;
  const image = document.getElementById("profileImage");
  const base64Data = req.body.imageData.replace(/^data:image\/png;base64,/, "");
  const filename = `image-${Date.now()}.png`;
  fs.writeFileSync(`public/images/${filename}`, base64Data);


  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: role,
    });

    if (role === "student" && image.files[0]) {
      // simulate storing image in server/local/folder — implement logic later
      alert("Student registered with image (simulate face save)");
    }

    alert("Registration successful!");
    window.location.href = "login.html";
  } catch (error) {
    alert(error.message);
  }
});
