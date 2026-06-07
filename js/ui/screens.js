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
  }
  updateDebugLabel();
}
