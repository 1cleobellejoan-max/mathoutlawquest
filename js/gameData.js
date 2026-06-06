// Math Outlaw Quest - Game Data & Question Generator

// ===== SUPPORT BOARDS =====
const SUPPORT_BOARDS = {
  numberRanch: {
    title: "🧮 Addition Chart",
    content: `
      <div class="support-board">
        <table class="support-table">
          <tr><th>+</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr>
          <tr><th>0</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr>
          <tr><th>1</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td></tr>
          <tr><th>2</th><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td></tr>
          <tr><th>3</th><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td></tr>
          <tr><th>4</th><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td></tr>
          <tr><th>5</th><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td></tr>
          <tr><th>6</th><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td></tr>
          <tr><th>7</th><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td></tr>
          <tr><th>8</th><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td></tr>
          <tr><th>9</th><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td></tr>
          <tr><th>10</th><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td></tr>
        </table>
        <p class="support-tip">💡 <strong>Tip:</strong> Find the first number on the top row and the second number on the side column. Where they meet is your answer!</p>
      </div>
    `,
  },
  subtractionCanyon: {
    title: "🔽 Subtraction Chart",
    content: `
      <div class="support-board">
        <table class="support-table">
          <tr><th>−</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr>
          <tr><th>0</th><td>0</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td></tr>
          <tr><th>1</th><td>1</td><td>0</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td></tr>
          <tr><th>2</th><td>2</td><td>1</td><td>0</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td></tr>
          <tr><th>3</th><td>3</td><td>2</td><td>1</td><td>0</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td></tr>
          <tr><th>4</th><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td></tr>
          <tr><th>5</th><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td><td>−</td><td>−</td><td>−</td><td>−</td><td>−</td></tr>
          <tr><th>6</th><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td><td>−</td><td>−</td><td>−</td><td>−</td></tr>
          <tr><th>7</th><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td><td>−</td><td>−</td><td>−</td></tr>
          <tr><th>8</th><td>8</td><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td><td>−</td><td>−</td></tr>
          <tr><th>9</th><td>9</td><td>8</td><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td><td>−</td></tr>
          <tr><th>10</th><td>10</td><td>9</td><td>8</td><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td></tr>
        </table>
        <p class="support-tip">💡 <strong>Tip:</strong> Find the first number on the side, go right to the second number's column. The number on top is the answer!</p>
      </div>
    `,
  },
  multiplicationMountain: {
    title: "✖️ Multiplication Table",
    content: `
      <div class="support-board">
        <table class="support-table">
          <tr><th>×</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th></tr>
          <tr><th>1</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td></tr>
          <tr><th>2</th><td>2</td><td>4</td><td>6</td><td>8</td><td>10</td><td>12</td><td>14</td><td>16</td><td>18</td><td>20</td><td>22</td><td>24</td></tr>
          <tr><th>3</th><td>3</td><td>6</td><td>9</td><td>12</td><td>15</td><td>18</td><td>21</td><td>24</td><td>27</td><td>30</td><td>33</td><td>36</td></tr>
          <tr><th>4</th><td>4</td><td>8</td><td>12</td><td>16</td><td>20</td><td>24</td><td>28</td><td>32</td><td>36</td><td>40</td><td>44</td><td>48</td></tr>
          <tr><th>5</th><td>5</td><td>10</td><td>15</td><td>20</td><td>25</td><td>30</td><td>35</td><td>40</td><td>45</td><td>50</td><td>55</td><td>60</td></tr>
          <tr><th>6</th><td>6</td><td>12</td><td>18</td><td>24</td><td>30</td><td>36</td><td>42</td><td>48</td><td>54</td><td>60</td><td>66</td><td>72</td></tr>
          <tr><th>7</th><td>7</td><td>14</td><td>21</td><td>28</td><td>35</td><td>42</td><td>49</td><td>56</td><td>63</td><td>70</td><td>77</td><td>84</td></tr>
          <tr><th>8</th><td>8</td><td>16</td><td>24</td><td>32</td><td>40</td><td>48</td><td>56</td><td>64</td><td>72</td><td>80</td><td>88</td><td>96</td></tr>
          <tr><th>9</th><td>9</td><td>18</td><td>27</td><td>36</td><td>45</td><td>54</td><td>63</td><td>72</td><td>81</td><td>90</td><td>99</td><td>108</td></tr>
          <tr><th>10</th><td>10</td><td>20</td><td>30</td><td>40</td><td>50</td><td>60</td><td>70</td><td>80</td><td>90</td><td>100</td><td>110</td><td>120</td></tr>
          <tr><th>11</th><td>11</td><td>22</td><td>33</td><td>44</td><td>55</td><td>66</td><td>77</td><td>88</td><td>99</td><td>110</td><td>121</td><td>132</td></tr>
          <tr><th>12</th><td>12</td><td>24</td><td>36</td><td>48</td><td>60</td><td>72</td><td>84</td><td>96</td><td>108</td><td>120</td><td>132</td><td>144</td></tr>
        </table>
        <p class="support-tip">💡 <strong>Tip:</strong> Find the first number on the top and second on the side. Where they cross = answer! Try skip counting!</p>
      </div>
    `,
  },
  divisionDesert: {
    title: "➗ Division Facts",
    content: `
      <div class="support-board">
        <div class="fact-family-grid">
          <div class="fact-family">
            <h4>÷2 Fact Family</h4>
            <p>2 ÷ 2 = 1,  4 ÷ 2 = 2,  6 ÷ 2 = 3,  8 ÷ 2 = 4,  10 ÷ 2 = 5</p>
            <p>12 ÷ 2 = 6,  14 ÷ 2 = 7,  16 ÷ 2 = 8,  18 ÷ 2 = 9,  20 ÷ 2 = 10</p>
          </div>
          <div class="fact-family">
            <h4>÷3 Fact Family</h4>
            <p>3 ÷ 3 = 1,  6 ÷ 3 = 2,  9 ÷ 3 = 3,  12 ÷ 3 = 4,  15 ÷ 3 = 5</p>
            <p>18 ÷ 3 = 6,  21 ÷ 3 = 7,  24 ÷ 3 = 8,  27 ÷ 3 = 9,  30 ÷ 3 = 10</p>
          </div>
          <div class="fact-family">
            <h4>÷4 Fact Family</h4>
            <p>4 ÷ 4 = 1,  8 ÷ 4 = 2,  12 ÷ 4 = 3,  16 ÷ 4 = 4,  20 ÷ 4 = 5</p>
            <p>24 ÷ 4 = 6,  28 ÷ 4 = 7,  32 ÷ 4 = 8,  36 ÷ 4 = 9,  40 ÷ 4 = 10</p>
          </div>
          <div class="fact-family">
            <h4>÷5 Fact Family</h4>
            <p>5 ÷ 5 = 1,  10 ÷ 5 = 2,  15 ÷ 5 = 3,  20 ÷ 5 = 4,  25 ÷ 5 = 5</p>
            <p>30 ÷ 5 = 6,  35 ÷ 5 = 7,  40 ÷ 5 = 8,  45 ÷ 5 = 9,  50 ÷ 5 = 10</p>
          </div>
        </div>
        <p class="support-tip">💡 <strong>Tip:</strong> Division is the opposite of multiplication! If you know 6 × 4 = 24, then 24 ÷ 4 = 6!</p>
      </div>
    `,
  },
};
// ===== WORLDS =====
const WORLDS = {
  numberRanch: {
    id: "numberRanch",
    name: "Number Ranch",
    emoji: "🌾",
    color: "#4CAF50",
    description: "Addition & Number Sense",
    unlockXP: 0,
    difficulties: ["easy", "medium", "hard"],
    supportBoard: "numberRanch",
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
    supportBoard: "subtractionCanyon",
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
    supportBoard: "multiplicationMountain",
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
    supportBoard: "divisionDesert",
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
  // ===== NEW: Math Reading Trail =====
  mathReadingTrail: {
    id: "mathReadingTrail",
    name: "Math Reading Trail",
    emoji: "📖",
    color: "#00BCD4",
    description: "Read & Solve Word Problems",
    unlockXP: 500,
    difficulties: ["easy", "medium", "hard"],
    vocabulary: {
      contained: "Contained means something is inside or held within.",
      remaining: "Remaining means what is left after some are taken away.",
      altogether: "Altogether means the total or sum of everything combined.",
      each: "Each means every one of a group, considered individually.",
      total: "Total means the whole amount after adding everything.",
      shared: "Shared means divided equally among a group.",
      spent: "Spent means used or paid for something.",
      all: "All means the entire amount or every item in a group.",
    },
    stories: {
      easy: [
        {
          text: "Maria bought 4 bags of apples. Each bag <span class='vocab-word' data-vocab='contained'>contained</span> 6 apples. She gave 5 apples to her friends.",
          questions: [
            {
              q: "How many apples did Maria buy <span class='vocab-word' data-vocab='altogether'>altogether</span>?",
              answer: 24,
              hint: "Multiply the number of bags by the apples in each bag: 4 × 6",
            },
            {
              q: "How many apples are <span class='vocab-word' data-vocab='remaining'>remaining</span> after giving some away?",
              answer: 19,
              hint: "Take the total apples and subtract what she gave away: 24 − 5",
            },
            {
              q: "Which operation should you use first: addition, subtraction, or multiplication?",
              answer: "multiplication",
              hint: "Think: Do you add, subtract, or multiply to find the total apples?",
            },
          ],
        },
        {
          text: "Tom has 12 candies. He <span class='vocab-word' data-vocab='shared'>shared</span> them equally among 3 friends.",
          questions: [
            {
              q: "How many candies does <span class='vocab-word' data-vocab='each'>each</span> friend get?",
              answer: 4,
              hint: "Divide the candies by the number of friends: 12 ÷ 3",
            },
            {
              q: "If Tom <span class='vocab-word' data-vocab='spent'>spent</span> ₱2 on each candy, how much did he spend <span class='vocab-word' data-vocab='altogether'>altogether</span>?",
              answer: 24,
              hint: "Multiply the cost per candy by total candies: 2 × 12",
            },
          ],
        },
      ],
      medium: [
        {
          text: "A farmer has 36 eggs. He places them into cartons. <span class='vocab-word' data-vocab='each'>Each</span> carton holds 6 eggs. After packing, he sells 2 cartons.",
          questions: [
            {
              q: "How many cartons can the farmer fill <span class='vocab-word' data-vocab='altogether'>altogether</span>?",
              answer: 6,
              hint: "Divide the eggs by how many fit in each carton: 36 ÷ 6",
            },
            {
              q: "After selling 2 cartons, how many eggs are <span class='vocab-word' data-vocab='remaining'>remaining</span>?",
              answer: 24,
              hint: "Cartons left: 6 − 2 = 4. Then multiply by eggs per carton: 4 × 6",
            },
            {
              q: "If each egg sells for ₱3, how much money does the farmer earn from 2 cartons?",
              answer: 36,
              hint: "2 cartons × 6 eggs × ₱3 = ? First multiply 2 × 6, then × 3",
            },
          ],
        },
        {
          text: "A baker bakes 48 cookies. She puts them into boxes of 8. <span class='vocab-word' data-vocab='each'>Each</span> box sells for ₱25. She sells 4 boxes.",
          questions: [
            {
              q: "How many boxes of cookies does the baker make <span class='vocab-word' data-vocab='total'>total</span>?",
              answer: 6,
              hint: "Divide the cookies by the number per box: 48 ÷ 8",
            },
            {
              q: "How much money does she earn from selling 4 boxes?",
              answer: 100,
              hint: "Multiply the number of boxes sold by the price per box: 4 × 25",
            },
            {
              q: "How many cookies are <span class='vocab-word' data-vocab='remaining'>remaining</span> unsold?",
              answer: 16,
              hint: "Boxes unsold: 6 − 4 = 2. Then 2 × 8 cookies per box",
            },
          ],
        },
      ],
      hard: [
        {
          text: "A school is planning a field trip. There are 120 students. <span class='vocab-word' data-vocab='each'>Each</span> bus can carry 30 students. The school rents 3 buses. <span class='vocab-word' data-vocab='each'>Each</span> bus costs ₱450 to rent.",
          questions: [
            {
              q: "How many buses are needed to carry <span class='vocab-word' data-vocab='altogether'>all</span> 120 students?",
              answer: 4,
              hint: "Divide total students by capacity per bus: 120 ÷ 30",
            },
            {
              q: "If the school rents only 3 buses, how many students are left <span class='vocab-word' data-vocab='remaining'>remaining</span>?",
              answer: 30,
              hint: "Students that fit in 3 buses: 3 × 30 = 90. Then 120 − 90",
            },
            {
              q: "What is the <span class='vocab-word' data-vocab='total'>total</span> cost of renting 3 buses?",
              answer: 1350,
              hint: "Multiply the number of buses by the cost per bus: 3 × 450",
            },
            {
              q: "If <span class='vocab-word' data-vocab='each'>each</span> student pays ₱15 for the trip, how much money is collected <span class='vocab-word' data-vocab='altogether'>altogether</span>?",
              answer: 1800,
              hint: "Multiply the number of students by the fee: 120 × 15",
            },
          ],
        },
      ],
    },
    currentStoryIndex: 0,
    currentQuestionIndex: 0,
    generateQuestion: function (difficulty) {
      const stories = this.stories[difficulty] || this.stories.easy;
      if (!stories || stories.length === 0) return null;
      const storyIndex = this.currentStoryIndex % stories.length;
      const story = stories[storyIndex];
      const qIndex = this.currentQuestionIndex % (story.questions.length || 1);
      // Return story context + current question
      const qData = story.questions[qIndex];
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex >= story.questions.length) {
        this.currentQuestionIndex = 0;
        this.currentStoryIndex++;
      }
      return {
        question: `${story.text}<br><br><strong>Question ${qIndex + 1}:</strong> ${qData.q}`,
        answer: qData.answer,
        difficulty,
        world: "mathReadingTrail",
        storyText: story.text,
        hint: qData.hint,
        vocabulary: story.vocabulary || [],
      };
    },
    getHint: function (question) {
      // Try to extract stored hint from the question object
      return "Read the story carefully. Look for key numbers and decide which operation to use (+, −, ×, ÷).";
    },
  },
};

// ===== XP THRESHOLDS FOR SUPPORT VISIBILITY =====
function getSupportVisibility(worldId) {
  const progress = gameState ? gameState.worldProgress[worldId] : null;
  if (!progress) return 1;
  const correct = progress.correct || 0;
  if (correct < 10) return 1; // Beginner: 100%
  if (correct < 30) return 0.75; // Intermediate: 75%
  if (correct < 60) return 0.5; // Skilled: 50%
  if (correct < 100) return 0.25; // Advanced: 25%
  return 0; // Master: 0%
}

// ===== TIMER CONFIG =====
const DIFFICULTY_TIMERS = {
  easy: 30,
  medium: 25,
  hard: 20,
};

// ===== CHAIN BONUS CONFIG =====
function getChainBonus(chain) {
  if (chain >= 10) return 3;
  if (chain >= 5) return 1;
  if (chain >= 3) return 0.5;
  return 0;
}

function getChainEmoji(chain) {
  if (chain >= 10) return "🔥🔥🔥";
  if (chain >= 5) return "🔥🔥";
  if (chain >= 3) return "🔥";
  return "";
}

// ===== Helper Functions =====
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
