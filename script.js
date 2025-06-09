
fetch("db/drama_list.json")
  .then((response) => response.json())
  .then((dramaList) => {
    const seriesContainer = document.getElementById("seriesContainer");
    seriesContainer.innerHTML = "";

    // Create table
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.border = "1px solid black";
    table.style.borderCollapse = "collapse";

    // Table header
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Drama Name</th>
      </tr>
    `;
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement("tbody");
    Object.entries(dramaList).forEach(([name, id]) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${name}</td>
      `;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    seriesContainer.appendChild(table);
  })
  .catch((error) => console.error("Error loading drama_list.json:", error));
