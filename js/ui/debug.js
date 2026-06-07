// ===== DEBUG PANEL =====
function toggleDebugPanel() {
  var panel = document.getElementById("debugPanel");
  if (!panel) return;
  var isVisible = panel.style.display !== "none";
  panel.style.display = isVisible ? "none" : "flex";
  if (!isVisible) {
    gameState.debugMode = true;
    updateDebugLabel();
  }
}

function updateDebugLabel() {
  var label = document.getElementById("debugModeLabel");
  if (!label) return;
  label.style.display = gameState.debugMode ? "block" : "none";
}

// ===== DEBUG FUNCTIONS =====
function debugUnlockAllWorlds() {
  var allWorldIds = Object.keys(WORLDS);
  gameState.unlockedWorlds = allWorldIds;
  gameState.debugMode = true;
  saveGame();
  showNotification("\uD83D\uDD13 All worlds unlocked!");
  updateDebugLabel();
  if (gameState.currentScreen === "map") renderMap();
  if (gameState.currentScreen === "dashboard") renderDashboard();
}

function debugLockAllWorlds() {
  gameState.unlockedWorlds = ["numberRanch", "subtractionCanyon"];
  gameState.debugMode = true;
  saveGame();
  showNotification(
    "\uD83D\uDD12 Worlds locked to default (Number Ranch, Subtraction Canyon)",
  );
  updateDebugLabel();
  if (gameState.currentScreen === "map") renderMap();
  if (gameState.currentScreen === "dashboard") renderDashboard();
}

function debugTimerToggle(enabled) {
  gameState.debugSettings.timerEnabled = enabled;
  gameState.debugMode = true;
  saveGame();
  showNotification("\u23F1\uFE0F Timer " + (enabled ? "ON" : "OFF"));
  updateDebugLabel();
}

function debugVocabToggle(enabled) {
  gameState.debugSettings.vocabHighlightsEnabled = enabled;
  gameState.debugMode = true;
  saveGame();
  showNotification(
    "\uD83D\uDCD6 Vocab Highlights " + (enabled ? "Enabled" : "Disabled"),
  );
  updateDebugLabel();
}

function debugReadToggle(enabled) {
  gameState.debugSettings.readAloudEnabled = enabled;
  gameState.debugMode = true;
  saveGame();
  showNotification(
    "\uD83D\uDCD6 Read Aloud " + (enabled ? "Enabled" : "Disabled"),
  );
  updateDebugLabel();
}

function debugDrawToggle(enabled) {
  gameState.debugSettings.writingLayerEnabled = enabled;
  gameState.debugMode = true;
  setDrawingLayerEnabled(enabled);
  saveGame();
  showNotification(
    "\u270F\uFE0F Writing Layer " + (enabled ? "Enabled" : "Disabled"),
  );
  updateDebugLabel();
}

function debugSupportForce(forceOn) {
  gameState.debugSettings.supportBoardOverride = forceOn;
  gameState.debugMode = true;
  saveGame();
  showNotification(
    "\uD83D\uDCCB Support Board " + (forceOn ? "Forced ON" : "Forced OFF"),
  );
  updateDebugLabel();
  if (gameState.currentScreen === "game" && gameState.selectedWorld) {
    renderSupportBoard(gameState.selectedWorld);
  }
}

function debugSupportAuto() {
  gameState.debugSettings.supportBoardOverride = null;
  gameState.debugMode = true;
  saveGame();
  showNotification("\uD83D\uDCCB Support Board: Auto mode");
  updateDebugLabel();
  if (gameState.currentScreen === "game" && gameState.selectedWorld) {
    renderSupportBoard(gameState.selectedWorld);
  }
}

// ===== VOCABULARY POPUP =====
function showVocabPopup(word, definition) {
  if (gameState.debugSettings.vocabHighlightsEnabled === false) return;
  var existing = document.getElementById("vocabPopup");
  if (existing) existing.remove();
  var popup = document.createElement("div");
  popup.id = "vocabPopup";
  popup.className = "vocab-popup";
  popup.innerHTML =
    '<div class="vocab-popup-content">' +
    '<button class="vocab-popup-close" onclick="closeVocabPopup()">\u2715</button>' +
    '<div class="vocab-word-highlight">' +
    word +
    "</div>" +
    '<div class="vocab-definition">' +
    definition +
    "</div>" +
    "</div>";
  document.body.appendChild(popup);
}

function closeVocabPopup() {
  var popup = document.getElementById("vocabPopup");
  if (popup) popup.remove();
}
