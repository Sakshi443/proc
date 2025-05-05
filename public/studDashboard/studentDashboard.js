function showSection(id) {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      section.classList.remove("active");
    });
    document.getElementById(id).classList.add("active");
  }
  
  function submitFeedback() {
    const feedback = document.querySelector("#feedback textarea").value;
    if (feedback.trim()) {
      alert("Thank you for your feedback!");
      document.querySelector("#feedback textarea").value = "";
    } else {
      alert("Please enter feedback before submitting.");
    }
  }
  
  function logout() {
    alert("Logging out...");
    window.location.href = "login.html"; // replace with actual login page
  }
  
  function goBack() {
    window.location.href = "studentDashboard.html";
  }
  