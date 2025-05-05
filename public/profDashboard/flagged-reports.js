function goBack() {
    window.location.href = "professorDashboard.html";
  }
  
  // Example flagged reports data
  const flaggedReports = [
    {
      student: "Rohan Mehta",
      time: "10:15 AM",
      violation: "Gaze diverted for extended period",
      screenshot: "screenshot1.jpg",
      notes: "Student kept looking away for 45 seconds."
    },
    {
      student: "Anjali Verma",
      time: "10:45 AM",
      violation: "Multiple tab switch detected",
      screenshot: "screenshot2.jpg",
      notes: "Tab changed 3 times in 2 minutes."
    }
  ];
  
  // Load flagged reports
  const reportList = document.getElementById("reportList");
  
  flaggedReports.forEach(report => {
    const card = document.createElement("div");
    card.className = "report-card";
    card.innerHTML = `
      <h3>${report.student}</h3>
      <p><strong>Time:</strong> ${report.time}</p>
      <p><strong>Violation:</strong> ${report.violation}</p>
      <p><strong>Notes:</strong> ${report.notes}</p>
      <img src="${report.screenshot}" alt="Violation Screenshot">
    `;
    reportList.appendChild(card);
  });
  