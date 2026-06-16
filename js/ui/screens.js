// ===== SCREEN NAVIGATION =====
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(function (s) {
    s.classList.remove("active");
  });
  var screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.add("active");
  }
  gameState.currentScreen = screenId;
  if (screenId === "map") {
    renderMap();
  } else if (screenId === "game") {
    startNewQuestion();
  } else if (screenId === "dashboard") {
    renderDashboard();
  } else if (screenId === "rewards") {
    renderRewards();
  } else if (screenId === "kingdomMap") {
    if (typeof renderKingdomMap === "function") {
      renderKingdomMap();
    }
  }
  updateDebugLabel();
  // Update XP bar on every screen change
  renderXpBar();
}

// ===== QUEST PANEL TOGGLE =====
function toggleQuestPanel() {
  var panel = document.getElementById("questPanel");
  if (!panel) return;
  if (panel.style.display === "none" || !panel.style.display) {
    panel.style.display = "block";
    renderQuestPanel();
  } else {
    panel.style.display = "none";
  }
}

// Close quest panel when clicking outside
document.addEventListener("click", function (e) {
  var panel = document.getElementById("questPanel");
  var toggle = document.querySelector(".quest-toggle-btn");
  if (panel && panel.style.display !== "none" && panel.style.display !== "") {
    if (!panel.contains(e.target) && toggle && !toggle.contains(e.target)) {
      panel.style.display = "none";
    }
  }
});
