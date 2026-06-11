// ===== READING MAP THEME CYCLING =====
const READING_THEMES = ["forest", "desert", "ice", "castle"];

function getReadingThemeForIndex(index) {
  return READING_THEMES[index % READING_THEMES.length];
}

// ===== XP CONFIG =====
const XP_PER_CORRECT = 10;
const XP_PER_LESSON_COMPLETE = 50;
const LESSON_SIZE = 5; // questions per lesson

// ===== QUEST CONFIG =====
const QUEST_DIFFICULTIES = ["easy", "medium", "hard"];

const DAILY_QUESTS = {
  easy: [
    {
      name: "Solve 10 questions",
      type: "questions",
      count: 10,
      xpReward: 50,
      icon: "📝",
    },
    {
      name: "Read 1 story",
      type: "readStory",
      count: 1,
      xpReward: 50,
      icon: "📖",
    },
    { name: "Earn 50 XP", type: "xp", count: 50, xpReward: 50, icon: "⚡" },
  ],
  medium: [
    {
      name: "Complete 3 lessons",
      type: "lessons",
      count: 3,
      xpReward: 100,
      icon: "🎮",
    },
    { name: "Earn 100 XP", type: "xp", count: 100, xpReward: 100, icon: "⚡" },
    {
      name: "80% accuracy in a lesson",
      type: "accuracy",
      count: 1,
      xpReward: 100,
      icon: "🎯",
    },
  ],
  hard: [
    {
      name: "Complete a challenge",
      type: "challenge",
      count: 1,
      xpReward: 150,
      icon: "🏆",
    },
    { name: "Earn 150 XP", type: "xp", count: 150, xpReward: 150, icon: "⚡" },
    {
      name: "10 correct in a row",
      type: "chain10",
      count: 1,
      xpReward: 150,
      icon: "🔥",
    },
  ],
};

const WEEKLY_QUEST = {
  name: "Complete 25 Learning Activities",
  type: "activities",
  count: 25,
  xpReward: 200,
  rewardCoupon: true,
  icon: "🏆",
};

// ===== REWARD POINTS CONFIG =====
const RP_PER_CORRECT = 1;
const RP_PER_LESSON = 5;
const RP_PER_STAR = 2;
const RP_CHAIN_BONUS = {
  2: 1,
  3: 2,
  5: 5,
  10: 10,
};

const REWARD_MILESTONES = [
  { points: 100, prize: "₱250 In-Game Purchase Coupon", emoji: "🎮" },
  { points: 500, prize: "₱250 Pocket Money", emoji: "💰" },
  { points: 1000, prize: "Choose a Book or Toy", emoji: "📚" },
];

const WORLD_UNLOCK_REQUIREMENTS = {
  numberRanch: 0,
  subtractionCanyon: 0,
  multiplicationMountain: 3,
  divisionDesert: 6,
  moneyMarket: 10,
  timeTower: 15,
  fractionForest: 20,
  decimalDocks: 25,
  mathReadingTrail: 30,
  ratioRidge: 35,
};
