// ===== TIMER CONFIG =====
const DIFFICULTY_TIMERS = {
  easy: 30,
  medium: 25,
  hard: 20,
};

// ===== READING MAP THEME CYCLING =====
const READING_THEMES = ["forest", "desert", "ice", "castle"];

function getReadingThemeForIndex(index) {
  return READING_THEMES[index % READING_THEMES.length];
}
