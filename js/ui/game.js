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

// ===== LESSON SESSION TRACKING =====
function startLesson() {
  gameState.lessonStartTime = Date.now();
  gameState.lessonEndTime = null;
  gameState.sessionCorrect = 0;
  gameState.sessionIncorrect = 0;
  gameState.currentChain = 0;
  gameState.bestChain = 0;
  gameState.sessionXpGained = 0;
  gameState.sessionRewardPoints = 0;
  gameState.questionCount = 0;
  gameState.lessonSession = null;
}

function completeLesson() {
  // Safety: ensure study tracking objects exist (migration defense)
  if (!gameState.lessonHistory) gameState.lessonHistory = [];
  if (!gameState.studyStats) {
    gameState.studyStats = {
      totalStudyTimeMs: 0,
      lessonsCompleted: 0,
      longestSessionMs: 0,
    };
  }

  gameState.lessonEndTime = Date.now();
  var duration = gameState.lessonEndTime - gameState.lessonStartTime;
  var correct = gameState.sessionCorrect;
  var incorrect = gameState.sessionIncorrect;
  var bestChain = gameState.bestChain;
  var total = correct + incorrect;

  addXp(XP_PER_LESSON_COMPLETE);
  gameState.sessionXpGained += XP_PER_LESSON_COMPLETE;

  var starsGained = calculateLessonStars(correct, total);
  if (starsGained > 0) {
    gameState.stars += starsGained;
    showNotification("\u2B50 You earned " + starsGained + " lesson stars!");
  }
  // Reward points for lesson completion
  rewardOnLessonComplete(starsGained);
  // Track lesson completion and star RP in session (safety init if undefined)
  if (!gameState.sessionRewardPoints) gameState.sessionRewardPoints = 0;
  gameState.sessionRewardPoints += RP_PER_LESSON;
  if (starsGained > 0) {
    gameState.sessionRewardPoints += starsGained * RP_PER_STAR;
  }

  // Calculate reward points earned this session
  var rpEarned = gameState.sessionRewardPoints;

  // Format times for display
  var startDate = new Date(gameState.lessonStartTime);
  var endDate = new Date(gameState.lessonEndTime);
  var startTimeStr = formatTimeShort(startDate);
  var endTimeStr = formatTimeShort(endDate);

  // Build persistent lesson record
  var worldObj = WORLDS[gameState.selectedWorld];
  var worldName = worldObj ? worldObj.name : "Unknown";
  var difficulty =
    gameState.selectedDifficulty[gameState.selectedWorld] || "easy";
  var lessonRecord = {
    date: formatDate(endDate),
    worldId: gameState.selectedWorld,
    worldName: worldName,
    difficulty: difficulty,
    correct: correct,
    total: total,
    xpGained: gameState.sessionXpGained,
    rewardPoints: rpEarned,
    starsGained: starsGained,
    bestChain: bestChain,
    durationMs: duration,
    startTime: startTimeStr,
    endTime: endTimeStr,
  };

  // Update study stats
  if (!gameState.studyStats) {
    gameState.studyStats = {
      totalStudyTimeMs: 0,
      lessonsCompleted: 0,
      longestSessionMs: 0,
    };
  }
  gameState.studyStats.totalStudyTimeMs += duration;
  gameState.studyStats.lessonsCompleted++;
  if (duration > gameState.studyStats.longestSessionMs) {
    gameState.studyStats.longestSessionMs = duration;
  }

  // Save to history (keep last 500)
  if (!gameState.lessonHistory) gameState.lessonHistory = [];
  gameState.lessonHistory.push(lessonRecord);
  if (gameState.lessonHistory.length > 500) {
    gameState.lessonHistory.splice(0, gameState.lessonHistory.length - 500);
  }

  updateUnlockedWorlds();
  saveGame();

  gameState.lessonSession = {
    correct: correct,
    incorrect: incorrect,
    total: total,
    xpGained: gameState.sessionXpGained,
    rewardPoints: rpEarned,
    starsGained: starsGained,
    bestChain: bestChain,
    duration: duration,
    worldId: gameState.selectedWorld,
    startTime: startTimeStr,
    endTime: endTimeStr,
  };

  showLessonSummary();
}

function formatTimeShort(date) {
  var h = date.getHours();
  var m = date.getMinutes();
  var ampm = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return h + ":" + (m < 10 ? "0" + m : m) + " " + ampm;
}

function formatDate(date) {
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
  );
}

// ===== LESSON SUMMARY SCREEN =====
function showLessonSummary() {
  var session = gameState.lessonSession;
  if (!session) return;

  var world = WORLDS[session.worldId];
  var worldName = world ? world.name : "Unknown";
  var worldEmoji = world ? world.emoji : "\uD83D\uDCDA";

  // Format duration
  var totalSec = Math.floor(session.duration / 1000);
  var mins = Math.floor(totalSec / 60);
  var secs = totalSec % 60;
  var timeStr = mins + "m " + secs + "s";
  if (mins === 0) timeStr = secs + "s";

  var accuracy =
    session.total > 0 ? Math.round((session.correct / session.total) * 100) : 0;

  var starsDisplay = "";
  if (session.starsGained > 0) {
    for (var si = 0; si < session.starsGained; si++) starsDisplay += "\u2B50";
  } else {
    starsDisplay = "None";
  }

  var summaryHtml =
    '<div class="lesson-summary-overlay">' +
    '<div class="lesson-summary-card">' +
    '<div class="lesson-summary-header">' +
    worldEmoji +
    " " +
    worldName +
    '<div class="lesson-summary-subtitle">\u2B50 Lesson Complete!</div>' +
    "</div>" +
    '<div class="lesson-summary-stats">' +
    // Questions correct/total
    '<div class="ls-stat-row">' +
    '<span class="ls-stat-label">\u2705 Questions Correct</span>' +
    '<span class="ls-stat-value ls-correct">' +
    session.correct +
    "/" +
    session.total +
    "</span>" +
    "</div>" +
    // XP Earned
    '<div class="ls-stat-row">' +
    '<span class="ls-stat-label">\u26A1 XP Earned</span>' +
    '<span class="ls-stat-value ls-xp">+' +
    session.xpGained +
    "</span>" +
    "</div>" +
    // Reward Points Earned
    '<div class="ls-stat-row">' +
    '<span class="ls-stat-label">\uD83E\uDE99 Reward Points</span>' +
    '<span class="ls-stat-value ls-rp">+' +
    session.rewardPoints +
    "</span>" +
    "</div>" +
    // Stars
    '<div class="ls-stat-row">' +
    '<span class="ls-stat-label">\u2B50 Stars Earned</span>' +
    '<span class="ls-stat-value">' +
    starsDisplay +
    "</span>" +
    "</div>" +
    // Best Chain
    '<div class="ls-stat-row">' +
    '<span class="ls-stat-label">\uD83D\uDD25 Best Chain</span>' +
    '<span class="ls-stat-value">x' +
    session.bestChain +
    "</span>" +
    "</div>" +
    // Separator
    '<div class="ls-stat-divider"></div>' +
    // Start Time
    '<div class="ls-stat-row">' +
    '<span class="ls-stat-label">\uD83D\uDD50 Start Time</span>' +
    '<span class="ls-stat-value">' +
    (session.startTime || "") +
    "</span>" +
    "</div>" +
    // End Time
    '<div class="ls-stat-row">' +
    '<span class="ls-stat-label">\uD83D\uDD50 End Time</span>' +
    '<span class="ls-stat-value">' +
    (session.endTime || "") +
    "</span>" +
    "</div>" +
    // Time Spent
    '<div class="ls-stat-row">' +
    '<span class="ls-stat-label">\u23F1\uFE0F Time Spent</span>' +
    '<span class="ls-stat-value">' +
    timeStr +
    "</span>" +
    "</div>" +
    "</div>" +
    '<div class="lesson-summary-actions">' +
    '<button class="lesson-summary-btn" onclick="closeLessonSummary()">\uD83D\uDDFA\uFE0F Back to Map</button>' +
    '<button class="lesson-summary-btn lesson-summary-btn-secondary" onclick="playAgain()">\uD83D\uDD04 Play Again</button>' +
    "</div>" +
    "</div>" +
    "</div>";

  // Add summary to page
  var existing = document.getElementById("lessonSummaryOverlay");
  if (existing) existing.remove();
  var overlay = document.createElement("div");
  overlay.id = "lessonSummaryOverlay";
  overlay.innerHTML = summaryHtml;
  document.getElementById("app").appendChild(overlay);
}

function closeLessonSummary() {
  var overlay = document.getElementById("lessonSummaryOverlay");
  if (overlay) overlay.remove();
  showScreen("map");
}

function playAgain() {
  var overlay = document.getElementById("lessonSummaryOverlay");
  if (overlay) overlay.remove();
  startLesson();
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
    var verticalHtml = formatMathVertical(question.question);
    if (verticalHtml) {
      html += '<div class="question-text">' + verticalHtml + "</div>";
    } else {
      html +=
        '<div class="question-text">' +
        question.question.replace(/\n/g, "<br>") +
        "</div>";
    }
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
  } else if (
    typeof question.answer === "string" &&
    question.answer.indexOf(":") !== -1
  ) {
    var ratioParts = question.answer.split(":");
    answerInput.placeholder =
      "Type answer (e.g., " + ratioParts[0] + ":" + ratioParts[1] + ")";
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
    // --- CRITICAL PATH: state updates first (cannot fail) ---
    gameState.currentChain++;
    if (gameState.currentChain > gameState.bestChain) {
      gameState.bestChain = gameState.currentChain;
    }
    var xpGained = XP_PER_CORRECT + gameState.currentChain;
    addXp(xpGained);
    gameState.sessionXpGained += xpGained;
    gameState.sessionCorrect++;
    gameState.totalCorrect++;
    gameState.totalQuestions++;
    gameState.questionCount++;
    gameState.sessionRewardPoints =
      (gameState.sessionRewardPoints || 0) + RP_PER_CORRECT;
    var worldId = gameState.currentQuestion.world;
    if (gameState.worldProgress[worldId]) {
      gameState.worldProgress[worldId].correct++;
      gameState.worldProgress[worldId].total++;
    }

    // --- UI updates ---
    renderXpBar();
    var feedback = document.getElementById("feedback");
    if (feedback) {
      feedback.className = "feedback correct";
      feedback.textContent = "\u2705 Correct!";
    }
    var answerInput = document.getElementById("answerInput");
    var submitBtn = document.getElementById("submitBtn");
    if (answerInput) answerInput.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    playCorrectSound();
    var retryContainer = document.getElementById("retryContainer");
    if (retryContainer) retryContainer.className = "retry-container";

    // --- SCHEDULE NEXT QUESTION (before non-critical calls to prevent block) ---
    var nextAction =
      gameState.questionCount >= LESSON_SIZE
        ? function () {
            completeLesson();
          }
        : function () {
            startNewQuestion();
          };
    var nextDelay = setTimeout(nextAction, 1200);

    // --- Non-critical calls (wrap to prevent crashes from blocking the question cycle) ---
    try {
      rewardOnCorrect(gameState.currentChain);
    } catch (e) {
      console.warn("rewardOnCorrect error:", e);
    }
    try {
      updateQuestProgress("questions", 1);
      updateQuestProgress("xp", xpGained);
    } catch (e) {
      console.warn("updateQuestProgress error:", e);
    }
    try {
      updateWeeklyQuestProgress(1);
    } catch (e) {
      console.warn("weeklyQuest error:", e);
    }
    try {
      updateDailyQuestProgress(worldId);
    } catch (e) {
      console.warn("dailyQuest error:", e);
    }
    try {
      saveGame();
    } catch (e) {
      console.warn("saveGame error:", e);
    }
  } else {
    gameState.currentChain = 0;
    gameState.sessionIncorrect++;
    gameState.wrongAttempts++;
    gameState.totalQuestions++;
    var worldId2 = gameState.currentQuestion.world;
    if (gameState.worldProgress[worldId2]) {
      gameState.worldProgress[worldId2].total++;
    }
    var feedback2 = document.getElementById("feedback");
    var answerInput2 = document.getElementById("answerInput");
    var hintBox2 = document.getElementById("hintBox");

    if (gameState.wrongAttempts === 1) {
      // 1st wrong: just encourage retry
      feedback2.textContent =
        "\u274C Not quite. Check your work and try again!";
    } else if (gameState.wrongAttempts === 2) {
      // 2nd wrong: show hint
      feedback2.textContent = "\u274C Try again! Use the hint below.";
      showHint(gameState.currentQuestion);
    } else {
      // 3rd+ wrong: show solution button
      feedback2.textContent = "\u274C Need help? View the solution below.";
      // Show solution automatically on 3rd wrong
      showSolution(gameState.currentQuestion);
    }

    if (answerInput2) {
      answerInput2.value = "";
      answerInput2.focus();
    }
    playWrongSound();
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

// ===== SMART SOLUTION SYSTEM =====
// Generates a step-by-step solution for arithmetic problems
function generateSolution(question) {
  var text = question.question || question;
  // Try to parse as addition: "a + b" or "a + b + c"
  var addMatch = text.trim().match(/^(\d+)\s*\+\s*(\d+)(?:\s*\+\s*(\d+))?$/);
  if (addMatch) {
    var a = parseInt(addMatch[1]);
    var b = parseInt(addMatch[2]);
    var sum = a + b;
    if (addMatch[3]) {
      var c = parseInt(addMatch[3]);
      sum = a + b + c;
      return (
        "Step 1: " +
        a +
        " + " +
        b +
        " = " +
        (a + b) +
        "<br>Step 2: " +
        (a + b) +
        " + " +
        c +
        " = " +
        sum +
        "<br><br><strong>Answer:</strong> " +
        sum
      );
    }
    // Check if regrouping is needed
    var aOnes = a % 10;
    var bOnes = b % 10;
    if (aOnes + bOnes >= 10) {
      var aTens = Math.floor(a / 10) * 10;
      var bTens = Math.floor(b / 10) * 10;
      return (
        "Step 1: Add the ones: " +
        aOnes +
        " + " +
        bOnes +
        " = " +
        (aOnes + bOnes) +
        "<br>Step 2: Add the tens: " +
        aTens +
        " + " +
        bTens +
        " = " +
        (aTens + bTens) +
        "<br>Step 3: " +
        aTens +
        " + " +
        bTens +
        " + " +
        (aOnes + bOnes) +
        " = " +
        sum +
        "<br><br><strong>Answer:</strong> " +
        sum
      );
    }
    return (
      "Step 1: " +
      a +
      " + " +
      b +
      "<br>Step 2: Count up from " +
      a +
      " by " +
      b +
      "<br><br><strong>Answer:</strong> " +
      sum
    );
  }

  // Subtraction
  var subMatch = text.trim().match(/^(\d+)\s*[\-\u2212]\s*(\d+)$/);
  if (!subMatch) subMatch = text.trim().match(/^(\d+)\s*-\s*(\d+)$/);
  if (subMatch) {
    var sa = parseInt(subMatch[1]);
    var sb = parseInt(subMatch[2]);
    var diff = sa - sb;
    var aOnesSub = sa % 10;
    var bOnesSub = sb % 10;
    if (bOnesSub > aOnesSub) {
      return (
        "Step 1: " +
        aOnesSub +
        " - " +
        bOnesSub +
        " \u2014 can't do this, borrow from tens<br>" +
        "Step 2: Tens become " +
        (Math.floor(sa / 10) - 1) +
        ", ones become " +
        (aOnesSub + 10) +
        "<br>Step 3: " +
        (Math.floor(sa / 10) - 1) +
        (aOnesSub + 10) +
        " - " +
        sb +
        " = " +
        diff +
        "<br><br><strong>Answer:</strong> " +
        diff
      );
    }
    return (
      "Step 1: Start with " +
      sa +
      "<br>Step 2: Subtract " +
      sb +
      "<br>Step 3: Count backward " +
      sb +
      " steps from " +
      sa +
      "<br><br><strong>Answer:</strong> " +
      diff
    );
  }

  // Multiplication
  var mulMatch = text.trim().match(/^(\d+)\s*\u00D7\s*(\d+)$/);
  if (mulMatch) {
    var ma = parseInt(mulMatch[1]);
    var mb = parseInt(mulMatch[2]);
    var product = ma * mb;
    var adds = [];
    for (var i = 0; i < mb; i++) adds.push(ma);
    return (
      "Step 1: " +
      ma +
      " \u00D7 " +
      mb +
      " means " +
      ma +
      " added " +
      mb +
      " times<br>" +
      "Step 2: " +
      adds.join(" + ") +
      "<br>Step 3: " +
      product +
      "<br><br><strong>Answer:</strong> " +
      product
    );
  }

  // Division
  var divMatch = text.trim().match(/^(\d+)\s*\u00F7\s*(\d+)$/);
  if (divMatch) {
    var da = parseInt(divMatch[1]);
    var db = parseInt(divMatch[2]);
    var quotient = Math.floor(da / db);
    var remainder = da % db;
    if (remainder === 0) {
      return (
        "Step 1: " +
        da +
        " \u00F7 " +
        db +
        "<br>" +
        "Step 2: Think: what number \u00D7 " +
        db +
        " = " +
        da +
        "?<br>" +
        "Step 3: " +
        db +
        " \u00D7 " +
        quotient +
        " = " +
        da +
        "<br><br><strong>Answer:</strong> " +
        quotient
      );
    }
    return (
      "Step 1: " +
      da +
      " \u00F7 " +
      db +
      "<br>" +
      "Step 2: " +
      db +
      " \u00D7 " +
      quotient +
      " = " +
      db * quotient +
      ", remainder " +
      remainder +
      "<br><br><strong>Answer:</strong> " +
      quotient +
      " R " +
      remainder
    );
  }

  // Fallback
  return "Try breaking the problem into smaller steps. Work carefully through each part.";
}

function showSolution(question) {
  var solutionText = generateSolution(question);
  var hintBox = document.getElementById("hintBox");
  if (hintBox) {
    hintBox.innerHTML =
      "\uD83D\uDCD6 <strong>Show Solution:</strong><br>" + solutionText;
    hintBox.className = "hint-box visible";
  }
  var solutionBtn = document.getElementById("solutionBtn");
  if (solutionBtn) {
    solutionBtn.style.display = "none";
  }
}

// ===== VERTICAL MATH FORMAT =====
// Converts inline arithmetic (e.g. "10 + 17") to vertical column HTML
function formatMathVertical(text) {
  // Match patterns like: "123 + 456", "92 - 48", "23 \u00D7 4", "84 \u00F7 7"
  // Also handles "123 + 456 + 789" for multi-addend
  var trimmed = text.trim();

  // Try addition: "a + b" or "a + b + c"
  var addMatch = trimmed.match(/^(\d+)\s*\+\s*(\d+)(?:\s*\+\s*(\d+))?$/);
  if (addMatch) {
    var nums = [addMatch[1], addMatch[2]];
    if (addMatch[3]) nums.push(addMatch[3]);
    var maxLen = 0;
    for (var i = 0; i < nums.length; i++) {
      if (nums[i].length > maxLen) maxLen = nums[i].length;
    }
    var sep = "";
    for (var k = 0; k < maxLen + 2; k++) sep += "\u2500";
    var result = '<div class="math-vertical">';
    result += '<div class="math-line">  ' + padNum(nums[0], maxLen) + "</div>";
    for (var m = 1; m < nums.length; m++) {
      result +=
        '<div class="math-line">+ ' + padNum(nums[m], maxLen) + "</div>";
    }
    result += '<div class="math-answer-line">  ' + sep + "</div></div>";
    return result;
  }

  // Try subtraction: "a - b"
  var subMatch = trimmed.match(/^(\d+)\s*\u2212\s*(\d+)$/);
  if (!subMatch) subMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
  if (subMatch) {
    var a = subMatch[1];
    var b = subMatch[2];
    var maxLenSub = a.length > b.length ? a.length : b.length;
    return (
      '<div class="math-vertical">' +
      '<div class="math-line">  ' +
      padNum(a, maxLenSub) +
      "</div>" +
      '<div class="math-line">\u2212 ' +
      padNum(b, maxLenSub) +
      "</div>" +
      '<div class="math-answer-line">  ' +
      rep("\u2500", maxLenSub + 2) +
      "</div></div>"
    );
  }

  // Try multiplication: "a \u00D7 b"
  var mulMatch = trimmed.match(/^(\d+)\s*\u00D7\s*(\d+)$/);
  if (mulMatch) {
    var m1 = mulMatch[1];
    var m2 = mulMatch[2];
    var maxLenMul = m1.length > m2.length ? m1.length : m2.length;
    return (
      '<div class="math-vertical">' +
      '<div class="math-line">  ' +
      padNum(m1, maxLenMul) +
      "</div>" +
      '<div class="math-line">\u00D7 ' +
      padNum(m2, maxLenMul) +
      "</div>" +
      '<div class="math-answer-line">  ' +
      rep("\u2500", maxLenMul + 2) +
      "</div></div>"
    );
  }

  // Try division: "a \u00F7 b"
  var divMatch = trimmed.match(/^(\d+)\s*\u00F7\s*(\d+)$/);
  if (divMatch) {
    var d1 = divMatch[1];
    var d2 = divMatch[2];
    var maxLenDiv = d1.length > d2.length ? d1.length : d2.length;
    return (
      '<div class="math-vertical">' +
      '<div class="math-line">  ' +
      padNum(d1, maxLenDiv) +
      "</div>" +
      '<div class="math-line">\u00F7 ' +
      padNum(d2, maxLenDiv) +
      "</div>" +
      '<div class="math-answer-line">  ' +
      rep("\u2500", maxLenDiv + 2) +
      "</div></div>"
    );
  }

  // Not a recognized arithmetic pattern
  return null;
}

// Helper: pad a number string with leading spaces to given width
function padNum(str, width) {
  while (str.length < width) str = " " + str;
  return str;
}

// Helper: repeat a string n times
function rep(ch, n) {
  var r = "";
  for (var i = 0; i < n; i++) r += ch;
  return r;
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
