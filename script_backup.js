let current_series_name = "";
let current_series_json = "";

fetch("db/series_list.json")
  .then((response) => response.json())
  .then((jsonResponse) => {
    const seriesContainer = document.getElementById("seriesContainer");
    seriesContainer.innerHTML = "";

    jsonResponse.data.forEach((series) => {
      const div = document.createElement("div");
      div.classList.add("item");

      div.innerHTML = `
            <div class="left-column">
                <img style="width: 200px; height: 280px;" src="${series.image}" alt="Cover Photo">
            </div>
            <div class="right-column">
                <h2>${series.name}</h2>
                <p>${series.description}</p>
                <button id="showEpisodeListButton" onclick="loadEpisodeList('${series.name}', '${series.jsonLocation}')">Show Episodes List</button>
            </div>
        `;

      seriesContainer.appendChild(div);
    });
  })
  .catch((error) => console.error("Error loading JSON:", error));

function loadEpisodeList(name, jsonPath) {
  current_series_name = name;
  current_series_json = jsonPath;
  fetch(jsonPath, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  })
    .then((response) => response.json())
    .then((dramaEpisodes) => {
      const seriesContainer = document.getElementById("seriesContainer");
      seriesContainer.innerHTML = "";

      dramaEpisodes.data.forEach((episode) => {
        const div = document.createElement("div");
        div.classList.add("episode-item");

        div.innerHTML = `
                  <h4>${name} - Part ${episode.part}</h4>
                  <button id="watchButton" onclick="loadWatchContent('${episode.part}', '${episode.video}', '${episode.type}')">Watch</button>
              `;

        seriesContainer.appendChild(div);
      });
      const footerDiv = document.createElement("div");
      footerDiv.classList.add("episode-list-footer");
      footerDiv.innerHTML = `
              <button onclick="location.reload()">Back To Home</button>
          `;
      seriesContainer.appendChild(footerDiv);
    })
    .catch((error) => console.error("Error loading JSON:", error));
}

function loadWatchContent(part, videoSrc, type) {
  if (type === 'facebook') {
    window.open(videoSrc, '_blank');
    return;
  }

  const seriesContainer = document.getElementById("seriesContainer");
  seriesContainer.innerHTML = "";
  const div = document.createElement("div");
  div.classList.add("video-container");

  div.innerHTML = `
      <h3 class="player-title">My Sassy Girl - Part ${part}</h3>
      <video controls>
          <source src=${videoSrc} type="video/mp4">
          Your browser does not support the video tag.
      </video>
      <div class="player-footer">
          <button id="backToListButton" class="player-footer-button" onclick="loadEpisodeList('${current_series_name}', '${current_series_json}')">
              Back To List
          </button>
      </div>
  `;

  seriesContainer.appendChild(div);
}
