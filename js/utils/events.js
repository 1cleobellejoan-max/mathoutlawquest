// ===== KEYBOARD SUPPORT =====
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && gameState.currentScreen === "game") {
    var submitBtn = document.getElementById("submitBtn");
    if (submitBtn && !submitBtn.disabled) {
      submitAnswer();
    }
  }
  if (e.key === "Escape") {
    closeVocabPopup();
  }
});

document.addEventListener("click", function (e) {
  var popup = document.getElementById("vocabPopup");
  if (
    popup &&
    !popup.querySelector(".vocab-popup-content").contains(e.target)
  ) {
    closeVocabPopup();
  }
});

document.addEventListener("click", function (e) {
  var panel = document.getElementById("notificationPanel");
  var bellBtn = document.getElementById("notificationBell");
  if (
    panel &&
    panel.style.display !== "none" &&
    !panel.contains(e.target) &&
    !bellBtn.contains(e.target)
  ) {
    panel.style.display = "none";
  }
});

// ===== INITIALIZATION =====
function initGame() {
  loadGame();
  checkUnlocks();
  initDailyQuest();
  updateNotifBadge();
  showScreen("start");
}

document.addEventListener("DOMContentLoaded", initGame);
