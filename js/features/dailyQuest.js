// ===== QUEST SYSTEM =====
// Supports daily quests (easy/medium/hard) + weekly quests

function initDailyQuest() {
  var today = new Date().toISOString().split("T")[0];
  var weekNumber = getWeekNumber();

  // Initialize or reset daily quests
  if (!gameState.dailyQuest || gameState.dailyQuest.date !== today) {
    gameState.dailyQuest = generateDailyQuest(today);
    saveGame();
  }
  // Initialize or reset weekly quest
  if (!gameState.weeklyQuest || gameState.weeklyQuest.week !== weekNumber) {
    gameState.weeklyQuest = generateWeeklyQuest(weekNumber);
    saveGame();
  }
}

function getWeekNumber() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 1);
  var diff = now - start;
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
}

function generateDailyQuest(date) {
  // Pick a random difficulty
  var diff = QUEST_DIFFICULTIES[rand(0, QUEST_DIFFICULTIES.length - 1)];
  var targets = DAILY_QUESTS[diff].map(function (t) {
    return {
      type: t.type,
      name: t.name,
      count: t.count,
      xpReward: t.xpReward,
      icon: t.icon,
    };
  });
  return {
    date: date,
    difficulty: diff,
    targets: targets,
    progress: targets.map(function () {
      return 0;
    }),
    completed: false,
    rewardClaimed: false,
    updatedIndex: -1, // track which target just updated for glow
  };
}

function generateWeeklyQuest(weekNumber) {
  return {
    week: weekNumber,
    name: WEEKLY_QUEST.name,
    type: WEEKLY_QUEST.type,
    count: WEEKLY_QUEST.count,
    xpReward: WEEKLY_QUEST.xpReward,
    rewardCoupon: WEEKLY_QUEST.rewardCoupon,
    icon: WEEKLY_QUEST.icon,
    progress: 0,
    completed: false,
    rewardClaimed: false,
  };
}

// ===== PROGRESS UPDATE =====
function updateQuestProgress(type, amount) {
  if (!gameState.dailyQuest) return;
  var quest = gameState.dailyQuest;
  if (quest.completed) return;

  var updated = false;
  var updatedIdx = -1;

  quest.targets.forEach(function (target, i) {
    if (target.type === type && quest.progress[i] < target.count) {
      quest.progress[i] = Math.min(target.count, quest.progress[i] + amount);
      updated = true;
      updatedIdx = i;
    }
  });

  if (updated) {
    quest.updatedIndex = updatedIdx;
    var allDone = quest.targets.every(function (t, i) {
      return quest.progress[i] >= t.count;
    });
    if (allDone && !quest.completed) {
      quest.completed = true;
      showNotification(
        "\uD83C\uDF89 Daily Quest Complete! +" +
          calculateQuestXp(quest) +
          " XP",
      );
      addXp(calculateQuestXp(quest));
    }
    saveGame();
  }
}

function updateWeeklyQuestProgress(amount) {
  if (!gameState.weeklyQuest || gameState.weeklyQuest.completed) return;
  var wq = gameState.weeklyQuest;
  wq.progress = Math.min(wq.count, wq.progress + amount);
  if (wq.progress >= wq.count && !wq.completed) {
    wq.completed = true;
    showNotification(
      "\uD83C\uDFC6 Weekly Quest Complete! +" + wq.xpReward + " XP",
    );
    addXp(wq.xpReward);
    if (wq.rewardCoupon) {
      showNotification(
        "\uD83C\uDF81 You earned a Reward Coupon! Check the Treasure Trail.",
      );
    }
  }
  saveGame();
}

function calculateQuestXp(quest) {
  var total = 0;
  quest.targets.forEach(function (t, i) {
    if (quest.progress[i] >= t.count) {
      total += t.xpReward;
    }
  });
  return total;
}

function claimDailyQuestReward() {
  if (
    !gameState.dailyQuest ||
    !gameState.dailyQuest.completed ||
    gameState.dailyQuest.rewardClaimed
  )
    return;
  gameState.dailyQuest.rewardClaimed = true;
  gameState.stars += 1;
  updateUnlockedWorlds();
  saveGame();
  showNotification("\u2B50 Daily Quest Reward Claimed! +1 Star");
}

function claimWeeklyQuestReward() {
  if (
    !gameState.weeklyQuest ||
    !gameState.weeklyQuest.completed ||
    gameState.weeklyQuest.rewardClaimed
  )
    return;
  gameState.weeklyQuest.rewardClaimed = true;
  gameState.stars += 2;
  updateUnlockedWorlds();
  saveGame();
  showNotification("\u2B50 Weekly Quest Reward Claimed! +2 Stars");
}

// ===== QUEST PANEL RENDERING =====
function renderQuestPanel() {
  var container = document.getElementById("questPanel");
  if (!container) return;

  var html = "";
  var quest = gameState.dailyQuest;

  if (quest) {
    html += '<div class="quest-section">';
    html +=
      "<h4>\uD83D\uDCC5 Daily Quests <span class='quest-diff'>(" +
      capitalize(quest.difficulty) +
      ")</span></h4>";

    quest.targets.forEach(function (target, i) {
      var done = quest.progress[i] >= target.count;
      var pct = Math.min(100, (quest.progress[i] / target.count) * 100);
      var wasUpdated = quest.updatedIndex === i;
      var classes = "quest-item";
      if (done) classes += " quest-done";
      if (wasUpdated) classes += " quest-glowing";

      html += '<div class="' + classes + '">';
      html += '<div class="quest-item-header">';
      html +=
        '<span class="quest-check">' + (done ? "\u2705" : "\u25CB") + "</span>";
      html += '<span class="quest-icon">' + target.icon + "</span>";
      html += '<span class="quest-name">' + target.name + "</span>";
      html +=
        '<span class="quest-progress-text">' +
        quest.progress[i] +
        "/" +
        target.count +
        "</span>";
      html += "</div>";
      if (!done) {
        html +=
          '<div class="quest-bar"><div class="quest-bar-fill" style="width:' +
          pct +
          '%"></div></div>';
      }
      html += "</div>";
    });

    if (quest.completed && !quest.rewardClaimed) {
      html +=
        '<button class="quest-claim-btn" onclick="claimDailyQuestReward()">\uD83C\uDF81 Claim Star Reward</button>';
    }
    html += "</div>";
  }

  // Weekly quest
  var wq = gameState.weeklyQuest;
  if (wq) {
    html += '<div class="quest-section quest-weekly">';
    html += "<h4>\uD83C\uDFC6 Weekly Quest</h4>";
    var wqDone = wq.progress >= wq.count;
    var wqPct = Math.min(100, (wq.progress / wq.count) * 100);

    html += '<div class="quest-item' + (wqDone ? " quest-done" : "") + '">';
    html += '<div class="quest-item-header">';
    html +=
      '<span class="quest-check">' + (wqDone ? "\u2705" : "\u25CB") + "</span>";
    html += '<span class="quest-icon">' + wq.icon + "</span>";
    html += '<span class="quest-name">' + wq.name + "</span>";
    html +=
      '<span class="quest-progress-text">' +
      wq.progress +
      "/" +
      wq.count +
      "</span>";
    html += "</div>";
    if (!wqDone) {
      html +=
        '<div class="quest-bar"><div class="quest-bar-fill" style="width:' +
        wqPct +
        '%"></div></div>';
    }
    html +=
      '<div class="quest-reward">Reward: +' +
      wq.xpReward +
      " XP" +
      (wq.rewardCoupon ? " + \uD83C\uDF81 Coupon" : "") +
      "</div>";
    if (wqDone && !wq.rewardClaimed) {
      html +=
        '<button class="quest-claim-btn" onclick="claimWeeklyQuestReward()">\uD83C\uDF81 Claim Weekly Reward</button>';
    }
    html += "</div>";
    html += "</div>";
  }

  container.innerHTML = html;

  // Clear glow after animation
  if (quest && quest.updatedIndex >= 0) {
    var self = this;
    setTimeout(function () {
      quest.updatedIndex = -1;
      renderQuestPanel();
    }, 1500);
  }
}

// ===== XP PROGRESS BAR =====
function renderXpBar() {
  var container = document.getElementById("xpBarContainer");
  if (!container) return;

  var prog = gameState.progression || { xp: 0, level: 1, xpToNextLevel: 100 };
  var xp = prog.xp || 0;
  var level = prog.level || 1;
  var xpToNext = prog.xpToNextLevel || 100;
  var pct = Math.min(100, (xp / xpToNext) * 100);

  // Find next world unlock
  var nextWorld = null;
  var nextWorldStars = null;
  for (var wid in WORLD_UNLOCK_REQUIREMENTS) {
    var required = WORLD_UNLOCK_REQUIREMENTS[wid];
    if (gameState.unlockedWorlds.indexOf(wid) === -1) {
      if (nextWorld === null || required < nextWorldStars) {
        nextWorld = wid;
        nextWorldStars = required;
      }
    }
  }

  var stars = gameState.stars || 0;
  var starsRemaining = nextWorldStars !== null ? nextWorldStars - stars : 0;

  var html = '<div class="xp-bar-header">';
  html += "\u2B50 Level " + level + " Explorer";
  html += "</div>";
  html +=
    '<div class="xp-bar-bg"><div class="xp-bar-fill" style="width:' +
    pct +
    '%"></div></div>';
  html += '<div class="xp-bar-label">' + xp + " / " + xpToNext + " XP";

  if (nextWorldStars !== null && starsRemaining > 0) {
    html += " \u2022 " + starsRemaining + " \u2B50 to next world";
  } else if (nextWorldStars === null) {
    var w = WORLDS[Object.keys(WORLDS)[Object.keys(WORLDS).length - 1]];
    html += " \u2022 Max level!";
  } else {
    html += " \u2022 All worlds unlocked!";
  }

  html += "</div>";

  container.innerHTML = html;
}
