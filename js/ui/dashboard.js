// ===== DASHBOARD =====
function renderDashboard() {
  var dashboardContent = document.getElementById("dashboardContent");
  dashboardContent.innerHTML = "";

  var statsCard = document.createElement("div");
  statsCard.className = "stats-card";
  statsCard.innerHTML =
    "<h3>\uD83D\uDCCA Your Progress</h3>" +
    '<div class="stats-grid">' +
    '<div class="stat-item"><div class="stat-value">' +
    gameState.totalCorrect +
    "/" +
    gameState.totalQuestions +
    '</div><div class="stat-label">Correct</div></div>' +
    '<div class="stat-item"><div class="stat-value">' +
    gameState.stars +
    ' \u2B50</div><div class="stat-label">Stars</div></div>' +
    '<div class="stat-item"><div class="stat-value">' +
    gameState.unlockedWorlds.length +
    "/" +
    Object.keys(WORLDS).length +
    '</div><div class="stat-label">Worlds</div></div>' +
    "</div>";
  dashboardContent.appendChild(statsCard);

  var worldProgressCard = document.createElement("div");
  worldProgressCard.className = "stats-card";
  worldProgressCard.innerHTML = "<h3>\uD83D\uDDFA\uFE0F World Progress</h3>";
  var progList = document.createElement("div");
  progList.className = "world-progress-list";

  for (var worldId in WORLDS) {
    var world = WORLDS[worldId];
    var progress = gameState.worldProgress[worldId];
    var pct =
      progress.total > 0
        ? Math.round((progress.correct / progress.total) * 100)
        : 0;
    var isUnlocked = gameState.unlockedWorlds.includes(worldId);
    var row = document.createElement("div");
    row.className = "world-progress-row";
    row.innerHTML =
      '<span class="wp-emoji">' +
      (isUnlocked ? world.emoji : "\uD83D\uDD12") +
      "</span>" +
      '<span class="wp-name">' +
      world.name +
      "</span>" +
      '<div class="wp-bar"><div class="wp-fill" style="width:' +
      pct +
      "%; background:" +
      (isUnlocked ? world.color : "#666") +
      '"></div></div>' +
      '<span class="wp-pct">' +
      pct +
      "%</span>";
    progList.appendChild(row);
  }
  worldProgressCard.appendChild(progList);
  dashboardContent.appendChild(worldProgressCard);

  if (gameState.dailyQuest && !gameState.dailyQuest.rewardClaimed) {
    var questCard = document.createElement("div");
    questCard.className = "stats-card";
    var quest = gameState.dailyQuest;
    var questHtml =
      '<h3>\uD83D\uDCC5 Today\'s Quest</h3><div class="world-progress-list">';
    quest.targets.forEach(function (t, i) {
      var done = quest.progress[i] >= t.count;
      questHtml +=
        '<div class="world-progress-row">' +
        '<span class="wp-emoji">' +
        (done ? "\u2705" : "\u2B1C") +
        "</span>" +
        '<span class="wp-name">' +
        t.count +
        " " +
        t.name +
        "</span>" +
        '<div class="wp-bar"><div class="wp-fill" style="width:' +
        Math.min((quest.progress[i] / t.count) * 100, 100) +
        '%; background:#ffb300;"></div></div>' +
        '<span class="wp-pct">' +
        quest.progress[i] +
        "/" +
        t.count +
        "</span></div>";
    });
    questHtml += "</div>";
    if (quest.completed && !quest.rewardClaimed) {
      questHtml +=
        '<button class="debug-btn" style="margin-top:10px;" onclick="claimDailyQuestReward(); renderDashboard();">\uD83C\uDF81 Claim Reward (\u2B50 Star)</button>';
    }
    questCard.innerHTML = questHtml;
    dashboardContent.appendChild(questCard);
  }

  var tipsCard = document.createElement("div");
  tipsCard.className = "stats-card";
  tipsCard.innerHTML =
    "<h3>\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67 Parent Tips</h3>" +
    '<ul class="tips-list">' +
    "<li>\uD83D\uDCC5 Encourage 10-15 minutes of daily practice</li>" +
    "<li>\uD83C\uDFAF Celebrate small wins and progress</li>" +
    "<li>\uD83D\uDCA1 Wrong answers = learning opportunities</li>" +
    "<li>\u2B50 Stars are earned every 10 correct answers</li>" +
    "<li>\uD83D\uDCDD Use the Work Area to draw calculations</li>" +
    '<li>\uD83D\uDCA1 Tap "I Need Help" for guided hints</li>' +
    "</ul>" +
    '<button class="danger-btn" onclick="resetGame()">\uD83D\uDDD1\uFE0F Reset All Progress</button>' +
    '<hr style="margin:15px 0; border:none; border-top:1px solid #eee;">' +
    '<div style="display:flex; gap:10px;">' +
    '<button class="debug-btn" onclick="debugUnlockAllWorlds()">\uD83D\uDD13 Unlock All Worlds</button>' +
    '<button class="debug-btn" onclick="debugLockAllWorlds()">\uD83D\uDD12 Lock All Worlds</button></div>' +
    '<div style="font-size:0.75rem; color:#999; margin-top:8px; text-align:center;">Debug Tools \u2014 for testing only</div>';
  dashboardContent.appendChild(tipsCard);
}
