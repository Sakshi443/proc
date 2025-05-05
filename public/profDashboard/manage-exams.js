function goBack() {
    window.location.href = "professorDashboard.html";
  }
  
  document.getElementById("examForm").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const title = document.getElementById("examTitle").value;
    const date = document.getElementById("examDate").value;
    const time = document.getElementById("examTime").value;
    const duration = document.getElementById("duration").value;
    const instructions = document.getElementById("examInstructions").value;
  
    const examItem = document.createElement("li");
    examItem.innerHTML = `
      <strong>${title}</strong><br>
      Date: ${date}, Time: ${time}, Duration: ${duration} mins<br>
      Instructions: ${instructions}
    `;
  
    document.getElementById("exams").appendChild(examItem);
    document.getElementById("examForm").reset();
  });
  