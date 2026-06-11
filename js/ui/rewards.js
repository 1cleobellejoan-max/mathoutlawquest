// ===== REWARD SYSTEM =====
// Manages the Treasure Trail reward vault screen

function showRewards() {
  showScreen("rewards");
  renderRewards();
}

function renderRewards() {
  var container = document.getElementById("rewardsContent");
  if (!container) return;

  var rp = gameState.rewardPoints || 0;
  var claimed = gameState.claimedMilestones || [];
  var pendingIdx = gameState.pendingMilestoneIndex;

  var html = '<div class="rewards-summary">';
  html +=
    '<div class="rewards-points-display">🪙 <span class="rp-count">' +
    rp +
    "</span> Reward Points</div>";

  // Find next milestone
  var nextMilestone = null;
  var nextIndex = -1;
  var nextProgress = 0;
  var nextPrevPoints = 0;
  for (var i = 0; i < REWARD_MILESTONES.length; i++) {
    var m = REWARD_MILESTONES[i];
    if (claimed.indexOf(m.points) === -1) {
      nextMilestone = m;
      nextIndex = i;
      var prevPoints = i > 0 ? REWARD_MILESTONES[i - 1].points : 0;
      nextPrevPoints = prevPoints;
      nextProgress = Math.min(
        100,
        ((rp - prevPoints) / (m.points - prevPoints)) * 100,
      );
      break;
    }
  }

  html += "</div>";

  // Milestone journey road/path
  html += '<div class="rewards-journey">';
  html += "<h3>🎯 Reward Milestones</h3>";

  for (var j = 0; j < REWARD_MILESTONES.length; j++) {
    var milestone = REWARD_MILESTONES[j];
    var isClaimed = claimed.indexOf(milestone.points) !== -1;
    var isPending = pendingIdx === j;
    var isReached = rp >= milestone.points && !isClaimed;
    var isNext = nextIndex === j;

    html +=
      '<div class="reward-milestone ' +
      (isClaimed ? "milestone-claimed" : "") +
      (isPending ? "milestone-pending" : "") +
      (isReached && !isClaimed ? "milestone-reached" : "") +
      (isNext && !isReached && !isClaimed ? "milestone-next" : "") +
      '">';

    html +=
      '<div class="milestone-icon">' +
      (isClaimed ? "✅" : isReached ? "🎉" : milestone.emoji) +
      "</div>";

    html += '<div class="milestone-info">';
    html +=
      '<div class="milestone-points">' + milestone.points + " Points</div>";
    html += '<div class="milestone-prize">' + milestone.prize + "</div>";

    if (!isClaimed) {
      // Show progress bar
      var prevPts = j > 0 ? REWARD_MILESTONES[j - 1].points : 0;
      var segmentTotal = milestone.points - prevPts;
      var segmentProgress = Math.max(0, Math.min(segmentTotal, rp - prevPts));
      var pct =
        segmentTotal > 0
          ? Math.min(100, (segmentProgress / segmentTotal) * 100)
          : 0;

      html += '<div class="milestone-bar-container">';
      html += '<div class="milestone-bar-bg">';
      html +=
        '<div class="milestone-bar-fill" style="width:' + pct + '%"></div>';
      html += "</div>";
      html +=
        '<span class="milestone-bar-label">' +
        Math.min(rp, milestone.points) +
        " / " +
        milestone.points +
        "</span>";
      html += "</div>";
    } else {
      html += '<div class="milestone-claimed-label">✅ Claimed</div>';
    }

    // If pending (call parent), show verification message
    if (isPending) {
      html +=
        '<div class="milestone-pending-msg">' +
        "🎉 Congratulations!<br>You reached <strong>" +
        milestone.points +
        " Reward Points</strong>!<br><br>" +
        "<strong>Reward Unlocked:</strong> " +
        milestone.prize +
        "<br><br>" +
        "📞 Please call a parent to claim your reward." +
        "</div>";
    }

    html += "</div>"; // milestone-info
    html += "</div>"; // reward-milestone
  }

  html += "</div>"; // rewards-journey

  // ===== STUDY STATISTICS =====
  html += '<div class="study-stats-section">';
  html += '<div class="study-stats-header">\uD83D\uDCCA Study Statistics</div>';

  // Total study time
  var stats = gameState.studyStats;
  var totalStudySec = stats ? Math.floor(stats.totalStudyTimeMs / 1000) : 0;
  var totalStudyHours = Math.floor(totalStudySec / 3600);
  var totalStudyMins = Math.floor((totalStudySec % 3600) / 60);
  var totalTimeStr = totalStudyHours + "h " + totalStudyMins + "m";
  if (totalStudyHours === 0 && totalStudyMins === 0)
    totalTimeStr = totalStudySec + "s";
  if (totalStudyHours === 0 && totalStudyMins > 0)
    totalTimeStr = totalStudyMins + "m";

  // Longest session
  var longestSec = stats ? Math.floor(stats.longestSessionMs / 1000) : 0;
  var longestMins = Math.floor(longestSec / 60);
  var longestSecs = longestSec % 60;
  var longestStr = longestMins + "m " + longestSecs + "s";

  html += '<div class="study-stats-grid">';
  html += '<div class="study-stat-card">';
  html += '<div class="study-stat-icon">\u23F1\uFE0F</div>';
  html += '<div class="study-stat-label">Total Study Time</div>';
  html += '<div class="study-stat-value">' + totalTimeStr + "</div>";
  html += "</div>";
  html += '<div class="study-stat-card">';
  html += '<div class="study-stat-icon">\uD83D\uDCD6</div>';
  html += '<div class="study-stat-label">Lessons Completed</div>';
  html +=
    '<div class="study-stat-value">' +
    (stats ? stats.lessonsCompleted : 0) +
    "</div>";
  html += "</div>";
  html += '<div class="study-stat-card">';
  html += '<div class="study-stat-icon">\uD83D\uDD25</div>';
  html += '<div class="study-stat-label">Longest Session</div>';
  html += '<div class="study-stat-value">' + longestStr + "</div>";
  html += "</div>";
  html += '<div class="study-stat-card">';
  html += '<div class="study-stat-icon">\uD83E\uDE99</div>';
  html += '<div class="study-stat-label">Reward Points</div>';
  html +=
    '<div class="study-stat-value">' + (gameState.rewardPoints || 0) + "</div>";
  html += "</div>";
  html += "</div>";

  // Time-based achievement badges (visual only, no auto-rewards)
  var studyAchievements = [];
  var totalMs = stats ? stats.totalStudyTimeMs : 0;
  var totalMin = Math.floor(totalMs / 60000);
  if (totalMin >= 600)
    studyAchievements.push({
      emoji: "\uD83C\uDFC6",
      name: "Focus Champion",
      desc: "10+ hours studied",
    });
  else if (totalMin >= 60)
    studyAchievements.push({
      emoji: "\uD83D\uDCDA",
      name: "Dedicated Learner",
      desc: "1+ hour studied",
    });
  else if (totalMin >= 10)
    studyAchievements.push({
      emoji: "\u23F0",
      name: "Study Starter",
      desc: "10+ minutes studied",
    });

  if (studyAchievements.length > 0) {
    html += '<div class="study-achievements">';
    html +=
      '<div class="study-achievements-title">\uD83C\uDFC5 Study Achievements</div>';
    html += '<div class="study-achievements-row">';
    for (var a = 0; a < studyAchievements.length; a++) {
      html += '<div class="study-achievement-badge">';
      html += '<div class="sa-emoji">' + studyAchievements[a].emoji + "</div>";
      html += '<div class="sa-name">' + studyAchievements[a].name + "</div>";
      html += '<div class="sa-desc">' + studyAchievements[a].desc + "</div>";
      html += "</div>";
    }
    html += "</div></div>";
  }

  html += "</div>"; // study-stats-section

  // How to earn section
  html += '<div class="rewards-how-to">';
  html += "<h4>📖 How to Earn Points</h4>";
  html += "<ul>";
  html += "<li>✅ Correct Answer = +1 RP</li>";
  html += "<li>📚 Finish Lesson = +5 RP</li>";
  html += "<li>⭐ Earn a Star = +2 RP</li>";
  html += "<li>🔥 Chain x2 = +1 RP</li>";
  html += "<li>🔥 Chain x3 = +2 RP</li>";
  html += "<li>🔥 Chain x5 = +5 RP</li>";
  html += "<li>🔥 Chain x10 = +10 RP</li>";
  html += "</ul>";
  html += "</div>";

  // Back button
  html += '<div style="margin-top:16px; text-align:center;">';
  html +=
    '<button class="game-nav-btn" onclick="showScreen(\'map\')" style="background:rgba(255,255,255,0.2);color:white;border:none;padding:12px 30px;border-radius:12px;font-size:1rem;font-weight:600;cursor:pointer;">🗺️ Back to Map</button>';
  html += "</div>";

  container.innerHTML = html;
}

// ===== REWARD POINT EARNING =====
function addRewardPoints(amount, reason) {
  if (typeof amount !== "number" || amount <= 0) return;
  gameState.rewardPoints += amount;
  saveGame();

  // Check if any milestones reached
  checkMilestones();
}

function addChainRewardPoints(chain) {
  var bonus = RP_CHAIN_BONUS[chain];
  if (bonus) {
    addRewardPoints(bonus, "Chain x" + chain);
    showNotification("🔥 Chain x" + chain + "! +" + bonus + " Reward Points");
  }
}

function checkMilestones() {
  var rp = gameState.rewardPoints;
  var claimed = gameState.claimedMilestones || [];

  for (var i = 0; i < REWARD_MILESTONES.length; i++) {
    var milestone = REWARD_MILESTONES[i];
    if (rp >= milestone.points && claimed.indexOf(milestone.points) === -1) {
      // Milestone reached but not yet claimed
      gameState.pendingMilestoneIndex = i;
      gameState.milestonePending = true;
      saveGame();

      // Show notification
      showNotification(
        "🎉 Milestone Reached! " +
          milestone.points +
          " Points! Check the Treasure Trail!",
      );
      return;
    }
  }
}

function claimMilestone(index) {
  if (index < 0 || index >= REWARD_MILESTONES.length) return;
  var milestone = REWARD_MILESTONES[index];
  if (!gameState.claimedMilestones) gameState.claimedMilestones = [];

  if (gameState.claimedMilestones.indexOf(milestone.points) === -1) {
    gameState.claimedMilestones.push(milestone.points);
  }

  gameState.pendingMilestoneIndex = -1;
  gameState.milestonePending = false;
  saveGame();
  renderRewards();
  showNotification("✅ Reward claimed! " + milestone.prize);
}

// ===== INTEGRATION HOOKS (called from game.js) =====
function rewardOnCorrect(chain) {
  addRewardPoints(RP_PER_CORRECT, "Correct answer");

  // Check chain bonuses
  var bonusLevels = Object.keys(RP_CHAIN_BONUS)
    .map(Number)
    .sort(function (a, b) {
      return a - b;
    });
  for (var i = 0; i < bonusLevels.length; i++) {
    if (chain === bonusLevels[i]) {
      addChainRewardPoints(chain);
      break;
    }
  }
}

function rewardOnLessonComplete(starsGained) {
  addRewardPoints(RP_PER_LESSON, "Lesson complete");
  if (starsGained > 0) {
    addRewardPoints(starsGained * RP_PER_STAR, "Stars earned");
  }
}
