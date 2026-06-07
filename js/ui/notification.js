// ===== NOTIFICATION MANAGER =====
var notificationManager = {
  _generateId: function () {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },
  add: function (opts) {
    var type = opts.type || "system";
    var title = opts.title || "Notification";
    var message = opts.message || "";
    var priority = opts.priority || "medium";
    var autoToast = opts.autoToast !== false;
    var notification = {
      id: this._generateId(),
      type: type,
      title: title,
      message: message,
      read: false,
      timestamp: Date.now(),
      priority: priority,
      autoToast: autoToast,
    };
    gameState.notifications.unshift(notification);
    if (gameState.notifications.length > 50) {
      gameState.notifications = gameState.notifications.slice(0, 50);
    }
    saveGame();
    updateNotifBadge();
    if (autoToast) {
      showNotification(title + ": " + message);
    }
    return notification;
  },
  getAll: function () {
    return gameState.notifications.slice().sort(function (a, b) {
      return b.timestamp - a.timestamp;
    });
  },
  getUnreadCount: function () {
    return gameState.notifications.filter(function (n) {
      return !n.read;
    }).length;
  },
  markAsRead: function (id) {
    var notif = gameState.notifications.find(function (n) {
      return n.id === id;
    });
    if (notif) {
      notif.read = true;
      saveGame();
      updateNotifBadge();
    }
  },
  markAllRead: function () {
    gameState.notifications.forEach(function (n) {
      n.read = true;
    });
    saveGame();
    updateNotifBadge();
  },
  clearNotification: function (id) {
    gameState.notifications = gameState.notifications.filter(function (n) {
      return n.id !== id;
    });
    saveGame();
    updateNotifBadge();
  },
  removeByType: function (type) {
    gameState.notifications = gameState.notifications.filter(function (n) {
      return n.type !== type;
    });
    saveGame();
    updateNotifBadge();
  },
  getGrouped: function () {
    var now = new Date();
    var todayStr = now.toISOString().split("T")[0];
    var todayMs = new Date(todayStr + "T00:00:00").getTime();
    var groups = { today: [], quests: [], rewards: [], system: [] };
    var all = this.getAll();
    all.forEach(function (n) {
      if (n.type === "quest") {
        groups.quests.push(n);
      } else if (n.type === "reward") {
        groups.rewards.push(n);
      } else if (n.type === "system") {
        groups.system.push(n);
      } else {
        if (n.timestamp >= todayMs) {
          groups.today.push(n);
        } else {
          groups.system.push(n);
        }
      }
    });
    Object.keys(groups).forEach(function (key) {
      groups[key].sort(function (a, b) {
        return b.timestamp - a.timestamp;
      });
    });
    return groups;
  },
};

// ===== NOTIFICATION PANEL =====
function toggleNotificationPanel() {
  var panel = document.getElementById("notificationPanel");
  if (!panel) return;
  var isVisible = panel.style.display !== "none";
  panel.style.display = isVisible ? "none" : "block";
  if (!isVisible) {
    renderNotificationPanel();
    notificationManager.markAllRead();
  }
}

function renderNotificationPanel() {
  var content = document.getElementById("notifPanelContent");
  if (!content) return;
  var groups = notificationManager.getGrouped();
  var allEmpty = Object.values(groups).every(function (arr) {
    return arr.length === 0;
  });
  if (allEmpty) {
    content.innerHTML = '<div class="notif-empty">No notifications yet.</div>';
    return;
  }
  var html = "";
  if (groups.today.length > 0) {
    html += '<div class="notif-section-title">\uD83D\uDCCC Today</div>';
    groups.today.forEach(function (item) {
      html += buildNotifItemHTML(item);
    });
  }
  if (groups.quests.length > 0) {
    html += '<div class="notif-section-title">\uD83C\uDFAF Quests</div>';
    groups.quests.forEach(function (item) {
      html += buildNotifItemHTML(item);
    });
  }
  if (groups.rewards.length > 0) {
    html += '<div class="notif-section-title">\uD83C\uDFC6 Rewards</div>';
    groups.rewards.forEach(function (item) {
      html += buildNotifItemHTML(item);
    });
  }
  if (groups.system.length > 0) {
    html += '<div class="notif-section-title">\u2699 System</div>';
    groups.system.forEach(function (item) {
      html += buildNotifItemHTML(item);
    });
  }
  content.innerHTML = html;
}

function buildNotifItemHTML(item) {
  var typeIcon =
    {
      quest: "\uD83C\uDFAF",
      reward: "\uD83C\uDF81",
      system: "\u2699",
      achievement: "\uD83C\uDFC6",
    }[item.type] || "\uD83D\uDCCC";
  var canClaim =
    item.type === "quest" &&
    gameState.dailyQuest &&
    gameState.dailyQuest.completed &&
    !gameState.dailyQuest.rewardClaimed;
  return (
    '<div class="notif-item ' +
    (item.read ? "notif-item-read" : "") +
    '">' +
    '<div class="notif-item-header">' +
    '<span class="notif-item-icon">' +
    typeIcon +
    "</span>" +
    '<span class="notif-item-title">' +
    item.title +
    "</span></div>" +
    '<div class="notif-item-msg">' +
    item.message +
    "</div>" +
    '<div class="notif-item-actions">' +
    (canClaim
      ? '<button class="notif-action-btn" onclick="claimDailyQuestReward(); toggleNotificationPanel();">\uD83C\uDF81 Claim Reward</button>'
      : "") +
    '<button class="notif-action-btn notif-action-dismiss" onclick="notificationManager.clearNotification(\'' +
    item.id +
    "'); renderNotificationPanel();\">Dismiss</button>" +
    "</div></div>"
  );
}

function updateNotifBadge() {
  var badge = document.getElementById("notifBadge");
  if (!badge) return;
  var count = notificationManager.getUnreadCount();
  if (count > 0) {
    badge.style.display = "flex";
    badge.textContent = count > 9 ? "9+" : count;
  } else {
    badge.style.display = "none";
  }
}

// ===== TOAST NOTIFICATION =====
function showNotification(message) {
  var container = document.getElementById("notificationContainer");
  var notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  container.appendChild(notification);
  setTimeout(function () {
    notification.classList.add("fade-out");
    setTimeout(function () {
      notification.remove();
    }, 500);
  }, 3000);
}
