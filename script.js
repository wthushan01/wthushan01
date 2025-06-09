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
      // Convert snake_case to Title Case With Spaces
      const formattedName = name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const row = document.createElement("tr");
      row.innerHTML = `
        <td style="cursor:pointer; color:blue; text-decoration:underline;">${formattedName}</td>
      `;
      row.firstElementChild.onclick = () => {
        // Load the episode list for the selected drama
        fetch(`db/${id}.json`)
          .then(response => response.json())
          .then(episodeList => {
            const seriesContainer = document.getElementById("seriesContainer");
            seriesContainer.innerHTML = "";

            const title = document.createElement("h2");
            title.textContent = formattedName + " - Episodes";
            seriesContainer.appendChild(title);

            const ul = document.createElement("ul");
            // If the JSON is an object with keys like s01_e01, list them as episodes
            const episodeKeys = Object.keys(episodeList);
            episodeKeys.forEach((epKey, idx) => {
              const li = document.createElement("li");
              li.textContent = `Episode ${idx + 1} (${epKey})`;
              ul.appendChild(li);
            });
            seriesContainer.appendChild(ul);

            // Back button
            const backBtn = document.createElement("button");
            backBtn.textContent = "Back To Drama List";
            backBtn.onclick = () => location.reload();
            seriesContainer.appendChild(backBtn);
          })
          .catch(err => {
            alert("Could not load episode list.");
          });
      };
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    seriesContainer.appendChild(table);
  })
  .catch((error) => console.error("Error loading drama_list.json:", error));
