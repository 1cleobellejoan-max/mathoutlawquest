// Math Outlaw Quest - Game Engine (Version 3)

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
  xp: 0,
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

  // V2: Chain system
  chain: 0,
  bestChain: 0,
  chainXpBonus: 0,

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
    chainEnabled: true,
    supportBoardOverride: null, // true=force on, false=force off, null=auto
    vocabHighlightsEnabled: true,
    readAloudEnabled: true,
    writingLayerEnabled: true,
  },

  // V3: Daily quest
  dailyQuest: null,
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
      // Ensure nested objects exist
      for (const world of Object.keys(WORLDS)) {
        if (!gameState.worldProgress[world]) {
          gameState.worldProgress[world] = { correct: 0, total: 0 };
        }
      }
      // Ensure per-world difficulty exists for all worlds
      for (const world of Object.keys(WORLDS)) {
        if (!gameState.selectedDifficulty[world]) {
          gameState.selectedDifficulty[world] = "easy";
        }
      }
      // Ensure debug settings exist
      if (!gameState.debugSettings) {
        gameState.debugSettings = {
          timerEnabled: true,
          chainEnabled: true,
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
  const xp = gameState.xp;
  const newUnlocks = [];
  for (const [worldId, world] of Object.entries(WORLDS)) {
    if (!gameState.unlockedWorlds.includes(worldId) && xp >= world.unlockXP) {
      gameState.unlockedWorlds.push(worldId);
      newUnlocks.push(world.name);
    }
  }
  if (newUnlocks.length > 0) {
    setTimeout(() => {
      showNotification(`🎉 New world unlocked: ${newUnlocks.join(", ")}`);
    }, 500);
  }
}

// ===== QUESTION GENERATION =====
function generateQuestion() {
  const worldId = gameState.selectedWorld;
  const world = WORLDS[worldId];
  if (!world) return null;

  let difficulty = gameState.selectedDifficulty[worldId] || "easy";

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

// ===== CHAIN SYSTEM =====
function updateChain(isCorrect) {
  // Check debug override for chain
  if (!gameState.debugSettings.chainEnabled) {
    return;
  }

  if (isCorrect) {
    gameState.chain++;
    if (gameState.chain > gameState.bestChain) {
      gameState.bestChain = gameState.chain;
    }
    gameState.chainXpBonus = getChainBonus(gameState.chain);
  } else {
    if (gameState.chain >= 3) {
      showNotification("💔 Chain Broken! Try Again!");
    }
    gameState.chain = 0;
    gameState.chainXpBonus = 0;
  }
  updateChainDisplay();
}

function updateChainDisplay() {
  const chainEl = document.getElementById("chainDisplay");
  if (!chainEl) return;
  if (gameState.chain >= 3) {
    const emoji = getChainEmoji(gameState.chain);
    const bonus = getChainBonus(gameState.chain);
    chainEl.innerHTML = `🔥 Chain x${gameState.chain} ${emoji} <span class="chain-bonus">+${bonus} XP bonus</span>`;
    chainEl.className = "chain-display visible";
  } else {
    chainEl.className = "chain-display";
    chainEl.innerHTML = "";
  }
}

// ===== TIMER SYSTEM =====
function startTimer(difficulty) {
  // Check if timer should run (Reading Trail has no timer, debug may disable it)
  const world = WORLDS[gameState.selectedWorld];
  if (world && world.hasTimer === false) {
    // Reading Trail: hide timer display, no timer
    const timerContainer = document.getElementById("timerContainer");
    if (timerContainer) timerContainer.style.display = "none";
    return;
  }
  if (!gameState.debugSettings.timerEnabled) {
    const timerContainer = document.getElementById("timerContainer");
    if (timerContainer) timerContainer.style.display = "none";
    return;
  }

  // Show timer container
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

    // Warning animation when low
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

  // Chain reset
  updateChain(false);

  // Retry option
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
  // Restart same question with fresh timer
  startNewQuestion(true);
}

function skipQuestion() {
  const retryContainer = document.getElementById("retryContainer");
  if (retryContainer) retryContainer.className = "retry-container";
  gameState.retryActive = false;
  gameState.chain = 0;
  updateChainDisplay();
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
    // Stop timer
    stopTimer();
    const retryContainer = document.getElementById("retryContainer");
    if (retryContainer) retryContainer.className = "retry-container";

    // Calculate XP with time bonus
    const difficulty = gameState.currentQuestion.difficulty;
    const timerDuration = DIFFICULTY_TIMERS[difficulty] || 30;
    const timeBonus = gameState.timeRemaining > timerDuration / 2 ? 5 : 0;

    // Chain bonus
    updateChain(true);
    const chainBonus = gameState.chainXpBonus;

    const totalXpEarned = 10 + timeBonus + chainBonus;
    gameState.xp += totalXpEarned;
    gameState.totalCorrect++;
    gameState.totalQuestions++;
    gameState.questionCount++;

    const worldId = gameState.currentQuestion.world;
    if (gameState.worldProgress[worldId]) {
      gameState.worldProgress[worldId].correct++;
      gameState.worldProgress[worldId].total++;
    }

    // Update daily quest progress
    updateDailyQuestProgress(worldId);

    if (gameState.totalCorrect % 10 === 0) {
      gameState.stars++;
      showNotification("⭐ You earned a star! ⭐");
    }

    checkUnlocks();
    saveGame();

    const feedback = document.getElementById("feedback");
    feedback.className = "feedback correct";
    let bonusText = "";
    if (timeBonus > 0 && gameState.debugSettings.timerEnabled)
      bonusText += ` ⚡+${timeBonus}`;
    if (chainBonus > 0 && gameState.debugSettings.chainEnabled)
      bonusText += ` 🔗+${chainBonus}`;
    feedback.textContent = `✅ Correct! +10${bonusText} XP`;

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

  // Show hint immediately (no need for 2 wrong attempts)
  const question = gameState.currentQuestion;
  const world = WORLDS[question.world];

  // Try to get hint from the question object first, then from world
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
    // Use the question's hint if available (for reading trail), otherwise use world hint
    const hint =
      question.hint ||
      (world && world.getHint
        ? world.getHint(question.question || question)
        : hintText);
    hintBox.innerHTML = `💡 <strong>Hint:</strong><br>${hint.replace(/\n/g, "<br>")}`;
    hintBox.className = "hint-box visible";
    gameState.hintsUsed++;
  }

  // Also show feedback that help was given
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
    updateStatusBar();
  } else if (screenId === "game") {
    startNewQuestion();
    updateStatusBar();
  } else if (screenId === "dashboard") {
    renderDashboard();
    updateStatusBar();
  }

  // Update debug label visibility
  updateDebugLabel();
}

// ===== MAP RENDERING =====
function renderMap() {
  const mapContainer = document.getElementById("mapContainer");
  mapContainer.innerHTML = "";

  const worldKeys = Object.keys(WORLDS);

  const xpBar = document.createElement("div");
  xpBar.className = "xp-bar";
  xpBar.innerHTML = `
        <div class="xp-bar-inner" style="width: ${Math.min(gameState.xp / 20, 100)}%"></div>
        <span class="xp-bar-text">XP: ${gameState.xp}</span>
    `;
  mapContainer.appendChild(xpBar);

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
                <div class="world-progress-bar">
                    <div class="world-progress-fill" style="width: ${pct}%; background: ${world.color}"></div>
                </div>
                <div class="world-pct">${pct}%</div>
                <div class="difficulty-selector">
                    <button class="diff-btn ${gameState.selectedDifficulty[worldId] === "easy" ? "active" : ""}" onclick="selectDifficulty('easy', '${worldId}', event)">Easy</button>
                    <button class="diff-btn ${gameState.selectedDifficulty[worldId] === "medium" ? "active" : ""}" onclick="selectDifficulty('medium', '${worldId}', event)">Medium</button>
                    <button class="diff-btn ${gameState.selectedDifficulty[worldId] === "hard" ? "active" : ""}" onclick="selectDifficulty('hard', '${worldId}', event)">Hard</button>
                </div>
                <button class="play-btn" onclick="playWorld('${worldId}')" style="background: ${world.color}">▶ Play</button>
            `
                : `
                <div class="world-lock-info">Need ${world.unlockXP} XP to unlock</div>
            `
            }
        `;
    worldGrid.appendChild(worldCard);
  });

  mapContainer.appendChild(worldGrid);
}

function selectDifficulty(diff, worldId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  gameState.selectedDifficulty[worldId] = diff;
  gameState.selectedWorld = worldId;
  renderMap();
}

function playWorld(worldId) {
  gameState.selectedWorld = worldId;
  gameState.questionCount = 0;
  // Reset chain when switching worlds
  gameState.chain = 0;
  updateChainDisplay();

  // Apply reading theme if it's the reading trail
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
  // Simple color darken/lighten
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

  // Only clear work area for each new question
  clearCanvas();

  answerInput.focus();

  // Show world context
  let html = `
        <div class="question-header" style="color: ${world.color}">
            ${world.emoji} ${world.name} • ${capitalize(question.difficulty)}
        </div>
    `;

  // For reading trail, show story context with vocabulary
  if (question.world === "mathReadingTrail" && question.storyText) {
    html += `<div class="story-text">${question.storyText}</div>`;
    html += `<div class="question-text">${question.question}</div>`;
  } else {
    html += `<div class="question-text">${question.question.replace(/\n/g, "<br>")}</div>`;
  }

  questionContainer.innerHTML = html;

  // Attach vocabulary click handlers (if vocab highlights enabled)
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

  // Handle fraction answers
  if (typeof question.answer === "string" && question.answer.includes("/")) {
    const [num, den] = question.answer.split("/");
    answerInput.placeholder = `Type answer (e.g., ${num}/${den})`;
  } else if (typeof question.answer === "number") {
    answerInput.placeholder = "Type your answer...";
  } else {
    answerInput.placeholder = "Type your answer...";
  }

  // Show support board if available
  renderSupportBoard(question.world);

  // Show read-aloud button for reading trail (if enabled)
  const worldHasReadAloud =
    question.world === "mathReadingTrail" &&
    gameState.debugSettings.readAloudEnabled !== false;
  const readAloudContainer = document.getElementById("readAloudContainer");
  if (readAloudContainer) {
    // Reading Trail shows read-aloud prompt as text guidance, no recording buttons
    if (worldHasReadAloud) {
      readAloudContainer.className = "read-aloud-container visible";
      readAloudContainer.innerHTML = `<span style="color: white; font-size: 0.85rem; opacity: 0.8;">📖 Read the story aloud naturally</span>`;
    } else {
      readAloudContainer.className = "read-aloud-container";
      readAloudContainer.innerHTML = "";
    }
  }

  // Start timer (won't start for Reading Trail)
  const difficulty =
    question.difficulty ||
    gameState.selectedDifficulty[question.world] ||
    "easy";
  startTimer(difficulty);

  // Update chain display
  updateChainDisplay();

  // Update work area visibility based on debug setting
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
  // Check if vocab highlights are disabled
  if (gameState.debugSettings.vocabHighlightsEnabled === false) return;

  // Remove existing popup
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

  // Check debug override
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

  // Support toggle for progressive fade
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

  // If we already have a quest for today, use it
  if (gameState.dailyQuest && gameState.dailyQuest.date === today) {
    updateDailyQuestBanner();
    return;
  }

  // Generate new quest for today
  const newQuest = generateDailyQuest(gameState.unlockedWorlds);
  if (newQuest) {
    gameState.dailyQuest = newQuest;
    saveGame();
    updateDailyQuestBanner();
  }
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
    // Check if all targets completed
    const allDone = quest.targets.every((t, i) => quest.progress[i] >= t.count);
    if (allDone && !quest.completed) {
      quest.completed = true;
      showNotification("🎉 Daily Quest Complete! Claim your reward!");
    }
    saveGame();
    updateDailyQuestBanner();
  }
}

function updateDailyQuestBanner() {
  const banner = document.getElementById("dailyQuestBanner");
  const targetsEl = document.getElementById("dailyQuestTargets");
  const claimBtn = document.getElementById("dailyQuestClaimBtn");

  if (!banner || !gameState.dailyQuest) {
    if (banner) banner.style.display = "none";
    return;
  }

  const quest = gameState.dailyQuest;

  // Check if already claimed
  if (quest.rewardClaimed) {
    banner.style.display = "none";
    return;
  }

  banner.style.display = "block";

  // Build target list
  let html = "";
  quest.targets.forEach((target, i) => {
    const done = quest.progress[i] >= target.count;
    html += `<div class="quest-item">
      <span class="quest-check">${done ? "✅" : "⬜"}</span>
      <span>${target.count} ${target.name} ${done ? "✓" : `(${quest.progress[i]}/${target.count})`}</span>
    </div>`;
  });
  targetsEl.innerHTML = html;

  // Show claim button if completed
  if (quest.completed && !quest.rewardClaimed) {
    claimBtn.style.display = "inline-block";
  } else {
    claimBtn.style.display = "none";
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
  gameState.xp += DAILY_QUEST_CONFIG.rewardXP;

  saveGame();
  updateDailyQuestBanner();
  updateStatusBar();

  showNotification(`🎁 Claimed! +${DAILY_QUEST_CONFIG.rewardXP} XP + ⭐ Star`);
}

// ===== FEEDBACK =====
function showCorrectFeedback() {
  const feedback = document.getElementById("feedback");
  feedback.className = "feedback correct";
  const messages = [
    "✅ Correct! +10 XP",
    "🎉 Great job!",
    "👍 Awesome!",
    "⭐ Perfect!",
    "💪 Keep it up!",
  ];
  feedback.textContent = messages[Math.floor(Math.random() * messages.length)];
}

function showWrongFeedback() {
  const feedback = document.getElementById("feedback");
  const messages = ["❌ Not quite.", "🤔 Almost!", "💪 You can do it!"];
  feedback.textContent = messages[Math.floor(Math.random() * messages.length)];
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

  // Stats summary
  const statsCard = document.createElement("div");
  statsCard.className = "stats-card";
  statsCard.innerHTML = `
        <h3>📊 Your Progress</h3>
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">${gameState.xp}</div>
                <div class="stat-label">Total XP</div>
            </div>
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
        <div class="stats-grid" style="margin-top: 10px; grid-template-columns: 1fr 1fr;">
            <div class="stat-item">
                <div class="stat-value">${gameState.chain > 0 ? `🔥 ${gameState.chain}` : "—"}</div>
                <div class="stat-label">Current Chain</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">🔥 ${gameState.bestChain}</div>
                <div class="stat-label">Best Chain</div>
            </div>
        </div>
    `;
  dashboardContent.appendChild(statsCard);

  // World progress
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

  // Daily Quest Status
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
      questHtml += `<button class="debug-btn" style="margin-top:10px;" onclick="claimDailyQuestReward()">🎁 Claim Reward (⭐ + ${DAILY_QUEST_CONFIG.rewardXP} XP)</button>`;
    }
    questCard.innerHTML = questHtml;
    dashboardContent.appendChild(questCard);
  }

  // Tips & Debug
  const tipsCard = document.createElement("div");
  tipsCard.className = "stats-card";
  tipsCard.innerHTML = `
        <h3>👨‍👩‍👧 Parent Tips</h3>
        <ul class="tips-list">
            <li>📅 Encourage 10-15 minutes of daily practice</li>
            <li>🎯 Celebrate small wins and progress</li>
            <li>🔓 New worlds unlock at: 100, 200, 400, 600, 800, 1000 XP</li>
            <li>💡 Wrong answers = learning opportunities</li>
            <li>🌟 Stars are earned every 10 correct answers</li>
            <li>🔥 Build chains of 3, 5, or 10 for bonus XP!</li>
            <li>🔍 Support boards fade as you master each world</li>
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
    // Enable debug mode when opening panel
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
function debugAddXP(amount) {
  gameState.xp += amount;
  gameState.debugMode = true;
  checkUnlocks();
  saveGame();
  updateStatusBar();
  showNotification(`⭐ +${amount} XP added`);
  updateDebugLabel();
}

function debugRemoveXP(amount) {
  gameState.xp = Math.max(0, gameState.xp - amount);
  gameState.debugMode = true;
  saveGame();
  updateStatusBar();
  showNotification(`⭐ ${amount} XP removed`);
  updateDebugLabel();
}

function debugSetXP(amount) {
  gameState.xp = amount;
  gameState.debugMode = true;
  checkUnlocks();
  saveGame();
  updateStatusBar();
  showNotification(`⭐ XP set to ${amount}`);
  updateDebugLabel();
}

function debugSupportForce(forceOn) {
  gameState.debugSettings.supportBoardOverride = forceOn;
  gameState.debugMode = true;
  saveGame();
  showNotification(`📋 Support Board ${forceOn ? "Forced ON" : "Forced OFF"}`);
  updateDebugLabel();
  // Re-render support board if on game screen
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
  gameState.xp = 0;
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

function debugChainToggle(enabled) {
  gameState.debugSettings.chainEnabled = enabled;
  if (!enabled) {
    gameState.chain = 0;
    gameState.chainXpBonus = 0;
    updateChainDisplay();
  }
  gameState.debugMode = true;
  saveGame();
  showNotification(`🔥 Chain ${enabled ? "Enabled" : "Disabled"}`);
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

// ===== NOTIFICATION SYSTEM =====
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

// ===== STATUS BAR =====
function updateStatusBar() {
  document.getElementById("xpDisplay").textContent = `⭐ ${gameState.xp} XP`;
  const bar = document.getElementById("xpBarFill");
  if (bar) {
    bar.style.width = `${Math.min(gameState.xp / 20, 100)}%`;
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
  // Escape closes vocabulary popup
  if (e.key === "Escape") {
    closeVocabPopup();
  }
});

// Close vocab popup when clicking outside
document.addEventListener("click", function (e) {
  const popup = document.getElementById("vocabPopup");
  if (
    popup &&
    !popup.querySelector(".vocab-popup-content").contains(e.target)
  ) {
    closeVocabPopup();
  }
});

// ===== INITIALIZATION =====
function initGame() {
  loadGame();
  checkUnlocks();
  initDailyQuest();
  showScreen("start");
}

// Start game when page loads
document.addEventListener("DOMContentLoaded", initGame);
