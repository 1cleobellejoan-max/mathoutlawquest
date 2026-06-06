// Math Outlaw Quest - Game Engine (Clean Version)

// ===== GAME STATE =====
let gameState = {
  currentScreen: "start",
  selectedWorld: null,
  // V4: Per-world difficulty (each world has its own independent setting)
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

  // V2: Timer system
  timeRemaining: 0,
  timerInterval: null,
  isTimedOut: false,
  retryActive: false,
  retryQuestion: null,

  // V3: Debug mode
  debugMode: false,
  debugSettings: {
    timerEnabled: true,
    supportBoardOverride: null,
    vocabHighlightsEnabled: true,
    readAloudEnabled: true,
    writingLayerEnabled: true,
  },

  // V3: Daily quest
  dailyQuest: null,

  // V4: Notification system (structured data model)
  notifications: [], // Array of Notification objects
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

      // Ensure per-world difficulty exists for all worlds (migration from global string or old object)
      if (typeof gameState.selectedDifficulty === "string") {
        // Was using global difficulty — convert back to per-world
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

      // Ensure notifications array exists
      if (!gameState.notifications) {
        // Try to migrate from old notificationItems if present
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

      // Ensure nested objects exist
      for (const world of Object.keys(WORLDS)) {
        if (!gameState.worldProgress[world]) {
          gameState.worldProgress[world] = { correct: 0, total: 0 };
        }
      }

      // Ensure debug settings exist
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

// ===== WORLD UNLOCKING =====
function checkUnlocks() {
  // Worlds are all unlocked by default now (XP system removed)
  // Keep function as no-op for backwards compatibility
}

// ===== QUESTION GENERATION =====
function generateQuestion() {
  const worldId = gameState.selectedWorld;
  const world = WORLDS[worldId];
  if (!world) return null;

  // Use per-world selectedDifficulty
  const difficulty = gameState.selectedDifficulty[worldId] || "easy";
  console.log(
    `[DEBUG] generateQuestion: world=${worldId}, difficulty=${difficulty}`,
  );

  if (worldId === "multiplicationMountain") {
    gameState.currentQuestion = world.generateQuestion(
      difficulty,
      gameState.factIndex,
    );
    gameState.factIndex = (gameState.factIndex + 1) % world.progression.length;
  } else {
    gameState.currentQuestion = world.generateQuestion(difficulty);
  }

  gameState.currentQuestion.id = Date.now();
  gameState.wrongAttempts = 0;
  return gameState.currentQuestion;
}

// ===== TIMER SYSTEM =====
function startTimer(difficulty) {
  const world = WORLDS[gameState.selectedWorld];
  if (world && world.hasTimer === false) {
    const timerContainer = document.getElementById("timerContainer");
    if (timerContainer) timerContainer.style.display = "none";
    return;
  }
  if (!gameState.debugSettings.timerEnabled) {
    const timerContainer = document.getElementById("timerContainer");
    if (timerContainer) timerContainer.style.display = "none";
    return;
  }

  const timerContainer = document.getElementById("timerContainer");
  if (timerContainer) timerContainer.style.display = "flex";

  stopTimer();
  const timerDuration = DIFFICULTY_TIMERS[difficulty] || 30;
  gameState.timeRemaining = timerDuration;
  gameState.isTimedOut = false;

  const timerEl = document.getElementById("timerDisplay");
  const timerFill = document.getElementById("timerFill");
  if (timerEl) timerEl.textContent = formatTime(gameState.timeRemaining);
  if (timerFill) {
    timerFill.style.width = "100%";
  }

  gameState.timerInterval = setInterval(() => {
    gameState.timeRemaining--;
    if (timerEl) timerEl.textContent = formatTime(gameState.timeRemaining);

    const pct = (gameState.timeRemaining / timerDuration) * 100;
    if (timerFill) timerFill.style.width = `${pct}%`;

    if (timerEl) {
      if (gameState.timeRemaining <= 5) {
        timerEl.classList.add("timer-warning");
      } else {
        timerEl.classList.remove("timer-warning");
      }
    }

    if (gameState.timeRemaining <= 0) {
      handleTimeout();
    }
  }, 1000);

  if (timerEl) timerEl.classList.remove("timer-warning");
}

function stopTimer() {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function handleTimeout() {
  stopTimer();
  gameState.isTimedOut = true;

  const feedback = document.getElementById("feedback");
  feedback.className = "feedback wrong";
  feedback.textContent = "⏰ Time's Up!";

  const answerInput = document.getElementById("answerInput");
  const submitBtn = document.getElementById("submitBtn");
  if (answerInput) answerInput.disabled = true;
  if (submitBtn) submitBtn.disabled = true;

  const retryContainer = document.getElementById("retryContainer");
  if (retryContainer) {
    gameState.retryActive = true;
    gameState.retryQuestion = gameState.currentQuestion;
    retryContainer.innerHTML = `
      <button class="retry-btn" onclick="retryQuestion()">🔄 Try Again</button>
      <button class="skip-btn" onclick="skipQuestion()">⏭ Skip</button>
    `;
    retryContainer.className = "retry-container visible";
  }
}

function retryQuestion() {
  const retryContainer = document.getElementById("retryContainer");
  if (retryContainer) retryContainer.className = "retry-container";
  gameState.retryActive = false;
  startNewQuestion(true);
}

function skipQuestion() {
  const retryContainer = document.getElementById("retryContainer");
  if (retryContainer) retryContainer.className = "retry-container";
  gameState.retryActive = false;
  startNewQuestion();
}

// ===== ANSWER CHECKING =====
function checkAnswer(playerAnswer) {
  if (!gameState.currentQuestion) return false;

  const correct = gameState.currentQuestion.answer;
  let isCorrect = false;

  if (typeof correct === "string") {
    isCorrect = playerAnswer.trim().toLowerCase() === correct.toLowerCase();
  } else {
    const playerNum = parseFloat(playerAnswer);
    if (!isNaN(playerNum)) {
      const tolerance = 0.01;
      isCorrect = Math.abs(playerNum - correct) <= tolerance;
    }
  }

  if (isCorrect) {
    stopTimer();
    const retryContainer = document.getElementById("retryContainer");
    if (retryContainer) retryContainer.className = "retry-container";

    gameState.totalCorrect++;
    gameState.totalQuestions++;
    gameState.questionCount++;

    const worldId = gameState.currentQuestion.world;
    if (gameState.worldProgress[worldId]) {
      gameState.worldProgress[worldId].correct++;
      gameState.worldProgress[worldId].total++;
    }

    updateDailyQuestProgress(worldId);

    if (gameState.totalCorrect % 10 === 0) {
      gameState.stars++;
      showNotification("⭐ You earned a star! ⭐");
      notificationManager.add({
        type: "achievement",
        title: "⭐ Star Earned",
        message: `You earned your ${gameState.stars}th star!`,
        priority: "high",
        autoToast: false,
      });
    }

    saveGame();

    const feedback = document.getElementById("feedback");
    feedback.className = "feedback correct";
    feedback.textContent = "✅ Correct!";

    const answerInput = document.getElementById("answerInput");
    const submitBtn = document.getElementById("submitBtn");
    if (answerInput) answerInput.disabled = true;
    if (submitBtn) submitBtn.disabled = true;

    playCorrectSound();

    setTimeout(() => {
      startNewQuestion();
    }, 1500);
  } else {
    gameState.wrongAttempts++;
    gameState.totalQuestions++;
    const worldId = gameState.currentQuestion.world;
    if (gameState.worldProgress[worldId]) {
      gameState.worldProgress[worldId].total++;
    }

    if (gameState.wrongAttempts >= 2) {
      showHint(gameState.currentQuestion);
    }

    const feedback = document.getElementById("feedback");
    feedback.textContent =
      gameState.wrongAttempts === 1
        ? "❌ Not quite. Try again!"
        : "❌ Try again!";

    const answerInput = document.getElementById("answerInput");
    if (answerInput) {
      answerInput.value = "";
      answerInput.focus();
    }

    playWrongSound();

    if (gameState.wrongAttempts >= 2) {
      const hintBox = document.getElementById("hintBox");
      if (hintBox) hintBox.className = "hint-box visible";
    }
  }

  return isCorrect;
}

// ===== HELP BUTTON =====
function showHelp() {
  if (!gameState.currentQuestion) return;

  const question = gameState.currentQuestion;
  const world = WORLDS[question.world];

  let hintText = question.hint || null;
  if (!hintText && world && world.getHint) {
    hintText = world.getHint(question.question || question);
  }
  if (!hintText) {
    hintText =
      "Try breaking the problem into smaller steps. Read carefully and think about what operation to use.";
  }

  const hintBox = document.getElementById("hintBox");
  if (hintBox) {
    const hint =
      question.hint ||
      (world && world.getHint
        ? world.getHint(question.question || question)
        : hintText);
    hintBox.innerHTML = `💡 <strong>Hint:</strong><br>${hint.replace(/\n/g, "<br>")}`;
    hintBox.className = "hint-box visible";
    gameState.hintsUsed++;
  }

  const feedback = document.getElementById("feedback");
  if (feedback && !feedback.textContent) {
    feedback.textContent = "💡 Try using the hint above!";
    feedback.className = "feedback";
  }
}

// ===== SCREEN NAVIGATION =====
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((s) => {
    s.classList.remove("active");
  });
  const screen = document.getElementById(screenId);
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

// ===== MAP RENDERING =====
function renderMap() {
  const mapContainer = document.getElementById("mapContainer");
  mapContainer.innerHTML = "";

  const worldKeys = Object.keys(WORLDS);

  const worldGrid = document.createElement("div");
  worldGrid.className = "world-grid";

  worldKeys.forEach((worldId) => {
    const world = WORLDS[worldId];
    const isUnlocked = gameState.unlockedWorlds.includes(worldId);
    const progress = gameState.worldProgress[worldId];
    const pct =
      progress.total > 0
        ? Math.round((progress.correct / progress.total) * 100)
        : 0;

    const worldCard = document.createElement("div");
    worldCard.className = `world-card ${isUnlocked ? "unlocked" : "locked"}`;
    worldCard.style.borderColor = world.color;
    worldCard.innerHTML = `
            <div class="world-emoji">${isUnlocked ? world.emoji : "🔒"}</div>
            <div class="world-name">${world.name}</div>
            <div class="world-desc">${world.description}</div>
            ${
              isUnlocked
                ? `
                <div class="difficulty-selector">
                    <button class="diff-btn ${gameState.selectedDifficulty[worldId] === "easy" ? "active" : ""}" onclick="selectDifficulty('easy', '${worldId}', event)">${gameState.selectedDifficulty[worldId] === "easy" ? "✓ " : ""}Easy</button>
                    <button class="diff-btn ${gameState.selectedDifficulty[worldId] === "medium" ? "active" : ""}" onclick="selectDifficulty('medium', '${worldId}', event)">${gameState.selectedDifficulty[worldId] === "medium" ? "✓ " : ""}Medium</button>
                    <button class="diff-btn ${gameState.selectedDifficulty[worldId] === "hard" ? "active" : ""}" onclick="selectDifficulty('hard', '${worldId}', event)">${gameState.selectedDifficulty[worldId] === "hard" ? "✓ " : ""}Hard</button>
                </div>
                <button class="play-btn" onclick="playWorld('${worldId}')" style="background: ${world.color}">▶ Play</button>
            `
                : `
                <button class="play-btn" onclick="playWorld('${worldId}')" style="background: ${world.color}">▶ Play</button>
            `
            }
        `;
    worldGrid.appendChild(worldCard);
  });

  mapContainer.appendChild(worldGrid);
}

// ===== DIFFICULTY SELECTION (PER-WORLD) =====
function selectDifficulty(diff, worldId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  console.log(`[DEBUG] Difficulty pressed: ${diff} for world: ${worldId}`);
  console.log(
    `[DEBUG] Previous difficulty for ${worldId}: ${gameState.selectedDifficulty[worldId]}`,
  );

  // Set difficulty for this specific world only
  gameState.selectedDifficulty[worldId] = diff;

  console.log(
    `[DEBUG] Current difficulty state:`,
    JSON.stringify(gameState.selectedDifficulty),
  );

  // Persist
  saveGame();

  // Re-render map to update button highlights
  renderMap();
}

function playWorld(worldId) {
  const diff = gameState.selectedDifficulty[worldId] || "easy";
  console.log(`[DEBUG] playWorld: world=${worldId}, difficulty=${diff}`);

  gameState.selectedWorld = worldId;
  gameState.questionCount = 0;

  const world = WORLDS[worldId];
  if (worldId === "mathReadingTrail") {
    const themeIndex = gameState.questionCount;
    const themeName = getReadingThemeForIndex(themeIndex);
    applyReadingTheme(themeName);
  } else {
    clearReadingTheme();
  }

  showScreen("game");
}

// ===== READING THEME SYSTEM =====
function applyReadingTheme(themeName) {
  const config = THEME_CONFIGS[themeName];
  if (!config) {
    clearReadingTheme();
    return;
  }

  const appEl = document.getElementById("app");
  const decorEl = document.getElementById("themeDecorations");
  const gameEl = document.getElementById("game");

  if (appEl) {
    appEl.style.background = config.background;
    appEl.style.backgroundImage = `linear-gradient(135deg, ${config.background}, ${adjustColor(config.background, -20)})`;
  }
  if (gameEl) {
    gameEl.style.background = "transparent";
  }

  if (decorEl) {
    decorEl.innerHTML = "";
    config.decorations.forEach((deco) => {
      const el = document.createElement("div");
      el.className = "deco";
      el.textContent = deco.emoji;
      el.style.top = deco.top || "auto";
      el.style.left = deco.left || "auto";
      el.style.right = deco.right || "auto";
      el.style.fontSize = deco.size || "2rem";
      el.style.opacity = deco.opacity || 0.12;
      decorEl.appendChild(el);
    });
  }
}

function clearReadingTheme() {
  const appEl = document.getElementById("app");
  const decorEl = document.getElementById("themeDecorations");
  const gameEl = document.getElementById("game");

  if (appEl) {
    appEl.style.background = "";
    appEl.style.backgroundImage = "";
  }
  if (gameEl) {
    gameEl.style.background = "";
  }
  if (decorEl) {
    decorEl.innerHTML = "";
  }
}

function adjustColor(hex, amount) {
  if (!hex) return hex;
  hex = hex.replace("#", "");
  const num = parseInt(hex, 16);
  let r = Math.min(255, Math.max(0, (num >> 16) + amount));
  let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  let b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ===== GAME SCREEN =====
function startNewQuestion(isRetry) {
  const question = isRetry ? gameState.retryQuestion : generateQuestion();
  if (!question) return;

  const world = WORLDS[question.world];
  const questionContainer = document.getElementById("questionContainer");
  const answerInput = document.getElementById("answerInput");
  const feedback = document.getElementById("feedback");
  const hintBox = document.getElementById("hintBox");
  const submitBtn = document.getElementById("submitBtn");
  const retryContainer = document.getElementById("retryContainer");

  feedback.className = "feedback";
  feedback.textContent = "";
  hintBox.className = "hint-box";
  hintBox.textContent = "";
  answerInput.value = "";
  answerInput.disabled = false;
  submitBtn.disabled = false;
  if (retryContainer) retryContainer.className = "retry-container";

  clearCanvas();

  answerInput.focus();

  let html = `
        <div class="question-header" style="color: ${world.color}">
            ${world.emoji} ${world.name} • ${capitalize(question.difficulty)}
        </div>
    `;

  if (question.world === "mathReadingTrail" && question.storyText) {
    html += `<div class="story-text">${question.storyText}</div>`;
    html += `<div class="question-text">${question.question}</div>`;
  } else {
    html += `<div class="question-text">${question.question.replace(/\n/g, "<br>")}</div>`;
  }

  questionContainer.innerHTML = html;

  if (gameState.debugSettings.vocabHighlightsEnabled !== false) {
    document.querySelectorAll(".vocab-word").forEach((el) => {
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        const vocabKey = this.dataset.vocab;
        const worldData = WORLDS.mathReadingTrail;
        if (
          worldData &&
          worldData.vocabulary &&
          worldData.vocabulary[vocabKey]
        ) {
          showVocabPopup(vocabKey, worldData.vocabulary[vocabKey]);
        }
      });
    });
  }

  if (typeof question.answer === "string" && question.answer.includes("/")) {
    const [num, den] = question.answer.split("/");
    answerInput.placeholder = `Type answer (e.g., ${num}/${den})`;
  } else if (typeof question.answer === "number") {
    answerInput.placeholder = "Type your answer...";
  } else {
    answerInput.placeholder = "Type your answer...";
  }

  renderSupportBoard(question.world);

  const worldHasReadAloud =
    question.world === "mathReadingTrail" &&
    gameState.debugSettings.readAloudEnabled !== false;
  const readAloudContainer = document.getElementById("readAloudContainer");
  if (readAloudContainer) {
    if (worldHasReadAloud) {
      readAloudContainer.className = "read-aloud-container visible";
      readAloudContainer.innerHTML = `<span style="color: white; font-size: 0.85rem; opacity: 0.8;">📖 Read the story aloud naturally</span>`;
    } else {
      readAloudContainer.className = "read-aloud-container";
      readAloudContainer.innerHTML = "";
    }
  }

  // Use the per-world selectedDifficulty for the timer
  const difficulty =
    gameState.selectedDifficulty[question.world] ||
    question.difficulty ||
    "easy";
  startTimer(difficulty);

  setDrawingLayerEnabled(gameState.debugSettings.writingLayerEnabled !== false);
}

function submitAnswer() {
  const answerInput = document.getElementById("answerInput");
  if (!answerInput) return;

  const playerAnswer = answerInput.value.trim();
  if (!playerAnswer) return;

  const isCorrect = checkAnswer(playerAnswer);

  if (!isCorrect) {
    const feedback = document.getElementById("feedback");
    if (feedback) {
      feedback.className = "feedback wrong";
    }
  }
}

function showHint(question) {
  const hintBox = document.getElementById("hintBox");
  const world = WORLDS[question.world];
  if (world && world.getHint) {
    const hint = question.hint || world.getHint(question.question);
    hintBox.innerHTML = `💡 <strong>Hint:</strong><br>${hint.replace(/\n/g, "<br>")}`;
    hintBox.className = "hint-box visible";
    gameState.hintsUsed++;
  }
}

// ===== VOCABULARY POPUP =====
function showVocabPopup(word, definition) {
  if (gameState.debugSettings.vocabHighlightsEnabled === false) return;

  const existing = document.getElementById("vocabPopup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = "vocabPopup";
  popup.className = "vocab-popup";
  popup.innerHTML = `
    <div class="vocab-popup-content">
      <button class="vocab-popup-close" onclick="closeVocabPopup()">✕</button>
      <div class="vocab-word-highlight">${word}</div>
      <div class="vocab-definition">${definition}</div>
    </div>
  `;
  document.body.appendChild(popup);
}

function closeVocabPopup() {
  const popup = document.getElementById("vocabPopup");
  if (popup) popup.remove();
}

// ===== SUPPORT BOARD SYSTEM =====
function renderSupportBoard(worldId) {
  const supportContainer = document.getElementById("supportBoardContainer");
  if (!supportContainer) return;

  const world = WORLDS[worldId];
  if (!world || !world.supportBoard) {
    supportContainer.className = "support-board-container";
    supportContainer.innerHTML = "";
    return;
  }

  let visibility;
  if (gameState.debugSettings.supportBoardOverride === true) {
    visibility = 1;
  } else if (gameState.debugSettings.supportBoardOverride === false) {
    visibility = 0;
  } else {
    visibility = getSupportVisibility(worldId);
  }

  if (visibility <= 0) {
    supportContainer.className = "support-board-container";
    supportContainer.innerHTML = "";
    return;
  }

  const boardData = SUPPORT_BOARDS[world.supportBoard];
  if (!boardData) {
    supportContainer.className = "support-board-container";
    supportContainer.innerHTML = "";
    return;
  }

  const supportLevel = getSupportLevel(worldId);
  supportContainer.className = "support-board-container visible";
  supportContainer.style.opacity = visibility;
  supportContainer.innerHTML = `
    <details class="support-details">
      <summary class="support-summary">
        ${boardData.title} <span class="support-level">(${supportLevel})</span>
        <span class="support-toggle">▼</span>
      </summary>
      <div class="support-content">
        ${boardData.content}
      </div>
    </details>
  `;

  const details = supportContainer.querySelector(".support-details");
  if (details) {
    details.addEventListener("toggle", function () {
      const toggle = this.querySelector(".support-toggle");
      if (toggle) {
        toggle.textContent = this.open ? "▲" : "▼";
      }
    });
  }
}

function getSupportLevel(worldId) {
  const progress = gameState.worldProgress[worldId];
  if (!progress) return "Beginner";
  const correct = progress.correct || 0;
  if (correct < 10) return "Beginner";
  if (correct < 30) return "Intermediate";
  if (correct < 60) return "Skilled";
  if (correct < 100) return "Advanced";
  return "Master";
}

// ===== DAILY QUEST SYSTEM =====
function initDailyQuest() {
  const today = new Date().toISOString().split("T")[0];

  if (gameState.dailyQuest && gameState.dailyQuest.date === today) {
    addDailyQuestNotification();
    updateNotifBadge();
    return;
  }

  // Daily quest system disabled (no longer generates new quests)
  // Keep for backward compatibility with existing saved data
}

function addDailyQuestNotification() {
  if (!gameState.dailyQuest) return;

  // Remove existing daily quest notification to avoid duplicates
  notificationManager.removeByType("quest");

  const quest = gameState.dailyQuest;
  let statusMsg = "In Progress";
  if (quest.completed && !quest.rewardClaimed) {
    statusMsg = "✅ Complete!";
  } else if (quest.rewardClaimed) {
    statusMsg = "🎁 Reward Claimed";
  }

  notificationManager.add({
    type: "quest",
    title: "📅 Daily Quest",
    message: `${quest.targets.map((t, i) => `${t.name}: ${quest.progress[i]}/${t.count}`).join(" • ")} — ${statusMsg}`,
    priority: "high",
    autoToast: false,
  });
}

function updateDailyQuestProgress(worldId) {
  if (!gameState.dailyQuest || gameState.dailyQuest.completed) return;
  const quest = gameState.dailyQuest;
  let updated = false;

  quest.targets.forEach((target, i) => {
    if (target.world === worldId && quest.progress[i] < target.count) {
      quest.progress[i]++;
      updated = true;
    }
  });

  if (updated) {
    const allDone = quest.targets.every((t, i) => quest.progress[i] >= t.count);
    if (allDone && !quest.completed) {
      quest.completed = true;
      showNotification("🎉 Daily Quest Complete!");
      notificationManager.add({
        type: "quest",
        title: "🎯 Quest Complete",
        message: "You've completed today's daily quest!",
        priority: "high",
        autoToast: false,
      });
    }
    saveGame();
    addDailyQuestNotification();
    updateNotifBadge();
  }
}

function claimDailyQuestReward() {
  if (
    !gameState.dailyQuest ||
    !gameState.dailyQuest.completed ||
    gameState.dailyQuest.rewardClaimed
  )
    return;

  gameState.dailyQuest.rewardClaimed = true;
  gameState.stars += DAILY_QUEST_CONFIG.rewardStars;

  saveGame();
  updateNotifBadge();

  showNotification(`🎁 Claimed! +⭐ Star`);

  notificationManager.add({
    type: "reward",
    title: "🎁 Quest Reward Claimed",
    message: `You received ⭐ Star`,
    priority: "high",
    autoToast: false,
  });

  addDailyQuestNotification();
}

// ===== NOTIFICATION MANAGER (Central Controller) =====
const notificationManager = {
  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },

  add({
    type = "system",
    title = "Notification",
    message = "",
    priority = "medium",
    autoToast = true,
  }) {
    const notification = {
      id: this._generateId(),
      type: type, // "xp" | "quest" | "reward" | "system" | "achievement"
      title: title,
      message: message,
      read: false,
      timestamp: Date.now(),
      priority: priority, // "low" | "medium" | "high"
      autoToast: autoToast,
    };

    gameState.notifications.unshift(notification);

    // Limit to 50 notifications
    if (gameState.notifications.length > 50) {
      gameState.notifications = gameState.notifications.slice(0, 50);
    }

    saveGame();
    updateNotifBadge();

    // Show toast if autoToast is true
    if (autoToast) {
      showNotification(`${title}: ${message}`);
    }

    return notification;
  },

  getAll() {
    // Return sorted by timestamp descending (newest first)
    return [...gameState.notifications].sort(
      (a, b) => b.timestamp - a.timestamp,
    );
  },

  getUnreadCount() {
    return gameState.notifications.filter((n) => !n.read).length;
  },

  markAsRead(id) {
    const notif = gameState.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      saveGame();
      updateNotifBadge();
    }
  },

  markAllRead() {
    gameState.notifications.forEach((n) => {
      n.read = true;
    });
    saveGame();
    updateNotifBadge();
  },

  clearNotification(id) {
    gameState.notifications = gameState.notifications.filter(
      (n) => n.id !== id,
    );
    saveGame();
    updateNotifBadge();
  },

  removeByType(type) {
    gameState.notifications = gameState.notifications.filter(
      (n) => n.type !== type,
    );
    saveGame();
    updateNotifBadge();
  },

  getGrouped() {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const todayMs = new Date(todayStr + "T00:00:00").getTime();

    const groups = {
      today: [],
      quests: [],
      rewards: [],
      system: [],
    };

    const all = this.getAll();
    all.forEach((n) => {
      if (n.type === "quest") {
        groups.quests.push(n);
      } else if (n.type === "reward") {
        groups.rewards.push(n);
      } else if (n.type === "system") {
        groups.system.push(n);
      } else {
        // achievement or others — put in "today" if recent
        if (n.timestamp >= todayMs) {
          groups.today.push(n);
        } else {
          groups.system.push(n);
        }
      }
    });

    // Sort within groups by timestamp desc (newest first)
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => b.timestamp - a.timestamp);
    });

    return groups;
  },
};

// ===== NOTIFICATION PANEL SYSTEM =====
function toggleNotificationPanel() {
  const panel = document.getElementById("notificationPanel");
  if (!panel) return;

  const isVisible = panel.style.display !== "none";
  panel.style.display = isVisible ? "none" : "block";

  if (!isVisible) {
    renderNotificationPanel();
    notificationManager.markAllRead();
  }
}

function renderNotificationPanel() {
  const content = document.getElementById("notifPanelContent");
  if (!content) return;

  const groups = notificationManager.getGrouped();

  // Check if everything is empty
  const allEmpty = Object.values(groups).every((arr) => arr.length === 0);
  if (allEmpty) {
    content.innerHTML = `<div class="notif-empty">No notifications yet.</div>`;
    return;
  }

  let html = "";

  // Section: Today
  if (groups.today.length > 0) {
    html += `<div class="notif-section-title">📌 Today</div>`;
    groups.today.forEach((item) => {
      html += buildNotifItemHTML(item);
    });
  }

  // Section: Quests
  if (groups.quests.length > 0) {
    html += `<div class="notif-section-title">🎯 Quests</div>`;
    groups.quests.forEach((item) => {
      html += buildNotifItemHTML(item);
    });
  }

  // Section: Rewards
  if (groups.rewards.length > 0) {
    html += `<div class="notif-section-title">🏆 Rewards</div>`;
    groups.rewards.forEach((item) => {
      html += buildNotifItemHTML(item);
    });
  }

  // Section: System
  if (groups.system.length > 0) {
    html += `<div class="notif-section-title">⚙ System</div>`;
    groups.system.forEach((item) => {
      html += buildNotifItemHTML(item);
    });
  }

  content.innerHTML = html;
}

function buildNotifItemHTML(item) {
  const typeIcon =
    {
      quest: "🎯",
      reward: "🎁",
      system: "⚙",
      achievement: "🏆",
    }[item.type] || "📌";

  const canClaim =
    item.type === "quest" &&
    gameState.dailyQuest &&
    gameState.dailyQuest.completed &&
    !gameState.dailyQuest.rewardClaimed;

  return `
    <div class="notif-item ${item.read ? "notif-item-read" : ""}">
      <div class="notif-item-header">
        <span class="notif-item-icon">${typeIcon}</span>
        <span class="notif-item-title">${item.title}</span>
      </div>
      <div class="notif-item-msg">${item.message}</div>
      <div class="notif-item-actions">
        ${canClaim ? `<button class="notif-action-btn" onclick="claimDailyQuestReward(); toggleNotificationPanel();">🎁 Claim Reward</button>` : ""}
        <button class="notif-action-btn notif-action-dismiss" onclick="notificationManager.clearNotification('${item.id}'); renderNotificationPanel();">Dismiss</button>
      </div>
    </div>
  `;
}

function updateNotifBadge() {
  const badge = document.getElementById("notifBadge");
  if (!badge) return;

  const count = notificationManager.getUnreadCount();
  if (count > 0) {
    badge.style.display = "flex";
    badge.textContent = count > 9 ? "9+" : count;
  } else {
    badge.style.display = "none";
  }
}

// ===== TOAST NOTIFICATION SYSTEM =====
function showNotification(message) {
  const container = document.getElementById("notificationContainer");
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  container.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// ===== SOUND EFFECTS =====
function playCorrectSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(523, ctx.currentTime);
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
}

function playWrongSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

// ===== DASHBOARD =====
function renderDashboard() {
  const dashboardContent = document.getElementById("dashboardContent");
  dashboardContent.innerHTML = "";

  const statsCard = document.createElement("div");
  statsCard.className = "stats-card";
  statsCard.innerHTML = `
        <h3>📊 Your Progress</h3>
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">${gameState.totalCorrect}/${gameState.totalQuestions}</div>
                <div class="stat-label">Correct</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${gameState.stars} ⭐</div>
                <div class="stat-label">Stars</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${gameState.unlockedWorlds.length}/${Object.keys(WORLDS).length}</div>
                <div class="stat-label">Worlds</div>
            </div>
        </div>
    `;
  dashboardContent.appendChild(statsCard);

  const worldProgressCard = document.createElement("div");
  worldProgressCard.className = "stats-card";
  worldProgressCard.innerHTML = "<h3>🗺️ World Progress</h3>";
  const progList = document.createElement("div");
  progList.className = "world-progress-list";

  for (const [worldId, world] of Object.entries(WORLDS)) {
    const progress = gameState.worldProgress[worldId];
    const pct =
      progress.total > 0
        ? Math.round((progress.correct / progress.total) * 100)
        : 0;
    const isUnlocked = gameState.unlockedWorlds.includes(worldId);

    const row = document.createElement("div");
    row.className = "world-progress-row";
    row.innerHTML = `
            <span class="wp-emoji">${isUnlocked ? world.emoji : "🔒"}</span>
            <span class="wp-name">${world.name}</span>
            <div class="wp-bar">
                <div class="wp-fill" style="width: ${pct}%; background: ${isUnlocked ? world.color : "#666"}"></div>
            </div>
            <span class="wp-pct">${pct}%</span>
        `;
    progList.appendChild(row);
  }

  worldProgressCard.appendChild(progList);
  dashboardContent.appendChild(worldProgressCard);

  if (gameState.dailyQuest && !gameState.dailyQuest.rewardClaimed) {
    const questCard = document.createElement("div");
    questCard.className = "stats-card";
    const quest = gameState.dailyQuest;
    let questHtml = `<h3>📅 Today's Quest</h3><div class="world-progress-list">`;
    quest.targets.forEach((t, i) => {
      const done = quest.progress[i] >= t.count;
      questHtml += `<div class="world-progress-row">
        <span class="wp-emoji">${done ? "✅" : "⬜"}</span>
        <span class="wp-name">${t.count} ${t.name}</span>
        <div class="wp-bar"><div class="wp-fill" style="width: ${Math.min((quest.progress[i] / t.count) * 100, 100)}%; background: #ffb300;"></div></div>
        <span class="wp-pct">${quest.progress[i]}/${t.count}</span>
      </div>`;
    });
    questHtml += `</div>`;
    if (quest.completed && !quest.rewardClaimed) {
      questHtml += `<button class="debug-btn" style="margin-top:10px;" onclick="claimDailyQuestReward(); renderDashboard();">🎁 Claim Reward (⭐ Star)</button>`;
    }
    questCard.innerHTML = questHtml;
    dashboardContent.appendChild(questCard);
  }

  const tipsCard = document.createElement("div");
  tipsCard.className = "stats-card";
  tipsCard.innerHTML = `
        <h3>👨‍👩‍👧 Parent Tips</h3>
        <ul class="tips-list">
            <li>📅 Encourage 10-15 minutes of daily practice</li>
            <li>🎯 Celebrate small wins and progress</li>
            <li>💡 Wrong answers = learning opportunities</li>
            <li>🌟 Stars are earned every 10 correct answers</li>
            <li>📝 Use the Work Area to draw calculations</li>
            <li>💡 Tap "I Need Help" for guided hints</li>
        </ul>
        <button class="danger-btn" onclick="resetGame()">🗑️ Reset All Progress</button>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid #eee;">
        <div style="display: flex; gap: 10px;">
            <button class="debug-btn" onclick="debugUnlockAllWorlds()">🔓 Unlock All Worlds</button>
            <button class="debug-btn" onclick="debugLockAllWorlds()">🔒 Lock All Worlds</button>
        </div>
        <div style="font-size: 0.75rem; color: #999; margin-top: 8px; text-align: center;">Debug Tools — for testing only</div>
    `;
  dashboardContent.appendChild(tipsCard);
}

// ===== DEBUG PANEL =====
function toggleDebugPanel() {
  const panel = document.getElementById("debugPanel");
  if (!panel) return;

  const isVisible = panel.style.display !== "none";
  panel.style.display = isVisible ? "none" : "flex";

  if (!isVisible) {
    gameState.debugMode = true;
    updateDebugLabel();
  }
}

function updateDebugLabel() {
  const label = document.getElementById("debugModeLabel");
  if (!label) return;

  if (gameState.debugMode) {
    label.style.display = "block";
  } else {
    label.style.display = "none";
  }
}

// ===== DEBUG FUNCTIONS =====
function debugUnlockAllWorlds() {
  const allWorldIds = Object.keys(WORLDS);
  gameState.unlockedWorlds = allWorldIds;
  gameState.debugMode = true;
  saveGame();
  showNotification("🔓 All worlds unlocked!");
  updateDebugLabel();
  if (gameState.currentScreen === "map") renderMap();
  if (gameState.currentScreen === "dashboard") renderDashboard();
}

function debugLockAllWorlds() {
  gameState.unlockedWorlds = ["numberRanch", "subtractionCanyon"];
  gameState.debugMode = true;
  saveGame();
  showNotification(
    "🔒 Worlds locked to default (Number Ranch, Subtraction Canyon)",
  );
  updateDebugLabel();
  if (gameState.currentScreen === "map") renderMap();
  if (gameState.currentScreen === "dashboard") renderDashboard();
}

function debugTimerToggle(enabled) {
  gameState.debugSettings.timerEnabled = enabled;
  gameState.debugMode = true;
  saveGame();
  showNotification(`⏱️ Timer ${enabled ? "ON" : "OFF"}`);
  updateDebugLabel();
}

function debugVocabToggle(enabled) {
  gameState.debugSettings.vocabHighlightsEnabled = enabled;
  gameState.debugMode = true;
  saveGame();
  showNotification(`📖 Vocab Highlights ${enabled ? "Enabled" : "Disabled"}`);
  updateDebugLabel();
}

function debugReadToggle(enabled) {
  gameState.debugSettings.readAloudEnabled = enabled;
  gameState.debugMode = true;
  saveGame();
  showNotification(`📖 Read Aloud ${enabled ? "Enabled" : "Disabled"}`);
  updateDebugLabel();
}

function debugDrawToggle(enabled) {
  gameState.debugSettings.writingLayerEnabled = enabled;
  gameState.debugMode = true;
  setDrawingLayerEnabled(enabled);
  saveGame();
  showNotification(`✏️ Writing Layer ${enabled ? "Enabled" : "Disabled"}`);
  updateDebugLabel();
}

function debugSupportForce(forceOn) {
  gameState.debugSettings.supportBoardOverride = forceOn;
  gameState.debugMode = true;
  saveGame();
  showNotification(`📋 Support Board ${forceOn ? "Forced ON" : "Forced OFF"}`);
  updateDebugLabel();
  if (gameState.currentScreen === "game" && gameState.selectedWorld) {
    renderSupportBoard(gameState.selectedWorld);
  }
}

function debugSupportAuto() {
  gameState.debugSettings.supportBoardOverride = null;
  gameState.debugMode = true;
  saveGame();
  showNotification("📋 Support Board: Auto mode");
  updateDebugLabel();
  if (gameState.currentScreen === "game" && gameState.selectedWorld) {
    renderSupportBoard(gameState.selectedWorld);
  }
}

// ===== UTILITY =====
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ===== KEYBOARD SUPPORT =====
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && gameState.currentScreen === "game") {
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn && !submitBtn.disabled) {
      submitAnswer();
    }
  }
  if (e.key === "Escape") {
    closeVocabPopup();
  }
});

document.addEventListener("click", function (e) {
  const popup = document.getElementById("vocabPopup");
  if (
    popup &&
    !popup.querySelector(".vocab-popup-content").contains(e.target)
  ) {
    closeVocabPopup();
  }
});

document.addEventListener("click", function (e) {
  const panel = document.getElementById("notificationPanel");
  const bellBtn = document.getElementById("notificationBell");
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
