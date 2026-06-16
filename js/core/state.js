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
    ratioRidge: "easy",
    dataHarbor: "easy",
    numberKingdom: "easy",
  },
  currentQuestion: null,
  totalCorrect: 0,
  totalQuestions: 0,
  hintsUsed: 0,
  unlockedWorlds: ["numberRanch", "subtractionCanyon"],
  progression: {
    xp: 0,
    level: 1,
    xpToNextLevel: 100,
  },
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
    ratioRidge: { correct: 0, total: 0 },
    dataHarbor: { correct: 0, total: 0 },
    numberKingdom: { correct: 0, total: 0 },
  },
  stars: 0,
  badges: [],
  factIndex: 0,
  questionCount: 0,
  wrongAttempts: 0,
  retryActive: false,
  retryQuestion: null,
  // Lesson session tracking
  lessonStartTime: null,
  lessonEndTime: null,
  lessonSession: null, // { correct, incorrect, xpGained, starsGained, bestChain, duration }
  currentChain: 0,
  bestChain: 0,
  sessionXpGained: 0,
  sessionCorrect: 0,
  sessionIncorrect: 0,
  debugMode: false,
  debugSettings: {
    supportBoardOverride: null,
    vocabHighlightsEnabled: true,
    readAloudEnabled: true,
    writingLayerEnabled: true,
  },
  dailyQuest: null,
  notifications: [],
  // Reward system
  rewardPoints: 0,
  claimedMilestones: [],
  milestonePending: false,
  pendingMilestoneIndex: -1,
  // Weekly quest
  weeklyQuest: null,
  // Study time tracking
  studyStats: {
    totalStudyTimeMs: 0,
    lessonsCompleted: 0,
    longestSessionMs: 0,
  },
  lessonHistory: [],
  // Number Kingdom specific state
  kingdomStage: 0, // 0-5 for stages, 6 for boss
  kingdomStageProgress: [0, 0, 0, 0, 0, 0], // progress per stage (0 to stageRequired)
  kingdomStageCompleted: [false, false, false, false, false, false],
  kingdomCoins: 0,
  kingdomHearts: 3,
  kingdomBossHP: 10,
  kingdomBossTimer: 60,
  kingdomWrongAnswers: [], // [{ question, correctAnswer, userAnswer, stage }]
  kingdomPracticeMode: false,
  kingdomPracticeQueue: [],
  kingdomBossDefeated: false,
  kingdomDailyCleared: false,
  kingdomWeeklyStreak: 0,
  kingdomLastPlayDate: null,
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
          supportBoardOverride: null,
          vocabHighlightsEnabled: true,
          readAloudEnabled: true,
          writingLayerEnabled: true,
        };
      }

      if (!gameState.progression) {
        gameState.progression = {
          xp: 0,
          level: 1,
          xpToNextLevel: 100,
        };
      }
      if (typeof gameState.progression.xp !== "number") {
        gameState.progression.xp = 0;
      }
      if (typeof gameState.progression.level !== "number") {
        gameState.progression.level = 1;
      }
      if (typeof gameState.progression.xpToNextLevel !== "number") {
        gameState.progression.xpToNextLevel = 100;
      }

      // Migrate Number Kingdom defaults
      if (!gameState.kingdomStageProgress)
        gameState.kingdomStageProgress = [0, 0, 0, 0, 0, 0];
      if (!gameState.kingdomStageCompleted)
        gameState.kingdomStageCompleted = [
          false,
          false,
          false,
          false,
          false,
          false,
        ];
      if (typeof gameState.kingdomCoins !== "number")
        gameState.kingdomCoins = 0;
      if (typeof gameState.kingdomHearts !== "number")
        gameState.kingdomHearts = 3;
      if (typeof gameState.kingdomBossDefeated !== "boolean")
        gameState.kingdomBossDefeated = false;
      if (!gameState.kingdomWrongAnswers) gameState.kingdomWrongAnswers = [];

      updateUnlockedWorlds();
      return true;
    }
  } catch (e) {
    console.log("Load failed:", e);
  }
  // Migrate: ensure studyStats exists
  if (!gameState.studyStats) {
    gameState.studyStats = {
      totalStudyTimeMs: 0,
      lessonsCompleted: 0,
      longestSessionMs: 0,
    };
  }
  // Migrate: ensure lessonHistory exists
  if (!gameState.lessonHistory) {
    gameState.lessonHistory = [];
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
  updateUnlockedWorlds();
}

function isWorldUnlocked(worldId) {
  var requiredStars = WORLD_UNLOCK_REQUIREMENTS[worldId];
  if (typeof requiredStars !== "number") return false;
  return gameState.stars >= requiredStars;
}

function updateUnlockedWorlds() {
  gameState.unlockedWorlds = Object.keys(WORLD_UNLOCK_REQUIREMENTS).filter(
    function (worldId) {
      return isWorldUnlocked(worldId);
    },
  );
}

function addXp(amount) {
  if (!gameState.progression) {
    gameState.progression = {
      xp: 0,
      level: 1,
      xpToNextLevel: 100,
    };
  }
  // Migrate saved data: ensure studyStats exists
  if (!gameState.studyStats) {
    gameState.studyStats = {
      totalStudyTimeMs: 0,
      lessonsCompleted: 0,
      longestSessionMs: 0,
    };
  }
  // Migrate saved data: ensure lessonHistory exists
  if (!gameState.lessonHistory) {
    gameState.lessonHistory = [];
  }

  gameState.progression.xp += amount;
  while (gameState.progression.xp >= gameState.progression.xpToNextLevel) {
    gameState.progression.xp -= gameState.progression.xpToNextLevel;
    gameState.progression.level++;
    gameState.progression.xpToNextLevel += 50;
  }
}

function calculateLessonStars(correct, total) {
  if (total <= 0) return 0;
  var accuracy = (correct / total) * 100;
  if (accuracy >= 90) return 3;
  if (accuracy >= 75) return 2;
  if (accuracy >= 50) return 1;
  return 0;
}
