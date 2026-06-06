// Math Outlaw Quest - Game Engine

// ===== GAME STATE =====
let gameState = {
  currentScreen: "start",
  selectedWorld: null,
  selectedDifficulty: "easy",
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
  },
  stars: 0,
  badges: [],
  factIndex: 0,
  questionCount: 0,
  wrongAttempts: 0,
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
      // Merge with defaults to handle new fields
      gameState = { ...gameState, ...parsed };
      // Ensure nested objects exist
      for (const world of Object.keys(WORLDS)) {
        if (!gameState.worldProgress[world]) {
          gameState.worldProgress[world] = { correct: 0, total: 0 };
        }
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

  let difficulty = gameState.selectedDifficulty;

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

// ===== ANSWER CHECKING =====
function checkAnswer(playerAnswer) {
  if (!gameState.currentQuestion) return false;

  const correct = gameState.currentQuestion.answer;
  let isCorrect = false;

  // String comparison for things like time "3:00" or fractions "3/4"
  if (typeof correct === "string") {
    isCorrect = playerAnswer.trim().toLowerCase() === correct.toLowerCase();
  } else {
    // Numeric comparison with tolerance for decimals
    const playerNum = parseFloat(playerAnswer);
    if (!isNaN(playerNum)) {
      const tolerance = 0.01;
      isCorrect = Math.abs(playerNum - correct) <= tolerance;
    }
  }

  gameState.totalQuestions++;
  const worldId = gameState.currentQuestion.world;
  if (gameState.worldProgress[worldId]) {
    gameState.worldProgress[worldId].total++;
  }

  if (isCorrect) {
    gameState.xp += 10;
    gameState.totalCorrect++;
    gameState.questionCount++;
    if (gameState.worldProgress[worldId]) {
      gameState.worldProgress[worldId].correct++;
    }
    // Star every 10 correct answers
    if (gameState.totalCorrect % 10 === 0) {
      gameState.stars++;
      showNotification("⭐ You earned a star! ⭐");
    }
    checkUnlocks();
    saveGame();
    showCorrectFeedback();
  } else {
    gameState.wrongAttempts++;
    if (gameState.wrongAttempts >= 2) {
      showHint(gameState.currentQuestion);
    }
    showWrongFeedback();
  }

  return isCorrect;
}

// ===== SCREEN NAVIGATION =====
function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll(".screen").forEach((s) => {
    s.classList.remove("active");
  });
  // Show target screen
  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.add("active");
  }
  gameState.currentScreen = screenId;

  // Update specific screens
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
}

// ===== MAP RENDERING =====
function renderMap() {
  const mapContainer = document.getElementById("mapContainer");
  mapContainer.innerHTML = "";

  const worldKeys = Object.keys(WORLDS);

  // XP counter at top
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
                    <button class="diff-btn ${gameState.selectedDifficulty === "easy" ? "active" : ""}" onclick="selectDifficulty('easy', '${worldId}')">Easy</button>
                    <button class="diff-btn ${gameState.selectedDifficulty === "medium" ? "active" : ""}" onclick="selectDifficulty('medium', '${worldId}')">Medium</button>
                    <button class="diff-btn ${gameState.selectedDifficulty === "hard" ? "active" : ""}" onclick="selectDifficulty('hard', '${worldId}')">Hard</button>
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

function selectDifficulty(diff, worldId) {
  gameState.selectedDifficulty = diff;
  gameState.selectedWorld = worldId;
  renderMap();
}

function playWorld(worldId) {
  gameState.selectedWorld = worldId;
  gameState.questionCount = 0;
  showScreen("game");
}

// ===== GAME SCREEN =====
function startNewQuestion() {
  const question = generateQuestion();
  if (!question) return;

  const world = WORLDS[question.world];
  const questionContainer = document.getElementById("questionContainer");
  const answerInput = document.getElementById("answerInput");
  const feedback = document.getElementById("feedback");
  const hintBox = document.getElementById("hintBox");
  const submitBtn = document.getElementById("submitBtn");

  feedback.className = "feedback";
  feedback.textContent = "";
  hintBox.className = "hint-box";
  hintBox.textContent = "";
  answerInput.value = "";
  answerInput.disabled = false;
  submitBtn.disabled = false;
  answerInput.focus();

  // Show world context
  let html = `
        <div class="question-header" style="color: ${world.color}">
            ${world.emoji} ${world.name} • ${capitalize(question.difficulty)}
        </div>
        <div class="question-text">${question.question.replace(/\n/g, "<br>")}</div>
    `;
  questionContainer.innerHTML = html;

  // Handle fraction answers - accept multiple formats
  if (typeof question.answer === "string" && question.answer.includes("/")) {
    const [num, den] = question.answer.split("/");
    answerInput.placeholder = `Type answer (e.g., ${num}/${den})`;
  } else if (typeof question.answer === "number") {
    answerInput.placeholder = "Type your answer...";
  } else {
    answerInput.placeholder = "Type your answer...";
  }
}

function submitAnswer() {
  const answerInput = document.getElementById("answerInput");
  const feedback = document.getElementById("feedback");
  const hintBox = document.getElementById("hintBox");
  const submitBtn = document.getElementById("submitBtn");

  const playerAnswer = answerInput.value.trim();
  if (!playerAnswer) return;

  const isCorrect = checkAnswer(playerAnswer);

  if (isCorrect) {
    feedback.className = "feedback correct";
    feedback.textContent = "✅ Correct! +10 XP";
    answerInput.disabled = true;
    submitBtn.disabled = true;

    playCorrectSound();

    // Auto-advance after delay
    setTimeout(() => {
      startNewQuestion();
    }, 1500);
  } else {
    feedback.className = "feedback wrong";
    feedback.textContent =
      gameState.wrongAttempts === 1
        ? "❌ Not quite. Try again!"
        : "❌ Try again!";
    answerInput.value = "";
    answerInput.focus();

    playWrongSound();

    // Show hint after 2 wrong attempts
    if (gameState.wrongAttempts >= 2) {
      hintBox.className = "hint-box visible";
    }
  }
}

function showHint(question) {
  const hintBox = document.getElementById("hintBox");
  const world = WORLDS[question.world];
  if (world && world.getHint) {
    const hint = world.getHint(question.question);
    hintBox.innerHTML = `💡 <strong>Hint:</strong><br>${hint.replace(/\n/g, "<br>")}`;
    hintBox.className = "hint-box visible";
    gameState.hintsUsed++;
  }
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

// ===== SOUND EFFECTS (simple beeps) =====
function playCorrectSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(523, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2); // G5
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    /* audio not supported */
  }
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
  } catch (e) {
    /* audio not supported */
  }
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
                <div class="stat-value">${gameState.unlockedWorlds.length}/8</div>
                <div class="stat-label">Worlds</div>
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

  // Parent tips section
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
        </ul>
        <button class="danger-btn" onclick="resetGame()">🗑️ Reset All Progress</button>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid #eee;">
        <div style="display: flex; gap: 10px;">
            <button class="debug-btn" onclick="debugUnlockAll()">🔓 Unlock All Worlds</button>
            <button class="debug-btn" onclick="debugLockAll()">🔒 Lock All Worlds</button>
        </div>
        <div style="font-size: 0.75rem; color: #999; margin-top: 8px; text-align: center;">Debug Tools — for testing only</div>
    `;
  dashboardContent.appendChild(tipsCard);
}

// ===== DEBUG FUNCTIONS =====
function debugUnlockAll() {
  const allWorldIds = Object.keys(WORLDS);
  gameState.unlockedWorlds = allWorldIds;
  saveGame();
  showNotification("🔓 All worlds unlocked!");
  renderDashboard();
}

function debugLockAll() {
  gameState.unlockedWorlds = ["numberRanch", "subtractionCanyon"];
  gameState.xp = 0;
  saveGame();
  showNotification(
    "🔒 Worlds locked to default (Number Ranch, Subtraction Canyon)",
  );
  renderDashboard();
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
    if (!submitBtn.disabled) {
      submitAnswer();
    }
  }
});

// ===== INITIALIZATION =====
function initGame() {
  loadGame();
  checkUnlocks();
  showScreen("start");
}

// Start game when page loads
document.addEventListener("DOMContentLoaded", initGame);
