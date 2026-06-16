// ===== NUMBER KINGDOM CONFIG =====
const KINGDOM_STAGES = [
  {
    id: "additionVillage",
    name: "Addition Village",
    emoji: "\u{1F3D8}\uFE0F",
    desc: "Defeat Number Bandits with addition!",
    miniGame: "bandit",
    requiredHits: 5,
    enemyEmoji: "\u{1F9E4}",
    enemyName: "Number Bandit",
    xpReward: 50,
    coinReward: 10,
  },
  {
    id: "subtractionForest",
    name: "Subtraction Forest",
    emoji: "\u{1F333}",
    desc: "Rescue trapped kittens with subtraction!",
    miniGame: "kitten",
    requiredHits: 5,
    enemyEmoji: "\u{1F431}",
    enemyName: "Lost Kitten",
    xpReward: 50,
    coinReward: 10,
  },
  {
    id: "multiplicationMountains",
    name: "Multiplication Mountains",
    emoji: "\u26F0\uFE0F",
    desc: "Unlock treasure chests with multiplication!",
    miniGame: "chest",
    requiredHits: 3,
    enemyEmoji: "\u{1F9F0}",
    enemyName: "Treasure Chest",
    xpReward: 50,
    coinReward: 15,
  },
  {
    id: "divisionDesert",
    name: "Division Desert",
    emoji: "\u{1F3DC}\uFE0F",
    desc: "Repair the bridge with division!",
    miniGame: "bridge",
    requiredHits: 5,
    enemyEmoji: "\u{1F309}",
    enemyName: "Bridge Section",
    xpReward: 50,
    coinReward: 15,
  },
  {
    id: "puzzleCastle",
    name: "Puzzle Castle",
    emoji: "\u{1F3F0}",
    desc: "Solve kingdom mysteries with word problems!",
    miniGame: "investigate",
    requiredHits: 5,
    enemyEmoji: "\u{1F50D}",
    enemyName: "Mystery",
    xpReward: 75,
    coinReward: 20,
  },
  {
    id: "wizardTower",
    name: "Wizard Tower",
    emoji: "\u{1F9D9}\u200D\u2642\uFE0F",
    desc: "Deactivate traps with Order of Operations!",
    miniGame: "trap",
    requiredHits: 5,
    enemyEmoji: "\u26A1",
    enemyName: "Magical Trap",
    xpReward: 75,
    coinReward: 25,
  },
];

// ===== STAGE QUESTION GENERATORS =====
function generateKingdomQuestion(difficulty) {
  var stage = gameState.kingdomStage;
  if (stage === 6) {
    return generateBossQuestion(difficulty);
  }
  switch (stage) {
    case 0:
      return generateAdditionQuestion(difficulty);
    case 1:
      return generateSubtractionQuestion(difficulty);
    case 2:
      return generateMultiplicationQuestion(difficulty);
    case 3:
      return generateDivisionQuestion(difficulty);
    case 4:
      return generateWordProblemQuestion(difficulty);
    case 5:
      return generateOrderOfOpsQuestion(difficulty);
    default:
      return generateAdditionQuestion(difficulty);
  }
}

function generateAdditionQuestion(diff) {
  var a, b, answer;
  switch (diff) {
    case "easy":
      a = rand(10, 99);
      b = rand(1, 9);
      break;
    case "medium":
      a = rand(100, 999);
      b = rand(10, 99);
      break;
    case "hard":
      a = rand(1000, 9999);
      b = rand(100, 999);
      break;
  }
  answer = a + b;
  return {
    question: a + " + " + b,
    answer: answer,
    difficulty: diff,
    world: "numberKingdom",
    stage: 0,
    hint: "Line up the digits by place value. Add from right to left, carrying when needed.",
  };
}

function generateSubtractionQuestion(diff) {
  var a, b, answer;
  switch (diff) {
    case "easy":
      a = rand(20, 99);
      b = rand(1, a - 1);
      break;
    case "medium":
      a = rand(100, 999);
      b = rand(50, a - 1);
      break;
    case "hard":
      a = rand(1000, 9999);
      b = rand(100, a - 1);
      break;
  }
  answer = a - b;
  return {
    question: a + " - " + b,
    answer: answer,
    difficulty: diff,
    world: "numberKingdom",
    stage: 1,
    hint: "Borrow from the next digit if you can\u2019t subtract. Take 1 from the tens, add 10 to the ones.",
  };
}

function generateMultiplicationQuestion(diff) {
  var a, b, answer;
  switch (diff) {
    case "easy":
      a = rand(2, 9);
      b = rand(2, 9);
      break;
    case "medium":
      a = rand(10, 99);
      b = rand(2, 9);
      break;
    case "hard":
      a = rand(10, 99);
      b = rand(10, 99);
      break;
  }
  answer = a * b;
  return {
    question: a + " \u00D7 " + b,
    answer: answer,
    difficulty: diff,
    world: "numberKingdom",
    stage: 2,
    hint: "Break it down: multiply each digit, then add the results together.",
  };
}

function generateDivisionQuestion(diff) {
  var a, b, answer, remainder;
  switch (diff) {
    case "easy":
      answer = rand(1, 9);
      b = rand(2, 9);
      a = answer * b;
      return {
        question: a + " \u00F7 " + b,
        answer: answer,
        difficulty: diff,
        world: "numberKingdom",
        stage: 3,
        hint: "Think: what number \u00D7 " + b + " = " + a + "?",
      };
    case "medium":
      answer = rand(10, 99);
      b = rand(2, 9);
      a = answer * b;
      return {
        question: a + " \u00F7 " + b,
        answer: answer,
        difficulty: diff,
        world: "numberKingdom",
        stage: 3,
        hint: "Divide step by step from left to right.",
      };
    case "hard":
      b = rand(3, 9);
      var quotient = rand(10, 50);
      remainder = rand(1, b - 1);
      a = quotient * b + remainder;
      answer = quotient + " R " + remainder;
      return {
        question: a + " \u00F7 " + b,
        answer: answer,
        difficulty: diff,
        world: "numberKingdom",
        stage: 3,
        hint: "Divide, multiply, subtract, bring down. Repeat until done. The leftover is the remainder.",
      };
  }
}

function generateWordProblemQuestion(diff) {
  var items, questionText, answer;
  switch (diff) {
    case "easy": {
      var packages = rand(2, 6);
      var perPackage = rand(3, 9);
      var givenAway = rand(1, packages * perPackage - 1);
      answer = packages * perPackage - givenAway;
      questionText =
        "A bakery has " +
        packages +
        " boxes of muffins. Each box has " +
        perPackage +
        " muffins. They sell " +
        givenAway +
        " muffins. How many muffins remain?";
      return {
        question: questionText,
        answer: answer,
        difficulty: diff,
        world: "numberKingdom",
        stage: 4,
        hint:
          "First find the total muffins: " +
          packages +
          " \u00D7 " +
          perPackage +
          " = ? Then subtract what was sold.",
      };
    }
    case "medium": {
      var costPer = rand(5, 15);
      var count = rand(3, 8);
      var money = costPer * count + rand(10, 50);
      answer = money - costPer * count;
      questionText =
        "Leo has \u20B1" +
        money +
        ". He buys " +
        count +
        " notebooks at \u20B1" +
        costPer +
        " each. How much money does he have left?";
      return {
        question: questionText,
        answer: answer,
        difficulty: diff,
        world: "numberKingdom",
        stage: 4,
        hint:
          "First find the total cost: " +
          count +
          " \u00D7 " +
          costPer +
          " = ? Then subtract from \u20B1" +
          money +
          ".",
      };
    }
    case "hard": {
      var rate = rand(20, 60);
      var hours = rand(3, 7);
      var total = rate * hours;
      var daily = rand(2, 4);
      var grand = total * daily;
      questionText =
        "A worker earns \u20B1" +
        rate +
        " per hour. He works " +
        hours +
        " hours each day for " +
        daily +
        " days. How much does he earn total?";
      answer = grand;
      return {
        question: questionText,
        answer: answer,
        difficulty: diff,
        world: "numberKingdom",
        stage: 4,
        hint:
          "Find daily pay first: " +
          rate +
          " \u00D7 " +
          hours +
          " = ? Then multiply by " +
          daily +
          " days.",
      };
    }
  }
}

function generateOrderOfOpsQuestion(diff) {
  var a, b, c, answer;
  switch (diff) {
    case "easy": {
      a = rand(2, 9);
      b = rand(2, 9);
      c = rand(2, 9);
      answer = a + b * c;
      return {
        question: a + " + " + b + " \u00D7 " + c,
        answer: answer,
        difficulty: diff,
        world: "numberKingdom",
        stage: 5,
        hint:
          "PEMDAS: Multiply first, then add.\n" +
          b +
          " \u00D7 " +
          c +
          " = " +
          b * c +
          ", then " +
          a +
          " + " +
          b * c,
      };
    }
    case "medium": {
      a = rand(3, 9);
      b = rand(2, 9);
      c = rand(2, 6);
      answer = (a + b) * c;
      return {
        question: "(" + a + " + " + b + ") \u00D7 " + c,
        answer: answer,
        difficulty: diff,
        world: "numberKingdom",
        stage: 5,
        hint:
          "PEMDAS: Parentheses first.\n" +
          a +
          " + " +
          b +
          " = " +
          (a + b) +
          ", then \u00D7 " +
          c,
      };
    }
    case "hard": {
      a = rand(4, 10);
      b = rand(2, 9);
      c = rand(2, 5);
      answer = a * b - c * a;
      return {
        question: a + " \u00D7 " + b + " - " + c + " \u00D7 " + a,
        answer: answer,
        difficulty: diff,
        world: "numberKingdom",
        stage: 5,
        hint:
          "PEMDAS: Multiply before subtracting.\n" +
          a +
          " \u00D7 " +
          b +
          " = " +
          a * b +
          ", " +
          c +
          " \u00D7 " +
          a +
          " = " +
          c * a +
          ", then " +
          a * b +
          " - " +
          c * a,
      };
    }
  }
}

function generateBossQuestion(diff) {
  var bossSkills = [
    generateAdditionQuestion,
    generateSubtractionQuestion,
    generateMultiplicationQuestion,
    generateDivisionQuestion,
    generateWordProblemQuestion,
    generateOrderOfOpsQuestion,
  ];
  var skill = bossSkills[rand(0, bossSkills.length - 1)];
  var q = skill(diff === "hard" ? "hard" : diff === "easy" ? "easy" : "medium");
  q.isBoss = true;
  q.world = "numberKingdom";
  q.stage = 6;
  return q;
}

// ===== KINGDOM GAME LOGIC =====
function enterKingdom() {
  gameState.selectedWorld = "numberKingdom";
  gameState.kingdomStage = 0;
  gameState.kingdomPracticeMode = false;
  gameState.kingdomPracticeQueue = [];
  showScreen("kingdomMap");
}

function enterKingdomStage(stageIndex) {
  if (stageIndex > 0 && !gameState.kingdomStageCompleted[stageIndex - 1]) {
    showNotification("Clear the previous stage first!");
    return;
  }
  gameState.kingdomStage = stageIndex;
  gameState.kingdomStageProgress[stageIndex] = 0;
  startKingdomLesson(stageIndex);
}

function startKingdomLesson(stageIndex) {
  gameState.lessonStartTime = Date.now();
  gameState.sessionCorrect = 0;
  gameState.sessionIncorrect = 0;
  gameState.currentChain = 0;
  gameState.bestChain = 0;
  gameState.sessionXpGained = 0;
  gameState.questionCount = 0;
  gameState.wrongAttempts = 0;
  gameState.hintsUsed = 0;
  showScreen("kingdomGame");
  startKingdomQuestion();
}

function startKingdomQuestion() {
  var q = generateKingdomQuestion(
    gameState.selectedDifficulty.numberKingdom || "easy",
  );
  gameState.currentQuestion = q;
  gameState.currentQuestion.id = Date.now();
  gameState.wrongAttempts = 0;
  renderKingdomQuestion(q);
}

function renderKingdomQuestion(q) {
  var container = document.getElementById("kingdomQuestionContainer");
  var feedback = document.getElementById("kingdomFeedback");
  var hintBox = document.getElementById("kingdomHintBox");
  if (!container) return;
  feedback.className = "kingdom-feedback";
  feedback.textContent = "";
  hintBox.className = "kingdom-hint-box";
  hintBox.textContent = "";
  var input = document.getElementById("kingdomAnswerInput");
  if (input) {
    input.value = "";
    input.disabled = false;
    input.focus();
  }
  var submitBtn = document.getElementById("kingdomSubmitBtn");
  if (submitBtn) submitBtn.disabled = false;

  // Render question
  var stage = KINGDOM_STAGES[q.stage] || null;
  var html = '<div class="kingdom-question-header">';
  if (q.stage === 6) {
    html += "\u{1F451} Boss Battle: The Bandit King";
  } else if (stage) {
    html += stage.emoji + " " + stage.name;
  }
  html += " \u2022 " + capitalize(q.difficulty) + "</div>";

  // Handle question display
  if (q.question.indexOf("<table") !== -1) {
    html += '<div class="question-text">' + q.question + "</div>";
  } else if (q.question.trim().startsWith("<svg")) {
    html += '<div class="question-text">' + q.question + "</div>";
  } else {
    var verticalHtml = formatMathVertical(q.question);
    if (verticalHtml) {
      html += '<div class="question-text">' + verticalHtml + "</div>";
    } else {
      html +=
        '<div class="question-text">' +
        q.question.replace(/\n/g, "<br>") +
        "</div>";
    }
  }

  // Handle ratio/fraction placeholders
  if (typeof q.answer === "string" && q.answer.indexOf("/") !== -1) {
    var parts2 = q.answer.split("/");
    html +=
      '<div class="kingdom-placeholder">Type answer (e.g., ' +
      parts2[0] +
      "/" +
      parts2[1] +
      ")</div>";
  } else if (typeof q.answer === "string" && q.answer.indexOf(":") !== -1) {
    var ratioParts = q.answer.split(":");
    html +=
      '<div class="kingdom-placeholder">Type answer (e.g., ' +
      ratioParts[0] +
      ":" +
      ratioParts[1] +
      ")</div>";
  }
  container.innerHTML = html;
  updateKingdomProgressBar();
}

function submitKingdomAnswer() {
  var input = document.getElementById("kingdomAnswerInput");
  if (!input || !input.value.trim()) return;
  var answer = input.value.trim();
  var q = gameState.currentQuestion;
  if (!q) return;
  var correct = q.answer;
  var isCorrect = false;
  if (typeof correct === "string") {
    isCorrect = answer.toLowerCase() === correct.toLowerCase();
  } else {
    var num = parseFloat(answer);
    if (!isNaN(num)) isCorrect = Math.abs(num - correct) <= 0.01;
  }

  var feedback = document.getElementById("kingdomFeedback");
  if (isCorrect) {
    feedback.className = "kingdom-feedback kingdom-correct";
    feedback.textContent = "\u2705 Correct! +10 XP";
    gameState.sessionCorrect++;
    gameState.currentChain++;
    if (gameState.currentChain > gameState.bestChain)
      gameState.bestChain = gameState.currentChain;
    addXp(XP_PER_CORRECT);
    gameState.sessionXpGained += XP_PER_CORRECT;
    gameState.worldProgress.numberKingdom.correct++;
    gameState.worldProgress.numberKingdom.total++;

    if (q.stage === 6) {
      // Boss battle
      gameState.kingdomBossHP--;
    } else {
      // Normal stage progress
      gameState.kingdomStageProgress[q.stage]++;
    }

    input.disabled = true;
    var submitBtn = document.getElementById("kingdomSubmitBtn");
    if (submitBtn) submitBtn.disabled = true;
    playCorrectSound();

    // Check stage/boss completion
    setTimeout(function () {
      if (q.stage === 6) {
        if (gameState.kingdomBossHP <= 0) {
          completeKingdomBoss();
        } else {
          startKingdomQuestion();
        }
      } else {
        var stageReq = KINGDOM_STAGES[q.stage].requiredHits;
        if (gameState.kingdomStageProgress[q.stage] >= stageReq) {
          completeKingdomStage(q.stage);
        } else {
          startKingdomQuestion();
        }
      }
    }, 1000);
  } else {
    feedback.className = "kingdom-feedback kingdom-wrong";
    feedback.textContent = "\u274C Not quite! Try again.";
    gameState.sessionIncorrect++;
    gameState.currentChain = 0;
    gameState.worldProgress.numberKingdom.total++;
    gameState.wrongAttempts++;

    // Store wrong answer
    gameState.kingdomWrongAnswers.push({
      question: q.question,
      correctAnswer: q.answer,
      userAnswer: answer,
      stage: q.stage,
      hint: q.hint || "",
    });

    if (q.stage === 6) {
      gameState.kingdomHearts--;
      if (gameState.kingdomHearts <= 0) {
        failKingdomBoss();
        return;
      }
    }

    // Show hint on 2nd wrong attempt
    if (gameState.wrongAttempts === 2) {
      showKingdomHint(q);
    }

    input.value = "";
    input.focus();
    playWrongSound();
  }
  saveGame();
}

function showKingdomHint(q) {
  var hintBox = document.getElementById("kingdomHintBox");
  if (hintBox && q.hint) {
    hintBox.innerHTML =
      "\uD83D\uDCA1 <strong>Hint:</strong><br>" + q.hint.replace(/\n/g, "<br>");
    hintBox.className = "kingdom-hint-box kingdom-hint-visible";
  }
}

function showKingdomSolution(q) {
  var hintBox = document.getElementById("kingdomHintBox");
  if (!hintBox) return;
  var solText = q.hint ? q.hint : generateSolution(q);
  hintBox.innerHTML =
    "\uD83D\uDCD6 <strong>Solution:</strong><br>" +
    solText.replace(/\n/g, "<br>");
  hintBox.className = "kingdom-hint-box kingdom-hint-visible";
}

function completeKingdomStage(stageIndex) {
  gameState.kingdomStageCompleted[stageIndex] = true;
  var stage = KINGDOM_STAGES[stageIndex];
  var bonusXp = stage.xpReward;
  addXp(bonusXp);
  gameState.kingdomCoins += stage.coinReward;
  gameState.sessionXpGained += bonusXp;
  updateUnlockedWorlds();
  saveGame();

  var stageNames = [
    "Addition Village",
    "Subtraction Forest",
    "Multiplication Mountains",
    "Division Desert",
    "Puzzle Castle",
    "Wizard Tower",
  ];
  showNotification(
    "\u{1F3C6} " +
      stageNames[stageIndex] +
      " cleared! +" +
      bonusXp +
      " XP, +" +
      stage.coinReward +
      " coins!",
  );

  setTimeout(function () {
    showKingdomStageComplete(stageIndex);
  }, 500);
}

function showKingdomStageComplete(stageIndex) {
  var stage = KINGDOM_STAGES[stageIndex];
  var overlay = document.createElement("div");
  overlay.className = "kingdom-overlay";
  overlay.id = "kingdomCompleteOverlay";
  var accuracy =
    gameState.sessionCorrect + gameState.sessionIncorrect > 0
      ? Math.round(
          (gameState.sessionCorrect /
            (gameState.sessionCorrect + gameState.sessionIncorrect)) *
            100,
        )
      : 0;
  var isPerfect = gameState.sessionIncorrect === 0;
  var perfectBonus = isPerfect ? 25 : 0;
  if (isPerfect) {
    addXp(25);
    gameState.sessionXpGained += 25;
  }

  var nextUnlocked =
    stageIndex < 5 && !gameState.kingdomStageCompleted[stageIndex + 1]
      ? true
      : false;

  overlay.innerHTML =
    '<div class="kingdom-complete-card">' +
    '<div class="kingdom-complete-emoji">' +
    stage.emoji +
    "</div>" +
    '<h2 class="kingdom-complete-title">' +
    stage.name +
    " Complete!</h2>" +
    '<div class="kingdom-complete-stats">' +
    "<div>✅ Correct: " +
    gameState.sessionCorrect +
    "</div>" +
    "<div>❌ Wrong: " +
    gameState.sessionIncorrect +
    "</div>" +
    "<div>📊 Accuracy: " +
    accuracy +
    "%</div>" +
    "<div>⚡ XP: +" +
    gameState.sessionXpGained +
    "</div>" +
    "<div>\u{1FA99} Coins: +" +
    stage.coinReward +
    "</div>" +
    (isPerfect
      ? '<div class="kingdom-perfect-bonus">\u2728 Perfect! +25 Bonus XP!</div>'
      : "") +
    "</div>" +
    '<div class="kingdom-complete-btns">' +
    (gameState.kingdomWrongAnswers.length > 0
      ? '<button class="kingdom-btn kingdom-btn-secondary" onclick="toggleKingdomReview()">\u{1F4DD} Review Mistakes</button>'
      : "") +
    (stageIndex < 5
      ? '<button class="kingdom-btn" onclick="closeKingdomOverlay(); enterKingdomStage(' +
        (stageIndex + 1) +
        ')">\u25B6 Next Stage</button>'
      : '<button class="kingdom-btn" onclick="closeKingdomOverlay(); enterKingdomBattle()">\u{1F451} Fight the Bandit King!</button>') +
    '<button class="kingdom-btn kingdom-btn-secondary" onclick="closeKingdomOverlay(); showScreen(\'kingdomMap\')">\u{1F3E0} Stage Select</button>' +
    "</div>" +
    (gameState.kingdomWrongAnswers.length > 0
      ? '<div id="kingdomReviewContent" class="kingdom-review-content" style="display:none"></div>'
      : "") +
    "</div>";
  document.getElementById("app").appendChild(overlay);
}

function toggleKingdomReview() {
  var reviewDiv = document.getElementById("kingdomReviewContent");
  if (!reviewDiv) return;
  if (reviewDiv.style.display === "block") {
    reviewDiv.style.display = "none";
    return;
  }
  var html =
    '<h3 class="kingdom-review-title">\u{1F4DD} Mistakes to Review</h3>';
  var wrongs = gameState.kingdomWrongAnswers;
  if (wrongs.length === 0) {
    html += '<p class="kingdom-review-empty">No mistakes! \u{1F389}</p>';
  } else {
    for (var i = 0; i < wrongs.length; i++) {
      var w = wrongs[i];
      html +=
        '<div class="kingdom-review-item">' +
        '<div class="kingdom-review-q"><strong>Q:</strong> ' +
        w.question +
        "</div>" +
        '<div class="kingdom-review-your"><strong>Your answer:</strong> <span class="kingdom-wrong-text">' +
        w.userAnswer +
        "</span></div>" +
        '<div class="kingdom-review-correct"><strong>Correct:</strong> <span class="kingdom-correct-text">' +
        w.correctAnswer +
        "</span></div>" +
        (w.hint
          ? '<div class="kingdom-review-hint">\uD83D\uDCA1 ' + w.hint + "</div>"
          : "") +
        "</div>";
    }
    html +=
      '<button class="kingdom-btn" onclick="closeKingdomOverlay(); practiceKingdomMistakes()">\u{1F504} Practice These Again</button>';
  }
  reviewDiv.innerHTML = html;
  reviewDiv.style.display = "block";
}

function practiceKingdomMistakes() {
  var wrongs = gameState.kingdomWrongAnswers;
  if (wrongs.length === 0) return;
  gameState.kingdomPracticeMode = true;
  gameState.kingdomPracticeQueue = wrongs.slice().map(function (w) {
    return {
      question: w.question,
      answer:
        typeof w.correctAnswer === "string"
          ? w.correctAnswer
          : parseFloat(w.correctAnswer),
      world: "numberKingdom",
      stage: w.stage,
      hint: w.hint,
      isPractice: true,
    };
  });
  gameState.kingdomWrongAnswers = [];
  gameState.kingdomStage = 0; // reset for practice questions
  gameState.lessonStartTime = Date.now();
  gameState.sessionCorrect = 0;
  gameState.sessionIncorrect = 0;
  gameState.questionCount = 0;
  showScreen("kingdomGame");

  // Load first practice question
  var q = gameState.kingdomPracticeQueue.shift();
  if (q) {
    gameState.currentQuestion = q;
    renderKingdomQuestion(q);
  }
}

function completeKingdomBoss() {
  gameState.kingdomBossDefeated = true;
  var bonusXp = 100;
  addXp(bonusXp);
  gameState.kingdomCoins += 50;
  gameState.sessionXpGained += bonusXp;
  // Award badge
  if (gameState.badges.indexOf("Hero of Number Kingdom") === -1) {
    gameState.badges.push("Hero of Number Kingdom");
  }
  updateUnlockedWorlds();
  saveGame();
  showNotification(
    "\u{1F451} The Bandit King is defeated! You are a Hero of Number Kingdom!",
  );
  showKingdomBossVictory();
}

function showKingdomBossVictory() {
  var overlay = document.createElement("div");
  overlay.className = "kingdom-overlay";
  overlay.id = "kingdomCompleteOverlay";
  overlay.innerHTML =
    '<div class="kingdom-complete-card kingdom-boss-card">' +
    '<div class="kingdom-complete-emoji">\u{1F451}</div>' +
    '<h2 class="kingdom-complete-title kingdom-boss-title">The Bandit King Defeated!</h2>' +
    '<div class="kingdom-complete-stats">' +
    "<div>✅ Correct: " +
    gameState.sessionCorrect +
    "</div>" +
    "<div>❌ Wrong: " +
    gameState.sessionIncorrect +
    "</div>" +
    "<div>⚡ XP: +" +
    gameState.sessionXpGained +
    "</div>" +
    "<div>\u{1FA99} Coins: +50</div>" +
    "</div>" +
    '<div class="kingdom-boss-badge">\u{1F3C6} Earned: Hero of Number Kingdom</div>' +
    '<div class="kingdom-complete-btns">' +
    '<button class="kingdom-btn" onclick="closeKingdomOverlay(); showScreen(\'map\')">\u{1F3E0} Back to World Map</button>' +
    "</div>" +
    "</div>";
  document.getElementById("app").appendChild(overlay);
}

function failKingdomBoss() {
  var overlay = document.createElement("div");
  overlay.className = "kingdom-overlay";
  overlay.id = "kingdomCompleteOverlay";
  overlay.innerHTML =
    '<div class="kingdom-complete-card kingdom-fail-card">' +
    '<div class="kingdom-complete-emoji">\u{1F480}</div>' +
    '<h2 class="kingdom-complete-title">Defeated by the Bandit King...</h2>' +
    '<p class="kingdom-fail-text">Don\u2019t give up! Review your mistakes and try again.</p>' +
    (gameState.kingdomWrongAnswers.length > 0
      ? '<button class="kingdom-btn kingdom-btn-secondary" onclick="toggleKingdomReview()">\u{1F4DD} Review Mistakes</button>'
      : "") +
    '<div class="kingdom-complete-btns">' +
    '<button class="kingdom-btn" onclick="closeKingdomOverlay(); enterKingdomBattle()">\u{1F504} Retry Boss</button>' +
    '<button class="kingdom-btn kingdom-btn-secondary" onclick="closeKingdomOverlay(); showScreen(\'kingdomMap\')">\u{1F3E0} Stage Select</button>' +
    "</div>" +
    (gameState.kingdomWrongAnswers.length > 0
      ? '<div id="kingdomReviewContent" class="kingdom-review-content" style="display:none"></div>'
      : "") +
    "</div>";
  document.getElementById("app").appendChild(overlay);
}

function enterKingdomBattle() {
  gameState.kingdomStage = 6;
  gameState.kingdomBossHP = 10;
  gameState.kingdomHearts = 3;
  gameState.kingdomBossTimer = 60;
  gameState.kingdomWrongAnswers = [];
  startKingdomLesson(6);
}

function updateKingdomProgressBar() {
  var bar = document.getElementById("kingdomProgressBar");
  var label = document.getElementById("kingdomProgressLabel");
  var heartsDisplay = document.getElementById("kingdomHeartsDisplay");
  var coinsDisplay = document.getElementById("kingdomCoinsDisplay");
  var timerDisplay = document.getElementById("kingdomTimerDisplay");
  var bossHPDisplay = document.getElementById("kingdomBossHPDisplay");

  if (bar && gameState.kingdomStage < 6) {
    var stage = KINGDOM_STAGES[gameState.kingdomStage];
    if (stage) {
      var pct = Math.min(
        100,
        (gameState.kingdomStageProgress[gameState.kingdomStage] /
          stage.requiredHits) *
          100,
      );
      bar.style.width = pct + "%";
      if (label)
        label.textContent =
          gameState.kingdomStageProgress[gameState.kingdomStage] +
          "/" +
          stage.requiredHits;
    }
  } else if (bar && gameState.kingdomStage === 6) {
    var bossPct = Math.max(0, (gameState.kingdomBossHP / 10) * 100);
    bar.style.width = bossPct + "%";
    if (label)
      label.textContent = "Boss HP: " + gameState.kingdomBossHP + "/10";
  }

  if (heartsDisplay) {
    var hearts = "";
    for (var i = 0; i < gameState.kingdomHearts; i++) hearts += "\u2764\uFE0F";
    for (var j = gameState.kingdomHearts; j < 3; j++) hearts += "\u{1F5A4}";
    heartsDisplay.innerHTML = hearts;
  }

  if (coinsDisplay) {
    coinsDisplay.textContent = "\u{1FA99} " + gameState.kingdomCoins;
  }

  if (timerDisplay && gameState.kingdomStage === 6) {
    timerDisplay.textContent =
      "\u23F1\uFE0F " + gameState.kingdomBossTimer + "s";
  }

  if (bossHPDisplay && gameState.kingdomStage === 6) {
    bossHPDisplay.textContent =
      "\u{1F451} HP: " + gameState.kingdomBossHP + "/10";
  }
}

function closeKingdomOverlay() {
  var overlay = document.getElementById("kingdomCompleteOverlay");
  if (overlay) overlay.remove();
}

// ===== KINGDOM MAP RENDERING =====
function renderKingdomMap() {
  var container = document.getElementById("kingdomMapContainer");
  if (!container) return;
  container.innerHTML = "";
  var html =
    '<div class="kingdom-map-header">\u{1F3F0} Number Kingdom Stages</div>';
  html +=
    '<div class="kingdom-stats-bar">\u{1FA99} Coins: ' +
    gameState.kingdomCoins +
    " | \u{1F3C6} Stages: " +
    gameState.kingdomStageCompleted.filter(function (s) {
      return s;
    }).length +
    "/6</div>";
  html += '<div class="kingdom-stage-grid">';

  for (var i = 0; i < KINGDOM_STAGES.length; i++) {
    var s = KINGDOM_STAGES[i];
    var completed = gameState.kingdomStageCompleted[i];
    var unlocked = i === 0 || gameState.kingdomStageCompleted[i - 1];
    var locked = !unlocked;

    html +=
      '<div class="kingdom-stage-card ' +
      (completed ? "kingdom-stage-done" : "") +
      (locked ? " kingdom-stage-locked" : " kingdom-stage-open") +
      '" onclick="' +
      (locked ? "" : "enterKingdomStage(" + i + ")") +
      '">' +
      '<div class="kingdom-stage-emoji">' +
      (locked ? "\u{1F512}" : completed ? "\u2705" : s.emoji) +
      "</div>" +
      '<div class="kingdom-stage-name">' +
      s.name +
      "</div>" +
      '<div class="kingdom-stage-desc">' +
      s.desc +
      "</div>" +
      (completed
        ? '<div class="kingdom-stage-check">\u2705 Complete</div>'
        : "") +
      "</div>";
  }

  html += "</div>";

  // Boss entry
  var allStagesDone = gameState.kingdomStageCompleted.every(function (s) {
    return s;
  });
  html +=
    '<div class="kingdom-boss-entry ' +
    (allStagesDone ? "" : "kingdom-stage-locked") +
    '" onclick="' +
    (allStagesDone ? "enterKingdomBattle()" : "") +
    '">' +
    '<div class="kingdom-stage-emoji">' +
    (allStagesDone ? "\u{1F451}" : "\u{1F512}") +
    "</div>" +
    '<div class="kingdom-stage-name">\u{1F451} Boss: The Bandit King</div>' +
    '<div class="kingdom-stage-desc">' +
    (allStagesDone
      ? "Defeat the Bandit King in a timed battle!"
      : "Clear all stages to unlock") +
    "</div>" +
    (gameState.kingdomBossDefeated
      ? '<div class="kingdom-stage-check">\u{1F3C6} Hero of Number Kingdom</div>'
      : "") +
    "</div>";

  container.innerHTML = html;
}
