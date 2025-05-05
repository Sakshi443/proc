let tabSwitchCount = 0;
let alertCount = 0;
let timeLeft = 30 * 60; // 30 minutes in seconds

function updateTimer() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  document.getElementById("timer").textContent =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  if (timeLeft > 0) {
    timeLeft--;
    setTimeout(updateTimer, 1000);
  } else {
    alert("Time is up! Exam will be auto-submitted.");
    submitExam();
  }
}

updateTimer();

// Detect tab switch (basic)
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    tabSwitchCount++;
    alertCount++;
    document.getElementById("tabSwitches").textContent = tabSwitchCount;
    document.getElementById("alerts").textContent = alertCount;
    alert("Tab switch detected! Please stay on the exam page.");
  }
});

function submitExam() {
  alert("Exam submitted successfully!");
  // Redirect or show confirmation
}
