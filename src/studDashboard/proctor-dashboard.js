const students = [
    {
      name: "Pallavi Sharma",
      faceDetected: true,
      gaze: "On Screen",
      tabSwitches: 1,
      alerts: 1,
    },
    {
      name: "Rahul Mehta",
      faceDetected: false,
      gaze: "Away",
      tabSwitches: 3,
      alerts: 2,
    },
    {
      name: "Aditi Verma",
      faceDetected: true,
      gaze: "On Screen",
      tabSwitches: 0,
      alerts: 0,
    },
  ];
  
  const grid = document.getElementById("studentGrid");
  
  students.forEach((student, index) => {
    const card = document.createElement("div");
    card.className = "student-card";
  
    card.innerHTML = `
        <h3>${student.name}</h3>
        <div class="status">Face Detected: <span>${
          student.faceDetected ? "Yes" : "No"
        }</span></div>
        <div class="status">Gaze Tracking: <span>${student.gaze}</span></div>
        <div class="status">Tab Switches: <span>${
          student.tabSwitches
        }</span></div>
        <div class="status">Alerts: <span>${student.alerts}</span></div>
        <div class="actions">
          <button class="warn" onclick="warnStudent('${
            student.name
          }')">Warn</button>
          <button class="remove" onclick="removeStudent('${
            student.name
          }')">Remove</button>
        </div>
      `;
  
    grid.appendChild(card);
  });
  
  function warnStudent(name) {
    alert(`Warning sent to ${name}`);
    // Add backend call or WebSocket alert logic here
  }
  
  function removeStudent(name) {
    const confirmRemove = confirm(
      `Are you sure you want to remove ${name} from the exam?`
    );
    if (confirmRemove) {
      alert(`${name} has been removed.`);
      // Add removal logic here (e.g., disable their session)
    }
  }
  
  function goBack() {
    window.location.href = "studentDashboard.html";
  }