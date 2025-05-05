function goBack() {
    window.location.href = "studentDashboard.html";
  }
  
  // Load and preview photo
  function loadPhoto(event) {
      const reader = new FileReader();
      reader.onload = function () {
        const img = document.getElementById("profileImage");
        img.src = reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    
    // Save form data (simulate saving to backend)
    document.getElementById("profileForm").addEventListener("submit", function (e) {
      e.preventDefault();
    
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const studentId = document.getElementById("studentId").value;
    
      // Simulate saving and show alert
      alert("Profile saved successfully!\n\nName: " + name + "\nEmail: " + email + "\nStudent ID: " + studentId);
    });
    