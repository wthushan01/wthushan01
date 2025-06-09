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

            // Group episodes by season
            const seasons = {};
            Object.keys(episodeList).forEach(epKey => {
              // Match s01_e01, s02_e03, etc.
              const regex = /^s(\d+)_e(\d+)$/i;
              const match = regex.exec(epKey);
              if (match) {
                const seasonNum = parseInt(match[1], 10);
                const episodeNum = parseInt(match[2], 10);
                if (!seasons[seasonNum]) seasons[seasonNum] = [];
                seasons[seasonNum].push({ epKey, episodeNum });
              }
            });

            // Sort seasons and episodes
            const sortedSeasons = Object.keys(seasons).sort((a, b) => a - b);

            sortedSeasons.forEach(seasonNum => {
              const seasonHeader = document.createElement("h3");
              seasonHeader.textContent = `Season ${seasonNum.toString().padStart(2, '0')}`;
              seriesContainer.appendChild(seasonHeader);

              const ul = document.createElement("ul");
              seasons[seasonNum]
                .sort((a, b) => a.episodeNum - b.episodeNum)
                .forEach(({ epKey, episodeNum }) => {
                  const li = document.createElement("li");
                  li.textContent = `Episode ${episodeNum.toString().padStart(2, '0')} (${epKey})`;
                  ul.appendChild(li);
                });
              seriesContainer.appendChild(ul);
            });

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
