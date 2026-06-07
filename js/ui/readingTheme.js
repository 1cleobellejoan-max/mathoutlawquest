// ===== READING THEME SYSTEM =====
function applyReadingTheme(themeName) {
  var config = THEME_CONFIGS[themeName];
  if (!config) {
    clearReadingTheme();
    return;
  }
  var appEl = document.getElementById("app");
  var decorEl = document.getElementById("themeDecorations");
  var gameEl = document.getElementById("game");
  if (appEl) {
    appEl.style.background = config.background;
    appEl.style.backgroundImage =
      "linear-gradient(135deg, " +
      config.background +
      ", " +
      adjustColor(config.background, -20) +
      ")";
  }
  if (gameEl) {
    gameEl.style.background = "transparent";
  }
  if (decorEl) {
    decorEl.innerHTML = "";
    config.decorations.forEach(function (deco) {
      var el = document.createElement("div");
      el.className = "deco";
      el.textContent = deco.emoji;
      el.style.top = deco.top || "auto";
      el.style.left = deco.left || "auto";
      el.style.right = deco.right || "auto";
      el.style.fontSize = deco.size || "2rem";
      el.style.opacity = deco.opacity || 0.12;
      decorEl.appendChild(el);
    });
  }
}

function clearReadingTheme() {
  var appEl = document.getElementById("app");
  var decorEl = document.getElementById("themeDecorations");
  var gameEl = document.getElementById("game");
  if (appEl) {
    appEl.style.background = "";
    appEl.style.backgroundImage = "";
  }
  if (gameEl) {
    gameEl.style.background = "";
  }
  if (decorEl) {
    decorEl.innerHTML = "";
  }
}

function adjustColor(hex, amount) {
  if (!hex) return hex;
  hex = hex.replace("#", "");
  var num = parseInt(hex, 16);
  var r = Math.min(255, Math.max(0, (num >> 16) + amount));
  var g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  var b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
