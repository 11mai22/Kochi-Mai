window.addEventListener("DOMContentLoaded", () => {

  const resultDiv = document.getElementById("result");
  const table = document.getElementById("timetable");
  const analyzeBtn = document.getElementById("analyze");

  const STORAGE_KEY = "timetableData";
  const MODE_KEY = "displayMode";
  const days = ["月", "火", "水", "木", "金"];

  analyzeBtn.addEventListener("click", () => {
    const timetable = getTimetableFromUI();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timetable));
    localStorage.setItem(MODE_KEY, "result");
    location.reload();
  });

  const mode = localStorage.getItem(MODE_KEY);
  if (mode === "result") {
    showResultOnly();
  }

  function getTimetableFromUI() {
    const timetable = [];

    for (let i = 1; i <= 5; i++) {
      const row = table.rows[i];
      const dayData = [];

      for (let j = 1; j <= 5; j++) {
        const checked = row.cells[j].querySelector("input").checked;
        dayData.push(checked);
      }

      timetable.push(dayData);
    }

    return timetable;
  }

  function loadTimetable() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  }

  function showResultOnly() {
    const timetable = loadTimetable();
    if (!timetable) return;

    table.style.display = "none";
    analyzeBtn.style.display = "none";

    renderResultTable(timetable);
  }

  function renderResultTable(timetable) {
    resultDiv.innerHTML = "";

    const resultTable = document.createElement("table");
    resultTable.classList.add("result-table");

    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
      <th></th>
      <th>1限</th>
      <th>2限</th>
      <th>3限</th>
      <th>4限</th>
      <th>5限</th>
    `;
    resultTable.appendChild(headerRow);

    timetable.forEach((dayArray, dayIndex) => {
      const row = document.createElement("tr");

      const dayCell = document.createElement("th");
      dayCell.textContent = days[dayIndex];
      row.appendChild(dayCell);

      dayArray.forEach(hasClass => {
        const cell = document.createElement("td");

        if (hasClass) {
          cell.textContent = "✕";
          cell.className = "busy";
        } else {
          cell.textContent = "◯";
          cell.className = "free";
        }

        row.appendChild(cell);
      });

      resultTable.appendChild(row);
    });

    resultDiv.appendChild(resultTable);

    const backBtn = document.createElement("button");
    backBtn.textContent = "時間割を修正する";
    backBtn.style.marginTop = "20px";

    backBtn.addEventListener("click", () => {
      localStorage.removeItem(MODE_KEY);
      location.reload();
    });

    resultDiv.appendChild(backBtn);
  }

});
