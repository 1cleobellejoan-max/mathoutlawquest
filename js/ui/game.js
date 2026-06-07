// ===== QUESTION GENERATION =====
function generateQuestion() {
  var worldId = gameState.selectedWorld;
  var world = WORLDS[worldId];
  if (!world) return null;
  var difficulty = gameState.selectedDifficulty[worldId] || "easy";
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
  var world = WORLDS[gameState.selectedWorld];
  if (world && world.hasTimer === false) {
    var timerContainer = document.getElementById("timerContainer");
    if (timerContainer) timerContainer.style.display = "none";
    return;
  }
  if (!gameState.debugSettings.timerEnabled) {
    var timerContainer2 = document.getElementById("timerContainer");
    if (timerContainer2) timerContainer2.style.display = "none";
    return;
  }
  var timerContainer3 = document.getElementById("timerContainer");
  if (timerContainer3) timerContainer3.style.display = "flex";
  stopTimer();
  var timerDuration = DIFFICULTY_TIMERS[difficulty] || 30;
  gameState.timeRemaining = timerDuration;
  gameState.isTimedOut = false;
  var timerEl = document.getElementById("timerDisplay");
  var timerFill = document.getElementById("timerFill");
  if (timerEl) timerEl.textContent = formatTime(gameState.timeRemaining);
  if (timerFill) timerFill.style.width = "100%";
  gameState.timerInterval = setInterval(function () {
    gameState.timeRemaining--;
    if (timerEl) timerEl.textContent = formatTime(gameState.timeRemaining);
    var pct = (gameState.timeRemaining / timerDuration) * 100;
    if (timerFill) timerFill.style.width = pct + "%";
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

function handleTimeout() {
  stopTimer();
  gameState.isTimedOut = true;
  var feedback = document.getElementById("feedback");
  feedback.className = "feedback wrong";
  feedback.textContent = "\u23F0 Time's Up!";
  var answerInput = document.getElementById("answerInput");
  var submitBtn = document.getElementById("submitBtn");
  if (answerInput) answerInput.disabled = true;
  if (submitBtn) submitBtn.disabled = true;
  var retryContainer = document.getElementById("retryContainer");
  if (retryContainer) {
    gameState.retryActive = true;
    gameState.retryQuestion = gameState.currentQuestion;
    retryContainer.innerHTML =
      '<button class="retry-btn" onclick="retryQuestion()">\uD83D\uDD04 Try Again</button><button class="skip-btn" onclick="skipQuestion()">\u23ED Skip</button>';
    retryContainer.className = "retry-container visible";
  }
}

function retryQuestion() {
  var retryContainer = document.getElementById("retryContainer");
  if (retryContainer) retryContainer.className = "retry-container";
  gameState.retryActive = false;
  startNewQuestion(true);
}

function skipQuestion() {
  var retryContainer = document.getElementById("retryContainer");
  if (retryContainer) retryContainer.className = "retry-container";
  gameState.retryActive = false;
  startNewQuestion();
}

// ===== GAME SCREEN =====
function startNewQuestion(isRetry) {
  var question = isRetry ? gameState.retryQuestion : generateQuestion();
  if (!question) return;
  var world = WORLDS[question.world];
  var questionContainer = document.getElementById("questionContainer");
  var answerInput = document.getElementById("answerInput");
  var feedback = document.getElementById("feedback");
  var hintBox = document.getElementById("hintBox");
  var submitBtn = document.getElementById("submitBtn");
  var retryContainer = document.getElementById("retryContainer");
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
  var html =
    '<div class="question-header" style="color:' +
    world.color +
    '">' +
    world.emoji +
    " " +
    world.name +
    " \u2022 " +
    capitalize(question.difficulty) +
    "</div>";
  if (question.world === "mathReadingTrail" && question.storyText) {
    html += '<div class="story-text">' + question.storyText + "</div>";
    html += '<div class="question-text">' + question.question + "</div>";
  } else if (question.question.trim().startsWith("<svg")) {
    html += '<div class="question-text">' + question.question + "</div>";
  } else {
    html +=
      '<div class="question-text">' +
      question.question.replace(/\n/g, "<br>") +
      "</div>";
  }
  questionContainer.innerHTML = html;
  if (gameState.debugSettings.vocabHighlightsEnabled !== false) {
    document.querySelectorAll(".vocab-word").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        var vocabKey = this.dataset.vocab;
        var worldData = WORLDS.mathReadingTrail;
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
  if (
    typeof question.answer === "string" &&
    question.answer.indexOf("/") !== -1
  ) {
    var parts = question.answer.split("/");
    answerInput.placeholder =
      "Type answer (e.g., " + parts[0] + "/" + parts[1] + ")";
  } else {
    answerInput.placeholder = "Type your answer...";
  }
  renderSupportBoard(question.world);
  var worldHasReadAloud =
    question.world === "mathReadingTrail" &&
    gameState.debugSettings.readAloudEnabled !== false;
  var readAloudContainer = document.getElementById("readAloudContainer");
  if (readAloudContainer) {
    if (worldHasReadAloud) {
      readAloudContainer.className = "read-aloud-container visible";
      readAloudContainer.innerHTML =
        '<span style="color:white; font-size:0.85rem; opacity:0.8;">\uD83D\uDCD6 Read the story aloud naturally</span>';
    } else {
      readAloudContainer.className = "read-aloud-container";
      readAloudContainer.innerHTML = "";
    }
  }
  var difficulty =
    gameState.selectedDifficulty[question.world] ||
    question.difficulty ||
    "easy";
  startTimer(difficulty);
  setDrawingLayerEnabled(gameState.debugSettings.writingLayerEnabled !== false);
}

function submitAnswer() {
  var answerInput = document.getElementById("answerInput");
  if (!answerInput) return;
  var playerAnswer = answerInput.value.trim();
  if (!playerAnswer) return;
  var isCorrect = checkAnswer(playerAnswer);
  if (!isCorrect) {
    var feedback = document.getElementById("feedback");
    if (feedback) feedback.className = "feedback wrong";
  }
}

// ===== ANSWER CHECKING =====
function checkAnswer(playerAnswer) {
  if (!gameState.currentQuestion) return false;
  var correct = gameState.currentQuestion.answer;
  var isCorrect = false;
  if (typeof correct === "string") {
    isCorrect = playerAnswer.trim().toLowerCase() === correct.toLowerCase();
  } else {
    var playerNum = parseFloat(playerAnswer);
    if (!isNaN(playerNum)) {
      isCorrect = Math.abs(playerNum - correct) <= 0.01;
    }
  }
  if (isCorrect) {
    stopTimer();
    var retryContainer = document.getElementById("retryContainer");
    if (retryContainer) retryContainer.className = "retry-container";
    gameState.totalCorrect++;
    gameState.totalQuestions++;
    gameState.questionCount++;
    var worldId = gameState.currentQuestion.world;
    if (gameState.worldProgress[worldId]) {
      gameState.worldProgress[worldId].correct++;
      gameState.worldProgress[worldId].total++;
    }
    updateDailyQuestProgress(worldId);
    if (gameState.totalCorrect % 10 === 0) {
      gameState.stars++;
      showNotification("\u2B50 You earned a star! \u2B50");
      notificationManager.add({
        type: "achievement",
        title: "\u2B50 Star Earned",
        message: "You earned your " + gameState.stars + "th star!",
        priority: "high",
        autoToast: false,
      });
    }
    saveGame();
    var feedback = document.getElementById("feedback");
    feedback.className = "feedback correct";
    feedback.textContent = "\u2705 Correct!";
    var answerInput = document.getElementById("answerInput");
    var submitBtn = document.getElementById("submitBtn");
    if (answerInput) answerInput.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    playCorrectSound();
    setTimeout(function () {
      startNewQuestion();
    }, 1500);
  } else {
    gameState.wrongAttempts++;
    gameState.totalQuestions++;
    var worldId2 = gameState.currentQuestion.world;
    if (gameState.worldProgress[worldId2]) {
      gameState.worldProgress[worldId2].total++;
    }
    if (gameState.wrongAttempts >= 2) {
      showHint(gameState.currentQuestion);
    }
    var feedback2 = document.getElementById("feedback");
    feedback2.textContent =
      gameState.wrongAttempts === 1
        ? "\u274C Not quite. Try again!"
        : "\u274C Try again!";
    var answerInput2 = document.getElementById("answerInput");
    if (answerInput2) {
      answerInput2.value = "";
      answerInput2.focus();
    }
    playWrongSound();
    if (gameState.wrongAttempts >= 2) {
      var hintBox = document.getElementById("hintBox");
      if (hintBox) hintBox.className = "hint-box visible";
    }
  }
  return isCorrect;
}

// ===== HELP / HINTS =====
function showHelp() {
  if (!gameState.currentQuestion) return;
  var question = gameState.currentQuestion;
  var world = WORLDS[question.world];
  var hintText = question.hint || null;
  if (!hintText && world && world.getHint) {
    hintText = world.getHint(question.question || question);
  }
  if (!hintText) {
    hintText =
      "Try breaking the problem into smaller steps. Read carefully and think about what operation to use.";
  }
  var hintBox = document.getElementById("hintBox");
  if (hintBox) {
    var hint =
      question.hint ||
      (world && world.getHint
        ? world.getHint(question.question || question)
        : hintText);
    hintBox.innerHTML =
      "\uD83D\uDCA1 <strong>Hint:</strong><br>" + hint.replace(/\n/g, "<br>");
    hintBox.className = "hint-box visible";
    gameState.hintsUsed++;
  }
  var feedback = document.getElementById("feedback");
  if (feedback && !feedback.textContent) {
    feedback.textContent = "\uD83D\uDCA1 Try using the hint above!";
    feedback.className = "feedback";
  }
}

function showHint(question) {
  var hintBox = document.getElementById("hintBox");
  var world = WORLDS[question.world];
  if (world && world.getHint) {
    var hint = question.hint || world.getHint(question.question);
    hintBox.innerHTML =
      "\uD83D\uDCA1 <strong>Hint:</strong><br>" + hint.replace(/\n/g, "<br>");
    hintBox.className = "hint-box visible";
    gameState.hintsUsed++;
  }
}

// ===== SUPPORT BOARD =====
function renderSupportBoard(worldId) {
  var supportContainer = document.getElementById("supportBoardContainer");
  if (!supportContainer) return;
  var world = WORLDS[worldId];
  if (!world || !world.supportBoard) {
    supportContainer.className = "support-board-container";
    supportContainer.innerHTML = "";
    return;
  }
  var visibility;
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
  var boardData = SUPPORT_BOARDS[world.supportBoard];
  if (!boardData) {
    supportContainer.className = "support-board-container";
    supportContainer.innerHTML = "";
    return;
  }
  var supportLevel = getSupportLevel(worldId);
  supportContainer.className = "support-board-container visible";
  supportContainer.style.opacity = visibility;
  supportContainer.innerHTML =
    '<details class="support-details">' +
    '<summary class="support-summary">' +
    boardData.title +
    ' <span class="support-level">(' +
    supportLevel +
    ')</span><span class="support-toggle">\u25BC</span></summary>' +
    '<div class="support-content">' +
    boardData.content +
    "</div></details>";
  var details = supportContainer.querySelector(".support-details");
  if (details) {
    details.addEventListener("toggle", function () {
      var toggle = this.querySelector(".support-toggle");
      if (toggle) toggle.textContent = this.open ? "\u25B2" : "\u25BC";
    });
  }
}

function getSupportLevel(worldId) {
  var progress = gameState.worldProgress[worldId];
  if (!progress) return "Beginner";
  var correct = progress.correct || 0;
  if (correct < 10) return "Beginner";
  if (correct < 30) return "Intermediate";
  if (correct < 60) return "Skilled";
  if (correct < 100) return "Advanced";
  return "Master";
}
