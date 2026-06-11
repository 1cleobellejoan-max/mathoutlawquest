// ===== WORLDS =====
const WORLDS = {
  numberRanch: {
    id: "numberRanch",
    name: "Number Ranch",
    emoji: "\u{1F33E}",
    color: "#4CAF50",
    description: "Addition & Number Sense",
    difficulties: ["easy", "medium", "hard"],
    supportBoard: "numberRanch",
    generateQuestion: function (difficulty) {
      let a, b, answer, questionText;
      switch (difficulty) {
        case "easy":
          a = rand(1, 20);
          b = rand(1, 20);
          questionText = a + " + " + b;
          answer = a + b;
          break;
        case "medium":
          a = rand(20, 99);
          b = rand(20, 99);
          questionText = a + " + " + b;
          answer = a + b;
          break;
        case "hard":
          a = rand(50, 500);
          b = rand(50, 500);
          questionText = a + " + " + b;
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
      var parts = question.split(" + ");
      var a = parseInt(parts[0]);
      var b = parseInt(parts[1]);
      if (a > 10 || b > 10) {
        return (
          "Try breaking it apart:\n" +
          Math.floor(a / 10) * 10 +
          " + " +
          (a % 10) +
          " = " +
          a +
          "\n" +
          Math.floor(b / 10) * 10 +
          " + " +
          (b % 10) +
          " = " +
          b +
          "\nThen add the tens and ones separately."
        );
      }
      return "Count up from " + a + " by " + b + " steps.";
    },
  },
  subtractionCanyon: {
    id: "subtractionCanyon",
    name: "Subtraction Canyon",
    emoji: "\u{1F3DC}\uFE0F",
    color: "#FF9800",
    description: "Subtraction & Borrowing",
    difficulties: ["easy", "medium", "hard"],
    supportBoard: "subtractionCanyon",
    generateQuestion: function (difficulty) {
      let a, b, answer, questionText;
      switch (difficulty) {
        case "easy":
          a = rand(10, 50);
          b = rand(1, 9);
          questionText = a + " - " + b;
          answer = a - b;
          break;
        case "medium":
          a = rand(30, 99);
          b = rand(10, a - 1);
          questionText = a + " - " + b;
          answer = a - b;
          break;
        case "hard":
          a = rand(100, 999);
          b = rand(50, a - 1);
          questionText = a + " - " + b;
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
      var parts = question.split(" - ");
      var a = parseInt(parts[0]);
      var b = parseInt(parts[1]);
      var aOnes = a % 10;
      var bOnes = b % 10;
      if (bOnes > aOnes) {
        return (
          "Can " +
          aOnes +
          " take away " +
          bOnes +
          "?\n\nTry borrowing from the tens place!\n" +
          Math.floor(a / 10) +
          " tens and " +
          aOnes +
          " ones \u2192 borrow 1 ten = " +
          (Math.floor(a / 10) - 1) +
          " tens and " +
          (aOnes + 10) +
          " ones"
        );
      }
      return (
        "Just subtract normally:\n" +
        a +
        " - " +
        b +
        " = ?\n\nStart with the ones place."
      );
    },
  },
  multiplicationMountain: {
    id: "multiplicationMountain",
    name: "Multiplication Mountain",
    emoji: "\u26F0\uFE0F",
    color: "#9C27B0",
    description: "Multiplication Facts",
    difficulties: ["easy", "medium", "hard"],
    supportBoard: "multiplicationMountain",
    progression: [2, 5, 10, 3, 4, 6, 7, 8, 9],
    currentFactIndex: 0,
    generateQuestion: function (difficulty, factIndex) {
      let a, b, answer, questionText;
      var fact = this.progression[factIndex % this.progression.length];
      switch (difficulty) {
        case "easy":
          a = fact;
          b = rand(1, 5);
          questionText = a + " \u00D7 " + b;
          answer = a * b;
          break;
        case "medium":
          a = fact;
          b = rand(2, 9);
          questionText = a + " \u00D7 " + b;
          answer = a * b;
          break;
        case "hard":
          a = fact;
          b = rand(5, 12);
          questionText = a + " \u00D7 " + b;
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
      var parts = question.split(" \u00D7 ");
      var a = parseInt(parts[0]);
      var b = parseInt(parts[1]);
      if (b <= 5) {
        return (
          "Think of it as repeated addition:\n" +
          a +
          " \u00D7 " +
          b +
          " = " +
          a +
          " + " +
          a +
          " + " +
          a +
          (b > 3 ? " + " + a + " + " + a : "")
        );
      }
      var skipCounts = [];
      for (var i = 0; i < b; i++) {
        skipCounts.push(a * (i + 1));
      }
      return "Skip count by " + a + "s:\n" + skipCounts.join("\n");
    },
  },
  divisionDesert: {
    id: "divisionDesert",
    name: "Division Desert",
    emoji: "\u{1F3DD}\uFE0F",
    color: "#F44336",
    description: "Division & Equal Sharing",
    difficulties: ["easy", "medium", "hard"],
    supportBoard: "divisionDesert",
    generateQuestion: function (difficulty) {
      let a, b, answer, questionText;
      switch (difficulty) {
        case "easy":
          answer = rand(2, 5);
          b = rand(2, 5);
          a = answer * b;
          questionText = a + " \u00F7 " + b;
          break;
        case "medium":
          answer = rand(3, 9);
          b = rand(3, 9);
          a = answer * b;
          questionText = a + " \u00F7 " + b;
          break;
        case "hard":
          answer = rand(6, 12);
          b = rand(4, 12);
          a = answer * b;
          questionText = a + " \u00F7 " + b;
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
      var parts = question.split(" \u00F7 ");
      var a = parseInt(parts[0]);
      var b = parseInt(parts[1]);
      return (
        "Imagine sharing " +
        a +
        " cookies equally among " +
        b +
        " friends.\n\nHow many cookies does each friend get?\n\nTry: What number \u00D7 " +
        b +
        " = " +
        a +
        "?"
      );
    },
  },
  moneyMarket: {
    id: "moneyMarket",
    name: "Money Market",
    emoji: "\u{1F4B0}",
    color: "#FFD700",
    description: "Counting Money",
    difficulties: ["easy", "medium", "hard"],
    generateQuestion: function (difficulty) {
      let a, b, answer, questionText;
      switch (difficulty) {
        case "easy":
          a = rand(1, 10) * 5;
          b = rand(1, 10) * 5;
          questionText = "\u20B1" + a + " + \u20B1" + b;
          answer = a + b;
          break;
        case "medium":
          a = rand(5, 50);
          b = rand(5, a - 1);
          questionText =
            "You have \u20B1" +
            a +
            ".\nYou spend \u20B1" +
            b +
            ".\nHow much is left?";
          answer = a - b;
          break;
        case "hard":
          a = rand(10, 100);
          b = rand(10, 100);
          var c = rand(10, 100);
          questionText = "\u20B1" + a + " + \u20B1" + b + " + \u20B1" + c;
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
        var matches = question.match(/\u20B1(\d+)/g);
        var a = parseInt(matches[0].replace("\u20B1", ""));
        var b = parseInt(matches[1].replace("\u20B1", ""));
        return (
          "You start with \u20B1" +
          a +
          ".\nYou spend \u20B1" +
          b +
          ".\n\nThink: " +
          a +
          " - " +
          b +
          " = ?\n\nCount backward from " +
          a +
          " by " +
          b +
          " steps."
        );
      }
      return "Add the amounts together.\n\nTip: For \u20B1 amounts, just add the numbers normally!";
    },
  },
  timeTower: {
    id: "timeTower",
    name: "Time Tower",
    emoji: "\u{1F550}",
    color: "#00BCD4",
    description: "Reading Clocks",
    difficulties: ["easy", "medium", "hard"],
    generateQuestion: function (difficulty) {
      let hours, minutes, answer, questionText;
      switch (difficulty) {
        case "easy":
          hours = rand(1, 12);
          minutes = [0, 15, 30, 45][rand(0, 3)];
          var clockSvg = createAnalogClock(hours, minutes);
          questionText = clockSvg + "\n\nWhat time is shown?";
          answer = hours + ":" + String(minutes).padStart(2, "0");
          break;
        case "medium":
          hours = rand(1, 11);
          minutes = rand(0, 59);
          var targetHour = hours + 1;
          var clockSvgMedium = createAnalogClock(hours, minutes, 140);
          questionText =
            clockSvgMedium +
            "\n\nIt is shown on the clock above.\nHow many minutes until " +
            targetHour +
            ":00?";
          answer = 60 - minutes;
          break;
        case "hard":
          var h1 = rand(1, 11);
          var m1 = rand(0, 59);
          var h2 = h1 + rand(1, 3);
          var m2 = rand(0, 59);
          var total1 = h1 * 60 + m1;
          var total2 = h2 * 60 + m2;
          var clockSvgHard = createAnalogClock(h1, m1, 140);
          questionText =
            clockSvgHard +
            "\n\nFrom the time shown above,\nTo " +
            h2 +
            ":" +
            String(m2).padStart(2, "0") +
            "\nHow many minutes have passed?";
          answer = total2 - total1;
          break;
      }
      return { question: questionText, answer, difficulty, world: "timeTower" };
    },
    getHint: function (question) {
      if (question.includes("until")) {
        var matches = question.match(/(\d+):(\d+)/);
        if (matches) {
          var mins = parseInt(matches[2]);
          return (
            "From " +
            matches[1] +
            ":" +
            matches[2] +
            " to " +
            (parseInt(matches[1]) + 1) +
            ":00\n\nThere are " +
            (60 - mins) +
            " minutes left.\n\nThink: 60 - " +
            mins +
            " = ?"
          );
        }
      }
      return "Think about how many minutes are in an hour.\n\nRemember: 60 minutes = 1 hour";
    },
  },
  fractionForest: {
    id: "fractionForest",
    name: "Fraction Forest",
    emoji: "\u{1F355}",
    color: "#8BC34A",
    description: "Fractions",
    difficulties: ["easy", "medium", "hard"],
    generateQuestion: function (difficulty) {
      let answer, questionText;
      switch (difficulty) {
        case "easy": {
          var total = rand(2, 4);
          var eaten = rand(1, total - 1);
          var p = "\u{1F355}".repeat(total);
          questionText =
            p +
            "\n" +
            eaten +
            " slice" +
            (eaten > 1 ? "s" : "") +
            " eaten\nWhat fraction remains?";
          answer = total - eaten + "/" + total;
          break;
        }
        case "medium": {
          var total2 = rand(4, 8);
          var eaten2 = rand(1, total2 - 1);
          var p2 = "\u{1F355}".repeat(total2);
          questionText =
            p2 +
            "\n" +
            eaten2 +
            " slice" +
            (eaten2 > 1 ? "s" : "") +
            " eaten\nWhat fraction remains?\n(Simplify if possible)";
          var num = total2 - eaten2;
          var gcd = findGCD(num, total2);
          answer = num / gcd + "/" + total2 / gcd;
          break;
        }
        case "hard": {
          var total3 = rand(6, 12);
          var eaten3 = rand(2, total3 - 2);
          var p3 = "\u{1F355}".repeat(total3);
          questionText =
            p3 +
            "\n" +
            eaten3 +
            " slice" +
            (eaten3 > 1 ? "s" : "") +
            " eaten\nWhat fraction of the pizza was eaten?\n(Simplify if possible)";
          var gcd2 = findGCD(eaten3, total3);
          answer = eaten3 / gcd2 + "/" + total3 / gcd2;
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
      var matches = question.match(/(\d+) slice/);
      if (matches) {
        var totalSlices = (question.match(/\u{1F355}/g) || []).length;
        var eaten = parseInt(matches[1]);
        var remaining = totalSlices - eaten;
        return (
          "Total slices: " +
          totalSlices +
          "\nEaten: " +
          eaten +
          "\nRemaining: " +
          remaining +
          "\n\nFraction remaining = " +
          remaining +
          "/" +
          totalSlices
        );
      }
      return "The bottom number (denominator) is the total.\nThe top number (numerator) is what's left.\n\nThink: remaining slices \u00F7 total slices";
    },
  },
  decimalDocks: {
    id: "decimalDocks",
    name: "Decimal Docks",
    emoji: "\u2693",
    color: "#607D8B",
    description: "Decimals & Money",
    difficulties: ["easy", "medium", "hard"],
    generateQuestion: function (difficulty) {
      let a, b, answer, questionText;
      switch (difficulty) {
        case "easy":
          a = rand(1, 10);
          b = rand(1, 10);
          questionText =
            "\u20B1" +
            a +
            "." +
            rand(0, 9) +
            "" +
            rand(0, 9) +
            " + \u20B1" +
            b +
            "." +
            rand(0, 9) +
            "" +
            rand(0, 9);
          answer = eval(
            questionText.replace(/\u20B1/g, "").replace(/\u00D7/g, "*"),
          );
          break;
        case "medium":
          a = rand(5, 50);
          b = rand(1, a - 1);
          var aDec = rand(0, 99);
          var bDec = rand(0, aDec > 0 ? aDec - 1 : aDec);
          questionText =
            "\u20B1" +
            a +
            "." +
            String(aDec).padStart(2, "0") +
            " - \u20B1" +
            b +
            "." +
            String(bDec).padStart(2, "0");
          answer = parseFloat((a + aDec / 100 - b - bDec / 100).toFixed(2));
          break;
        case "hard":
          a = parseFloat((rand(10, 100) + rand(0, 99) / 100).toFixed(2));
          b = parseFloat((rand(10, 100) + rand(0, 99) / 100).toFixed(2));
          var c = parseFloat((rand(10, 100) + rand(0, 99) / 100).toFixed(2));
          questionText =
            "\u20B1" +
            a.toFixed(2) +
            " + \u20B1" +
            b.toFixed(2) +
            " + \u20B1" +
            c.toFixed(2);
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
        return (
          "Add decimals like you add money!\n\nLine up the decimal points:\n  \u20B1" +
          question.match(/\u20B1([\d.]+)/g).join("\n+ \u20B1") +
          "\n  = ?\n\nAdd the hundredths first, then tenths, then whole numbers."
        );
      }
      return "Subtract decimals carefully.\n\nLine up the decimal points and borrow if needed.\n\nRemember: \u20B11.00 = 100 centavos";
    },
  },
  mathReadingTrail: {
    id: "mathReadingTrail",
    name: "Math Reading Trail",
    emoji: "\u{1F4D6}",
    color: "#00BCD4",
    description: "Read & Solve Word Problems",
    difficulties: ["easy", "medium", "hard"],
    theme: "forest",
    hasTimer: false,
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
              hint: "Multiply the number of bags by the apples in each bag: 4 \u00D7 6",
            },
            {
              q: "How many apples are <span class='vocab-word' data-vocab='remaining'>remaining</span> after giving some away?",
              answer: 19,
              hint: "Take the total apples and subtract what she gave away: 24 \u2212 5",
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
              hint: "Divide the candies by the number of friends: 12 \u00F7 3",
            },
            {
              q: "If Tom <span class='vocab-word' data-vocab='spent'>spent</span> \u20B12 on each candy, how much did he spend <span class='vocab-word' data-vocab='altogether'>altogether</span>?",
              answer: 24,
              hint: "Multiply the cost per candy by total candies: 2 \u00D7 12",
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
              hint: "Divide the eggs by how many fit in each carton: 36 \u00F7 6",
            },
            {
              q: "After selling 2 cartons, how many eggs are <span class='vocab-word' data-vocab='remaining'>remaining</span>?",
              answer: 24,
              hint: "Cartons left: 6 \u2212 2 = 4. Then multiply by eggs per carton: 4 \u00D7 6",
            },
            {
              q: "If each egg sells for \u20B13, how much money does the farmer earn from 2 cartons?",
              answer: 36,
              hint: "2 cartons \u00D7 6 eggs \u00D7 \u20B13 = ? First multiply 2 \u00D7 6, then \u00D7 3",
            },
          ],
        },
        {
          text: "A baker bakes 48 cookies. She puts them into boxes of 8. <span class='vocab-word' data-vocab='each'>Each</span> box sells for \u20B125. She sells 4 boxes.",
          questions: [
            {
              q: "How many boxes of cookies does the baker make <span class='vocab-word' data-vocab='total'>total</span>?",
              answer: 6,
              hint: "Divide the cookies by the number per box: 48 \u00F7 8",
            },
            {
              q: "How much money does she earn from selling 4 boxes?",
              answer: 100,
              hint: "Multiply the number of boxes sold by the price per box: 4 \u00D7 25",
            },
            {
              q: "How many cookies are <span class='vocab-word' data-vocab='remaining'>remaining</span> unsold?",
              answer: 16,
              hint: "Boxes unsold: 6 \u2212 4 = 2. Then 2 \u00D7 8 cookies per box",
            },
          ],
        },
      ],
      hard: [
        {
          text: "A school is planning a field trip. There are 120 students. <span class='vocab-word' data-vocab='each'>Each</span> bus can carry 30 students. The school rents 3 buses. <span class='vocab-word' data-vocab='each'>Each</span> bus costs \u20B1450 to rent.",
          questions: [
            {
              q: "How many buses are needed to carry <span class='vocab-word' data-vocab='altogether'>all</span> 120 students?",
              answer: 4,
              hint: "Divide total students by capacity per bus: 120 \u00F7 30",
            },
            {
              q: "If the school rents only 3 buses, how many students are left <span class='vocab-word' data-vocab='remaining'>remaining</span>?",
              answer: 30,
              hint: "Students that fit in 3 buses: 3 \u00D7 30 = 90. Then 120 \u2212 90",
            },
            {
              q: "What is the <span class='vocab-word' data-vocab='total'>total</span> cost of renting 3 buses?",
              answer: 1350,
              hint: "Multiply the number of buses by the cost per bus: 3 \u00D7 450",
            },
            {
              q: "If <span class='vocab-word' data-vocab='each'>each</span> student pays \u20B115 for the trip, how much money is collected <span class='vocab-word' data-vocab='altogether'>altogether</span>?",
              answer: 1800,
              hint: "Multiply the number of students by the fee: 120 \u00D7 15",
            },
          ],
        },
      ],
    },
    currentStoryIndex: 0,
    currentQuestionIndex: 0,
    generateQuestion: function (difficulty) {
      var stories = this.stories[difficulty] || this.stories.easy;
      if (!stories || stories.length === 0) return null;
      var storyIndex = this.currentStoryIndex % stories.length;
      var story = stories[storyIndex];
      var qIndex = this.currentQuestionIndex % (story.questions.length || 1);
      var qData = story.questions[qIndex];
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex >= story.questions.length) {
        this.currentQuestionIndex = 0;
        this.currentStoryIndex++;
      }
      return {
        question:
          story.text +
          "<br><br><strong>Question " +
          (qIndex + 1) +
          ":</strong> " +
          qData.q,
        answer: qData.answer,
        difficulty: difficulty,
        world: "mathReadingTrail",
        storyText: story.text,
        hint: qData.hint,
        vocabulary: story.vocabulary || [],
      };
    },
    getHint: function (question) {
      return "Read the story carefully. Look for key numbers and decide which operation to use (+, \u2212, \u00D7, \u00F7).";
    },
  },
  ratioRidge: {
    id: "ratioRidge",
    name: "Ratio Ridge",
    emoji: "\u{1F9ED}",
    color: "#E91E63",
    description: "Ratio, Proportion & Percent",
    difficulties: ["easy", "medium", "hard"],
    supportBoard: "ratioRidge",
    generateQuestion: function (difficulty) {
      var skill = rand(0, 2); // 0=Ratio, 1=Proportion, 2=Percent
      var questionText, answer;
      switch (skill) {
        case 0: // Ratio
          switch (difficulty) {
            case "easy": {
              var r1 = rand(1, 5);
              var r2 = rand(1, 5);
              var item1 = [
                "red marbles",
                "blue marbles",
                "apples",
                "oranges",
                "pencils",
                "erasers",
              ][rand(0, 5)];
              var item2 = [
                "green marbles",
                "yellow marbles",
                "bananas",
                "grapes",
                "pens",
                "rulers",
              ][rand(0, 5)];
              questionText =
                "A bag has " +
                r1 +
                " " +
                item1 +
                " and " +
                r2 +
                " " +
                item2 +
                ".\nWhat is the ratio of " +
                item1 +
                " to " +
                item2 +
                "?\n(Type as number:number)";
              answer = r1 + ":" + r2;
              break;
            }
            case "medium": {
              var ratioA = rand(2, 4);
              var ratioB = rand(2, 4);
              var qtyA = ratioA * rand(2, 5);
              var groupA = ["teachers", "girls", "dogs", "adults"][rand(0, 3)];
              var groupB = ["students", "boys", "cats", "children"][rand(0, 3)];
              questionText =
                "The ratio of " +
                groupA +
                " to " +
                groupB +
                " is " +
                ratioA +
                ":" +
                ratioB +
                ".\nIf there are " +
                qtyA +
                " " +
                groupA +
                ", how many " +
                groupB +
                " are there?";
              answer = (qtyA / ratioA) * ratioB;
              break;
            }
            case "hard": {
              var rtA = rand(2, 5);
              var rtB = rand(2, 5);
              var total = (rtA + rtB) * rand(2, 6);
              var fruitA = ["apples", "mangoes", "roses", "coins"][rand(0, 3)];
              var fruitB = ["oranges", "bananas", "tulips", "stamps"][
                rand(0, 3)
              ];
              questionText =
                "The ratio of " +
                fruitA +
                " to " +
                fruitB +
                " is " +
                rtA +
                ":" +
                rtB +
                ".\nIf there are " +
                total +
                " " +
                fruitA +
                " and " +
                fruitB +
                " altogether, how many " +
                fruitA +
                " are there?";
              var part = total / (rtA + rtB);
              answer = part * rtA;
              break;
            }
          }
          break;
        case 1: // Proportion
          switch (difficulty) {
            case "easy": {
              var pNum = rand(2, 9);
              var pFactor = rand(2, 5);
              var pAns = pNum * pFactor;
              questionText =
                "Solve for x:\n" + pNum + "/" + pNum * 2 + " = " + pAns + "/x";
              answer = pAns * 2;
              break;
            }
            case "medium": {
              var cost = rand(2, 10) * 5;
              var qty1 = rand(2, 5);
              var qty2 = rand(3, 8);
              questionText =
                "If " +
                qty1 +
                " apples cost \u20B1" +
                cost * qty1 +
                ",\nhow much do " +
                qty2 +
                " apples cost?";
              answer = cost * qty2;
              break;
            }
            case "hard": {
              var workers = rand(3, 6);
              var days = rand(4, 10);
              var newWorkers = workers + rand(1, 3);
              questionText =
                "If " +
                workers +
                " workers can build a wall in " +
                days +
                " days,\nhow many days will it take " +
                newWorkers +
                " workers?\n(Round to nearest whole number)";
              answer = Math.round((workers * days) / newWorkers);
              break;
            }
          }
          break;
        case 2: // Percent
          switch (difficulty) {
            case "easy": {
              var pcts = [10, 20, 25, 50, 75];
              var pct = pcts[rand(0, pcts.length - 1)];
              var num = rand(2, 10) * 10;
              questionText = "What is " + pct + "% of " + num + "?";
              answer = (pct / 100) * num;
              break;
            }
            case "medium": {
              var part = rand(2, 9) * 10;
              var whole = part + rand(1, 5) * 10;
              questionText = "What percent of " + whole + " is " + part + "?";
              answer = Math.round((part / whole) * 100);
              break;
            }
            case "hard": {
              var price = rand(10, 50) * 10;
              var discountPct = rand(2, 4) * 5;
              var salePrice = price - (price * discountPct) / 100;
              questionText =
                "A \u20B1" +
                price +
                " item is on sale for " +
                discountPct +
                "% off.\nWhat is the sale price?";
              answer = salePrice;
              break;
            }
          }
          break;
      }
      return {
        question: questionText,
        answer: answer,
        difficulty: difficulty,
        world: "ratioRidge",
      };
    },
    getHint: function (question) {
      if (question.includes("ratio of")) {
        if (question.includes("altogether")) {
          return "1) Add the ratio parts to find total parts\n2) Divide the total by the sum of parts\n3) Multiply by the part you need\n\nExample: ratio 2:3, total 30 → each part = 30\u00F75 = 6";
        }
        return "A ratio compares two quantities.\n\nWrite the numbers in the same order as the items mentioned.\n\nSimplify if you can!";
      }
      if (
        question.includes("Solve for x") ||
        question.includes("apples cost") ||
        question.includes("workers")
      ) {
        return "Use cross multiplication:\n\na/b = c/x → a \u00D7 x = b \u00D7 c\n\nThen divide to find x.";
      }
      if (
        question.includes("percent") ||
        question.includes("% of") ||
        question.includes("sale")
      ) {
        return "Percent means 'out of 100'.\n\nTo find a percent: (percent \u00F7 100) \u00D7 whole\n\nFor discounts: price \u2212 (price \u00D7 discount%)";
      }
      return "Read carefully. Identify what you know and what you need to find. Choose the right operation.";
    },
  },
};
