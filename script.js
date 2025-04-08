document.getElementById("addSubject").addEventListener("click", () => {
  const container = document.getElementById("subjectsContainer");
  const newSubject = document.createElement("div");
  newSubject.className = "subject";
  newSubject.innerHTML = `
    <label>Subject Name:</label>
    <input type="text" class="subjectName" placeholder="e.g., Physics" />
    <label>Total Classes:</label>
    <input type="number" class="totalClasses" required />
    <label>Attended Classes:</label>
    <input type="number" class="attendedClasses" required />
  `;
  container.appendChild(newSubject);
});

document.getElementById("attendanceForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const subjects = document.querySelectorAll(".subject");
  const futureAbsents = parseInt(document.getElementById("futureAbsents").value);
  let totalAttended = 0;
  let totalClasses = 0;
  let details = "";

  subjects.forEach((subject, index) => {
    const name = subject.querySelector(".subjectName").value || `Subject ${index + 1}`;
    const total = parseInt(subject.querySelector(".totalClasses").value);
    const attended = parseInt(subject.querySelector(".attendedClasses").value);

    if (isNaN(total) || isNaN(attended) || attended > total || total <= 0) return;

    totalAttended += attended;
    totalClasses += total;

    const percent = ((attended / total) * 100).toFixed(2);
    const status = percent >= 75 ? `<span class="safe">Safe</span>` : `<span class="unsafe">Unsafe</span>`;

    details += `
      <h4>${name}</h4>
      <p>Attendance: ${attended}/${total} (${percent}%) - ${status}</p>
    `;
  });

  const newTotal = totalClasses + futureAbsents;
  const overallPercent = ((totalAttended / totalClasses) * 100).toFixed(2);
  const futurePercent = ((totalAttended / newTotal) * 100).toFixed(2);
  const overallStatus = overallPercent >= 75 ? "safe" : "unsafe";
  const futureStatus = futurePercent >= 75 ? "safe" : "unsafe";

  document.getElementById("resultArea").innerHTML = `
    <h3>Total Attendance: ${overallPercent}% <span class="${overallStatus}">(${overallStatus})</span></h3>
    ${details}
    <p>If you miss ${futureAbsents} more classes:</p>
    <p>Future Attendance: ${futurePercent}% <span class="${futureStatus}">(${futureStatus})</span></p>
  `;

  const ctx = document.getElementById("attendanceChart").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Attended", "Missed"],
      datasets: [{
        data: [totalAttended, totalClasses - totalAttended],
        backgroundColor: ["#28a745", "#dc3545"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Total Attendance Overview' }
      }
    }
  });
});