// Math Outlaw Quest - Game Data & Question Generator

const WORLDS = {
  numberRanch: {
    id: "numberRanch",
    name: "Number Ranch",
    emoji: "🌾",
    color: "#4CAF50",
    description: "Addition & Number Sense",
    unlockXP: 0,
    difficulties: ["easy", "medium", "hard"],
    generateQuestion: function (difficulty) {
      let a, b, answer, questionText;
      switch (difficulty) {
        case "easy":
          a = rand(1, 20);
          b = rand(1, 20);
          questionText = `${a} + ${b}`;
          answer = a + b;
          break;
        case "medium":
          a = rand(20, 99);
          b = rand(20, 99);
          questionText = `${a} + ${b}`;
          answer = a + b;
          break;
        case "hard":
          a = rand(50, 500);
          b = rand(50, 500);
          questionText = `${a} + ${b}`;
          answer = a + b;
          break;
      }
      return {
        question: questionText,
        answer,
        difficulty,
        world: "numberRanch",
      };
    },
    getHint: function (question) {
      const parts = question.split(" + ");
      const a = parseInt(parts[0]);
      const b = parseInt(parts[1]);
      if (a > 10 || b > 10) {
        return `Try breaking it apart:\n${Math.floor(a / 10) * 10} + ${a % 10} = ${a}\n${Math.floor(b / 10) * 10} + ${b % 10} = ${b}\nThen add the tens and ones separately.`;
      }
      return `Count up from ${a} by ${b} steps.`;
    },
  },
  subtractionCanyon: {
    id: "subtractionCanyon",
    name: "Subtraction Canyon",
    emoji: "🏜️",
    color: "#FF9800",
    description: "Subtraction & Borrowing",
    unlockXP: 0,
    difficulties: ["easy", "medium", "hard"],
    generateQuestion: function (difficulty) {
      let a, b, answer, questionText;
      switch (difficulty) {
        case "easy":
          a = rand(10, 50);
          b = rand(1, 9);
          questionText = `${a} - ${b}`;
          answer = a - b;
          break;
        case "medium":
          a = rand(30, 99);
          b = rand(10, a - 1);
          questionText = `${a} - ${b}`;
          answer = a - b;
          break;
        case "hard":
          a = rand(100, 999);
          b = rand(50, a - 1);
          questionText = `${a} - ${b}`;
          answer = a - b;
          break;
      }
      return {
        question: questionText,
        answer,
        difficulty,
        world: "subtractionCanyon",
      };
    },
    getHint: function (question) {
      const parts = question.split(" - ");
      const a = parseInt(parts[0]);
      const b = parseInt(parts[1]);
      const aOnes = a % 10;
      const bOnes = b % 10;
      if (bOnes > aOnes) {
        return `Can ${aOnes} take away ${bOnes}?\n\nTry borrowing from the tens place!\n${Math.floor(a / 10)} tens and ${aOnes} ones → borrow 1 ten = ${Math.floor(a / 10) - 1} tens and ${aOnes + 10} ones`;
      }
      return `Just subtract normally:\n${a} - ${b} = ?\n\nStart with the ones place.`;
    },
  },
  multiplicationMountain: {
    id: "multiplicationMountain",
    name: "Multiplication Mountain",
    emoji: "⛰️",
    color: "#9C27B0",
    description: "Multiplication Facts",
    unlockXP: 100,
    difficulties: ["easy", "medium", "hard"],
    progression: [2, 5, 10, 3, 4, 6, 7, 8, 9],
    currentFactIndex: 0,
    generateQuestion: function (difficulty, factIndex) {
      let a, b, answer, questionText;
      const fact = this.progression[factIndex % this.progression.length];
      switch (difficulty) {
        case "easy":
          a = fact;
          b = rand(1, 5);
          questionText = `${a} × ${b}`;
          answer = a * b;
          break;
        case "medium":
          a = fact;
          b = rand(2, 9);
          questionText = `${a} × ${b}`;
          answer = a * b;
          break;
        case "hard":
          a = fact;
          b = rand(5, 12);
          questionText = `${a} × ${b}`;
          answer = a * b;
          break;
      }
      return {
        question: questionText,
        answer,
        difficulty,
        world: "multiplicationMountain",
        fact: fact,
      };
    },
    getHint: function (question) {
      const parts = question.split(" × ");
      const a = parseInt(parts[0]);
      const b = parseInt(parts[1]);
      if (b <= 5) {
        return (
          `Think of it as repeated addition:\n${a} × ${b} = ${a} + ${a} + ${a}` +
          (b > 3 ? ` + ${a} + ${a}` : "")
        );
      }
      return `Skip count by ${a}s:\n${Array.from({ length: b }, (_, i) => a * (i + 1)).join("\n")}`;
    },
  },
  divisionDesert: {
    id: "divisionDesert",
    name: "Division Desert",
    emoji: "🏝️",
    color: "#F44336",
    description: "Division & Equal Sharing",
    unlockXP: 200,
    difficulties: ["easy", "medium", "hard"],
    generateQuestion: function (difficulty) {
      let a, b, answer, questionText;
      switch (difficulty) {
        case "easy":
          answer = rand(2, 5);
          b = rand(2, 5);
          a = answer * b;
          questionText = `${a} ÷ ${b}`;
          break;
        case "medium":
          answer = rand(3, 9);
          b = rand(3, 9);
          a = answer * b;
          questionText = `${a} ÷ ${b}`;
          break;
        case "hard":
          answer = rand(6, 12);
          b = rand(4, 12);
          a = answer * b;
          questionText = `${a} ÷ ${b}`;
          break;
      }
      return {
        question: questionText,
        answer,
        difficulty,
        world: "divisionDesert",
      };
    },
    getHint: function (question) {
      const parts = question.split(" ÷ ");
      const a = parseInt(parts[0]);
      const b = parseInt(parts[1]);
      return `Imagine sharing ${a} cookies equally among ${b} friends.\n\nHow many cookies does each friend get?\n\nTry: What number × ${b} = ${a}?`;
    },
  },
  moneyMarket: {
    id: "moneyMarket",
    name: "Money Market",
    emoji: "💰",
    color: "#FFD700",
    description: "Counting Money",
    unlockXP: 400,
    difficulties: ["easy", "medium", "hard"],
    generateQuestion: function (difficulty) {
      let a, b, answer, questionText;
      switch (difficulty) {
        case "easy":
          a = rand(1, 10) * 5;
          b = rand(1, 10) * 5;
          questionText = `₱${a} + ₱${b}`;
          answer = a + b;
          break;
        case "medium":
          a = rand(5, 50);
          b = rand(5, a - 1);
          questionText = `You have ₱${a}.\nYou spend ₱${b}.\nHow much is left?`;
          answer = a - b;
          break;
        case "hard":
          a = rand(10, 100);
          b = rand(10, 100);
          const c = rand(10, 100);
          questionText = `₱${a} + ₱${b} + ₱${c}`;
          answer = a + b + c;
          break;
      }
      return {
        question: questionText,
        answer,
        difficulty,
        world: "moneyMarket",
      };
    },
    getHint: function (question) {
      if (question.includes("spend")) {
        const matches = question.match(/₱(\d+)/g);
        const a = parseInt(matches[0].replace("₱", ""));
        const b = parseInt(matches[1].replace("₱", ""));
        return `You start with ₱${a}.\nYou spend ₱${b}.\n\nThink: ${a} - ${b} = ?\n\nCount backward from ${a} by ${b} steps.`;
      }
      return `Add the amounts together.\n\nTip: For ₱ amounts, just add the numbers normally!`;
    },
  },
  timeTower: {
    id: "timeTower",
    name: "Time Tower",
    emoji: "🕐",
    color: "#00BCD4",
    description: "Reading Clocks",
    unlockXP: 600,
    difficulties: ["easy", "medium", "hard"],
    generateQuestion: function (difficulty) {
      let hours, minutes, answer, questionText;
      switch (difficulty) {
        case "easy":
          hours = rand(1, 12);
          minutes = [0, 15, 30, 45][rand(0, 3)];
          questionText = `What time is shown?\n🕐 ${hours}:${String(minutes).padStart(2, "0")}`;
          answer = `${hours}:${String(minutes).padStart(2, "0")}`;
          break;
        case "medium":
          hours = rand(1, 11);
          minutes = rand(0, 59);
          const targetHour = hours + 1;
          questionText = `It is ${hours}:${String(minutes).padStart(2, "0")}.\nHow many minutes until ${targetHour}:00?`;
          answer = 60 - minutes;
          break;
        case "hard":
          const h1 = rand(1, 11);
          const m1 = rand(0, 59);
          const h2 = h1 + rand(1, 3);
          const m2 = rand(0, 59);
          const total1 = h1 * 60 + m1;
          const total2 = h2 * 60 + m2;
          questionText = `From ${h1}:${String(m1).padStart(2, "0")}\nTo ${h2}:${String(m2).padStart(2, "0")}\nHow many minutes?`;
          answer = total2 - total1;
          break;
      }
      return { question: questionText, answer, difficulty, world: "timeTower" };
    },
    getHint: function (question) {
      if (question.includes("until")) {
        const matches = question.match(/(\d+):(\d+)/);
        if (matches) {
          const mins = parseInt(matches[2]);
          return `From ${matches[1]}:${matches[2]} to ${parseInt(matches[1]) + 1}:00\n\nThere are ${60 - mins} minutes left.\n\nThink: 60 - ${mins} = ?`;
        }
      }
      return `Think about how many minutes are in an hour.\n\nRemember: 60 minutes = 1 hour`;
    },
  },
  fractionForest: {
    id: "fractionForest",
    name: "Fraction Forest",
    emoji: "🍕",
    color: "#8BC34A",
    description: "Fractions",
    unlockXP: 800,
    difficulties: ["easy", "medium", "hard"],
    generateQuestion: function (difficulty) {
      let answer, questionText;
      switch (difficulty) {
        case "easy": {
          const total = rand(2, 4);
          const eaten = rand(1, total - 1);
          const p = "🍕".repeat(total);
          questionText = `${p}\n${eaten} slice${eaten > 1 ? "s" : ""} eaten\nWhat fraction remains?`;
          answer = `${total - eaten}/${total}`;
          break;
        }
        case "medium": {
          const total = rand(4, 8);
          const eaten = rand(1, total - 1);
          const p = "🍕".repeat(total);
          questionText = `${p}\n${eaten} slice${eaten > 1 ? "s" : ""} eaten\nWhat fraction remains?\n(Simplify if possible)`;
          const num = total - eaten;
          const gcd = findGCD(num, total);
          answer = `${num / gcd}/${total / gcd}`;
          break;
        }
        case "hard": {
          const total = rand(6, 12);
          const eaten = rand(2, total - 2);
          const p = "🍕".repeat(total);
          questionText = `${p}\n${eaten} slice${eaten > 1 ? "s" : ""} eaten\nWhat fraction of the pizza was eaten?\n(Simplify if possible)`;
          const gcd = findGCD(eaten, total);
          answer = `${eaten / gcd}/${total / gcd}`;
          break;
        }
      }
      return {
        question: questionText,
        answer,
        difficulty,
        world: "fractionForest",
      };
    },
    getHint: function (question) {
      const matches = question.match(/(\d+) slice/);
      if (matches) {
        const totalSlices = (question.match(/🍕/g) || []).length;
        const eaten = parseInt(matches[1]);
        const remaining = totalSlices - eaten;
        return `Total slices: ${totalSlices}\nEaten: ${eaten}\nRemaining: ${remaining}\n\nFraction remaining = ${remaining}/${totalSlices}`;
      }
      return `The bottom number (denominator) is the total.\nThe top number (numerator) is what's left.\n\nThink: remaining slices ÷ total slices`;
    },
  },
  decimalDocks: {
    id: "decimalDocks",
    name: "Decimal Docks",
    emoji: "⚓",
    color: "#607D8B",
    description: "Decimals & Money",
    unlockXP: 1000,
    difficulties: ["easy", "medium", "hard"],
    generateQuestion: function (difficulty) {
      let a, b, answer, questionText;
      switch (difficulty) {
        case "easy":
          a = rand(1, 10);
          b = rand(1, 10);
          questionText = `₱${a}.${rand(0, 9)}${rand(0, 9)} + ₱${b}.${rand(0, 9)}${rand(0, 9)}`;
          answer = eval(questionText.replace(/₱/g, "").replace(/×/g, "*"));
          break;
        case "medium":
          a = rand(5, 50);
          b = rand(1, a - 1);
          const aDec = rand(0, 99);
          const bDec = rand(0, aDec > 0 ? aDec - 1 : aDec);
          questionText = `₱${a}.${String(aDec).padStart(2, "0")} - ₱${b}.${String(bDec).padStart(2, "0")}`;
          answer = parseFloat((a + aDec / 100 - b - bDec / 100).toFixed(2));
          break;
        case "hard":
          a = parseFloat((rand(10, 100) + rand(0, 99) / 100).toFixed(2));
          b = parseFloat((rand(10, 100) + rand(0, 99) / 100).toFixed(2));
          const c = parseFloat((rand(10, 100) + rand(0, 99) / 100).toFixed(2));
          questionText = `₱${a.toFixed(2)} + ₱${b.toFixed(2)} + ₱${c.toFixed(2)}`;
          answer = parseFloat((a + b + c).toFixed(2));
          break;
      }
      return {
        question: questionText,
        answer,
        difficulty,
        world: "decimalDocks",
      };
    },
    getHint: function (question) {
      if (question.includes("+")) {
        return `Add decimals like you add money!\n\nLine up the decimal points:\n  ₱${question.match(/₱([\d.]+)/g).join("\n+ ₱")}\n  = ?\n\nAdd the hundredths first, then tenths, then whole numbers.`;
      }
      return `Subtract decimals carefully.\n\nLine up the decimal points and borrow if needed.\n\nRemember: ₱1.00 = 100 centavos`;
    },
  },
};

// Helper Functions
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function findGCD(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}
