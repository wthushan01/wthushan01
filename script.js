fetch("db/drama_list.json")
  .then((response) => response.json())
  .then((dramaList) => {
    const seriesContainer = document.getElementById("seriesContainer");
    seriesContainer.innerHTML = "";

    // Create a plain list (no bullets)
    const list = document.createElement("ul");
    list.style.listStyle = "none";
    list.style.padding = "0";
    list.style.margin = "0";

    Object.entries(dramaList).forEach(([name, id]) => {
      // Convert snake_case to Title Case With Spaces
      const formattedName = name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const li = document.createElement("li");
      li.style.margin = "8px 0";
      li.style.cursor = "pointer";
      li.style.color = "blue";
      li.style.textDecoration = "underline";
      li.textContent = formattedName;
      li.onclick = () => {
        // Load the episode list for the selected drama
        fetch(`db/${id}.json`)
          .then(response => response.json())
          .then(episodeList => {
            const seriesContainer = document.getElementById("seriesContainer");
            seriesContainer.innerHTML = "";

            const pageHeader = document.getElementById("pageHeader");
            pageHeader.innerHTML = "DramaAddict | " + formattedName;

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
              ul.style.listStyle = "none";
              ul.style.padding = "0";
              seasons[seasonNum]
                .sort((a, b) => a.episodeNum - b.episodeNum)
                .forEach(({ epKey, episodeNum }) => {
                  const li = document.createElement("li");
                  li.textContent = `Episode ${episodeNum.toString().padStart(2, '0')}`;
                  li.style.cursor = "pointer";
                  li.style.color = "blue";
                  li.style.textDecoration = "underline";
                  li.onclick = () => {
                    const fileId = episodeList[epKey];
                    if (fileId) {
                      window.open(`https://t.me/DramaAddictLk_Bot?start=unlock_video_${fileId}`, '_blank');
                    }
                  };
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
      list.appendChild(li);
    });

    seriesContainer.appendChild(list);
  })
  .catch((error) => console.error("Error loading drama_list.json:", error));
