// ===== GAME STATE =====
let gameState = {
  currentScreen: "start",
  selectedWorld: null,
  selectedDifficulty: {
    numberRanch: "easy",
    subtractionCanyon: "easy",
    multiplicationMountain: "easy",
    divisionDesert: "easy",
    moneyMarket: "easy",
    timeTower: "easy",
    fractionForest: "easy",
    decimalDocks: "easy",
    mathReadingTrail: "easy",
  },
  currentQuestion: null,
  totalCorrect: 0,
  totalQuestions: 0,
  hintsUsed: 0,
  unlockedWorlds: ["numberRanch", "subtractionCanyon"],
  worldProgress: {
    numberRanch: { correct: 0, total: 0 },
    subtractionCanyon: { correct: 0, total: 0 },
    multiplicationMountain: { correct: 0, total: 0 },
    divisionDesert: { correct: 0, total: 0 },
    moneyMarket: { correct: 0, total: 0 },
    timeTower: { correct: 0, total: 0 },
    fractionForest: { correct: 0, total: 0 },
    decimalDocks: { correct: 0, total: 0 },
    mathReadingTrail: { correct: 0, total: 0 },
  },
  stars: 0,
  badges: [],
  factIndex: 0,
  questionCount: 0,
  wrongAttempts: 0,
  timeRemaining: 0,
  timerInterval: null,
  isTimedOut: false,
  retryActive: false,
  retryQuestion: null,
  debugMode: false,
  debugSettings: {
    timerEnabled: true,
    supportBoardOverride: null,
    vocabHighlightsEnabled: true,
    readAloudEnabled: true,
    writingLayerEnabled: true,
  },
  dailyQuest: null,
  notifications: [],
};

// ===== SAVE SYSTEM =====
function saveGame() {
  try {
    localStorage.setItem("mathOutlawQuest", JSON.stringify(gameState));
  } catch (e) {
    console.log("Save failed:", e);
  }
}

function loadGame() {
  try {
    const saved = localStorage.getItem("mathOutlawQuest");
    if (saved) {
      const parsed = JSON.parse(saved);
      gameState = { ...gameState, ...parsed };

      if (typeof gameState.selectedDifficulty === "string") {
        const globalVal = gameState.selectedDifficulty || "easy";
        gameState.selectedDifficulty = {};
        for (const world of Object.keys(WORLDS)) {
          gameState.selectedDifficulty[world] = globalVal;
        }
      }
      for (const world of Object.keys(WORLDS)) {
        if (!gameState.selectedDifficulty[world]) {
          gameState.selectedDifficulty[world] = "easy";
        }
      }

      if (!gameState.notifications) {
        if (
          parsed.notificationItems &&
          Array.isArray(parsed.notificationItems)
        ) {
          gameState.notifications = parsed.notificationItems.map((n) => ({
            id:
              n.id ||
              Date.now().toString() + Math.random().toString(36).slice(2, 6),
            type: n.type === "dailyQuest" ? "quest" : "system",
            title: n.title || "Notification",
            message: n.message || "",
            read: n.read || false,
            timestamp: n.date
              ? new Date(n.date + "T00:00:00").getTime()
              : Date.now(),
            priority: "medium",
            autoToast: false,
          }));
        } else {
          gameState.notifications = [];
        }
      }

      for (const world of Object.keys(WORLDS)) {
        if (!gameState.worldProgress[world]) {
          gameState.worldProgress[world] = { correct: 0, total: 0 };
        }
      }

      if (!gameState.debugSettings) {
        gameState.debugSettings = {
          timerEnabled: true,
          supportBoardOverride: null,
          vocabHighlightsEnabled: true,
          readAloudEnabled: true,
          writingLayerEnabled: true,
        };
      }
      return true;
    }
  } catch (e) {
    console.log("Load failed:", e);
  }
  return false;
}

function resetGame() {
  const confirmed = confirm("Reset all progress? This cannot be undone!");
  if (confirmed) {
    localStorage.removeItem("mathOutlawQuest");
    location.reload();
  }
}

function checkUnlocks() {
  // Worlds are all unlocked by default now (XP system removed)
}
