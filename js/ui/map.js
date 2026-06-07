// ===== MAP RENDERING =====
function renderMap() {
  var mapContainer = document.getElementById("mapContainer");
  mapContainer.innerHTML = "";
  var worldKeys = Object.keys(WORLDS);
  var worldGrid = document.createElement("div");
  worldGrid.className = "world-grid";
  worldKeys.forEach(function (worldId) {
    var world = WORLDS[worldId];
    var isUnlocked = gameState.unlockedWorlds.includes(worldId);
    var progress = gameState.worldProgress[worldId];
    var pct =
      progress.total > 0
        ? Math.round((progress.correct / progress.total) * 100)
        : 0;
    var worldCard = document.createElement("div");
    worldCard.className = "world-card " + (isUnlocked ? "unlocked" : "locked");
    worldCard.style.borderColor = world.color;
    var html =
      '<div class="world-emoji">' +
      (isUnlocked ? world.emoji : "\uD83D\uDD12") +
      "</div>";
    html += '<div class="world-name">' + world.name + "</div>";
    html += '<div class="world-desc">' + world.description + "</div>";
    if (isUnlocked) {
      html += '<div class="difficulty-selector">';
      html +=
        '<button class="diff-btn ' +
        (gameState.selectedDifficulty[worldId] === "easy" ? "active" : "") +
        "\" onclick=\"selectDifficulty('easy', '" +
        worldId +
        "', event)\">" +
        (gameState.selectedDifficulty[worldId] === "easy" ? "\u2713 " : "") +
        "Easy</button>";
      html +=
        '<button class="diff-btn ' +
        (gameState.selectedDifficulty[worldId] === "medium" ? "active" : "") +
        "\" onclick=\"selectDifficulty('medium', '" +
        worldId +
        "', event)\">" +
        (gameState.selectedDifficulty[worldId] === "medium" ? "\u2713 " : "") +
        "Medium</button>";
      html +=
        '<button class="diff-btn ' +
        (gameState.selectedDifficulty[worldId] === "hard" ? "active" : "") +
        "\" onclick=\"selectDifficulty('hard', '" +
        worldId +
        "', event)\">" +
        (gameState.selectedDifficulty[worldId] === "hard" ? "\u2713 " : "") +
        "Hard</button>";
      html += "</div>";
      html +=
        '<button class="play-btn" onclick="playWorld(\'' +
        worldId +
        '\')" style="background:' +
        world.color +
        '">\u25B6 Play</button>';
    } else {
      html +=
        '<button class="play-btn" onclick="playWorld(\'' +
        worldId +
        '\')" style="background:' +
        world.color +
        '">\u25B6 Play</button>';
    }
    worldCard.innerHTML = html;
    worldGrid.appendChild(worldCard);
  });
  mapContainer.appendChild(worldGrid);
}

// ===== DIFFICULTY SELECTION =====
function selectDifficulty(diff, worldId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  gameState.selectedDifficulty[worldId] = diff;
  saveGame();
  renderMap();
}

function playWorld(worldId) {
  gameState.selectedWorld = worldId;
  gameState.questionCount = 0;
  var world = WORLDS[worldId];
  if (worldId === "mathReadingTrail") {
    var themeIndex = gameState.questionCount;
    var themeName = getReadingThemeForIndex(themeIndex);
    applyReadingTheme(themeName);
  } else {
    clearReadingTheme();
  }
  showScreen("game");
}
