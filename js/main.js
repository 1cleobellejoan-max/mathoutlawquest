// Math Outlaw Quest - Game Engine (Version 2)

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
  stopTimer();
  const worldId = gameState.selectedWorld;
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

    if (gameState.totalCorrect % 10 === 0) {
      gameState.stars++;
      showNotification("⭐ You earned a star! ⭐");
    }

    checkUnlocks();
    saveGame();

    const feedback = document.getElementById("feedback");
    feedback.className = "feedback correct";
    let bonusText = "";
    if (timeBonus > 0) bonusText += ` ⚡+${timeBonus}`;
    if (chainBonus > 0) bonusText += ` 🔗+${chainBonus}`;
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
                    <button class="diff-btn ${gameState.selectedDifficulty[worldId] === "easy" ? "active" : ""}" onclick="selectDifficulty('easy', '${worldId}')">Easy</button>
                    <button class="diff-btn ${gameState.selectedDifficulty[worldId] === "medium" ? "active" : ""}" onclick="selectDifficulty('medium', '${worldId}')">Medium</button>
                    <button class="diff-btn ${gameState.selectedDifficulty[worldId] === "hard" ? "active" : ""}" onclick="selectDifficulty('hard', '${worldId}')">Hard</button>
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
  showScreen("game");
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

  // Attach vocabulary click handlers
  document.querySelectorAll(".vocab-word").forEach((el) => {
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      const vocabKey = this.dataset.vocab;
      const worldData = WORLDS.mathReadingTrail;
      if (worldData && worldData.vocabulary && worldData.vocabulary[vocabKey]) {
        showVocabPopup(vocabKey, worldData.vocabulary[vocabKey]);
      }
    });
  });

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

  // Show read-aloud button for reading trail
  if (question.world === "mathReadingTrail") {
    const readAloudContainer = document.getElementById("readAloudContainer");
    if (readAloudContainer) {
      readAloudContainer.className = "read-aloud-container visible";
    }
  } else {
    const readAloudContainer = document.getElementById("readAloudContainer");
    if (readAloudContainer) {
      readAloudContainer.className = "read-aloud-container";
    }
  }

  // Start timer
  const difficulty =
    question.difficulty ||
    gameState.selectedDifficulty[question.world] ||
    "easy";
  startTimer(difficulty);

  // Update chain display
  updateChainDisplay();

  // Update handwriting toggle
  updateHandwritingToggle();
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

  const visibility = getSupportVisibility(worldId);
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

// ===== READ-ALOUD MODE =====
let mediaRecorder = null;
let audioChunks = [];
let audioBlob = null;
let audioUrl = null;
let isRecording = false;

function toggleRecording() {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

function startRecording() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showNotification("🎤 Recording not supported on this device");
    return;
  }

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        audioUrl = URL.createObjectURL(audioBlob);
        const playbackBtn = document.getElementById("playbackBtn");
        if (playbackBtn) {
          playbackBtn.style.display = "inline-block";
        }
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      isRecording = true;

      const recordBtn = document.getElementById("recordBtn");
      if (recordBtn) {
        recordBtn.textContent = "🔴 Recording...";
        recordBtn.classList.add("recording");
      }

      showNotification("🎤 Recording started...");
    })
    .catch((err) => {
      showNotification("🎤 Microphone access denied");
      console.log("Mic error:", err);
    });
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    isRecording = false;

    const recordBtn = document.getElementById("recordBtn");
    if (recordBtn) {
      recordBtn.textContent = "🎤 Record";
      recordBtn.classList.remove("recording");
    }

    showNotification("✅ Recording saved!");
  }
}

function playRecording() {
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
  }
}

function deleteRecording() {
  if (audioUrl) {
    URL.revokeObjectURL(audioUrl);
    audioUrl = null;
    audioBlob = null;
  }
  const playbackBtn = document.getElementById("playbackBtn");
  if (playbackBtn) {
    playbackBtn.style.display = "none";
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

// ===== HANDWRITING TOGGLE =====
function toggleHandwriting() {
  const canvas = document.getElementById("handwritingCanvas");
  const canvasControls = document.getElementById("handwritingControls");
  const answerInput = document.getElementById("answerInput");

  if (!canvas || !canvasControls) return;

  const isVisible = canvas.style.display !== "none";
  if (isVisible) {
    canvas.style.display = "none";
    canvasControls.style.display = "none";
    answerInput.style.display = "block";
  } else {
    canvas.style.display = "block";
    canvasControls.style.display = "flex";
    answerInput.style.display = "none";
  }
}

function updateHandwritingToggle() {
  const canvas = document.getElementById("handwritingCanvas");
  if (canvas) {
    // Leave canvas hidden by default on new questions
  }
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
  showScreen("start");
}

// Start game when page loads
document.addEventListener("DOMContentLoaded", initGame);
