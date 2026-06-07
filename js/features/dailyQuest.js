// ===== DAILY QUEST SYSTEM =====
function initDailyQuest() {
  var today = new Date().toISOString().split("T")[0];
  if (gameState.dailyQuest && gameState.dailyQuest.date === today) {
    addDailyQuestNotification();
    updateNotifBadge();
    return;
  }
}

function addDailyQuestNotification() {
  if (!gameState.dailyQuest) return;
  notificationManager.removeByType("quest");
  var quest = gameState.dailyQuest;
  var statusMsg = "In Progress";
  if (quest.completed && !quest.rewardClaimed) {
    statusMsg = "\u2705 Complete!";
  } else if (quest.rewardClaimed) {
    statusMsg = "\uD83C\uDF81 Reward Claimed";
  }
  notificationManager.add({
    type: "quest",
    title: "\uD83D\uDCC5 Daily Quest",
    message:
      quest.targets
        .map(function (t, i) {
          return t.name + ": " + quest.progress[i] + "/" + t.count;
        })
        .join(" \u2022 ") +
      " \u2014 " +
      statusMsg,
    priority: "high",
    autoToast: false,
  });
}

function updateDailyQuestProgress(worldId) {
  if (!gameState.dailyQuest || gameState.dailyQuest.completed) return;
  var quest = gameState.dailyQuest;
  var updated = false;
  quest.targets.forEach(function (target, i) {
    if (target.world === worldId && quest.progress[i] < target.count) {
      quest.progress[i]++;
      updated = true;
    }
  });
  if (updated) {
    var allDone = quest.targets.every(function (t, i) {
      return quest.progress[i] >= t.count;
    });
    if (allDone && !quest.completed) {
      quest.completed = true;
      showNotification("\uD83C\uDF89 Daily Quest Complete!");
      notificationManager.add({
        type: "quest",
        title: "\uD83C\uDFAF Quest Complete",
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
  gameState.stars += 1;
  saveGame();
  updateNotifBadge();
  showNotification("\uD83C\uDF81 Claimed! +\u2B50 Star");
  notificationManager.add({
    type: "reward",
    title: "\uD83C\uDF81 Quest Reward Claimed",
    message: "You received \u2B50 Star",
    priority: "high",
    autoToast: false,
  });
  addDailyQuestNotification();
}
