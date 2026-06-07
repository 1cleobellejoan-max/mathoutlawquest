// ===== SUPPORT BOARDS =====
const SUPPORT_BOARDS = {
  numberRanch: {
    title: "\u{1F9EE} Addition Chart",
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
        <p class="support-tip">\u{1F4A1} <strong>Tip:</strong> Find the first number on the top row and the second number on the side column. Where they meet is your answer!</p>
      </div>
    `,
  },
  subtractionCanyon: {
    title: "\u{1F53D} Subtraction Chart",
    content: `
      <div class="support-board">
        <table class="support-table">
          <tr><th>\u2212</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr>
          <tr><th>0</th><td>0</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td></tr>
          <tr><th>1</th><td>1</td><td>0</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td></tr>
          <tr><th>2</th><td>2</td><td>1</td><td>0</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td></tr>
          <tr><th>3</th><td>3</td><td>2</td><td>1</td><td>0</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td></tr>
          <tr><th>4</th><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td></tr>
          <tr><th>5</th><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td></tr>
          <tr><th>6</th><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td><td>\u2212</td><td>\u2212</td><td>\u2212</td><td>\u2212</td></tr>
          <tr><th>7</th><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td><td>\u2212</td><td>\u2212</td><td>\u2212</td></tr>
          <tr><th>8</th><td>8</td><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td><td>\u2212</td><td>\u2212</td></tr>
          <tr><th>9</th><td>9</td><td>8</td><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td><td>\u2212</td></tr>
          <tr><th>10</th><td>10</td><td>9</td><td>8</td><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td></tr>
        </table>
        <p class="support-tip">\u{1F4A1} <strong>Tip:</strong> Find the first number on the side, go right to the second number's column. The number on top is the answer!</p>
      </div>
    `,
  },
  multiplicationMountain: {
    title: "\u2716\uFE0F Multiplication Table",
    content: `
      <div class="support-board">
        <table class="support-table">
          <tr><th>\xD7</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th></tr>
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
        <p class="support-tip">\u{1F4A1} <strong>Tip:</strong> Find the first number on the top and second on the side. Where they cross = answer! Try skip counting!</p>
      </div>
    `,
  },
  divisionDesert: {
    title: "\u2797 Division Facts",
    content: `
      <div class="support-board">
        <div class="fact-family-grid">
          <div class="fact-family">
            <h4>\xF72 Fact Family</h4>
            <p>2 \xF7 2 = 1,  4 \xF7 2 = 2,  6 \xF7 2 = 3,  8 \xF7 2 = 4,  10 \xF7 2 = 5</p>
            <p>12 \xF7 2 = 6,  14 \xF7 2 = 7,  16 \xF7 2 = 8,  18 \xF7 2 = 9,  20 \xF7 2 = 10</p>
          </div>
          <div class="fact-family">
            <h4>\xF73 Fact Family</h4>
            <p>3 \xF7 3 = 1,  6 \xF7 3 = 2,  9 \xF7 3 = 3,  12 \xF7 3 = 4,  15 \xF7 3 = 5</p>
            <p>18 \xF7 3 = 6,  21 \xF7 3 = 7,  24 \xF7 3 = 8,  27 \xF7 3 = 9,  30 \xF7 3 = 10</p>
          </div>
          <div class="fact-family">
            <h4>\xF74 Fact Family</h4>
            <p>4 \xF7 4 = 1,  8 \xF7 4 = 2,  12 \xF7 4 = 3,  16 \xF7 4 = 4,  20 \xF7 4 = 5</p>
            <p>24 \xF7 4 = 6,  28 \xF7 4 = 7,  32 \xF7 4 = 8,  36 \xF7 4 = 9,  40 \xF7 4 = 10</p>
          </div>
          <div class="fact-family">
            <h4>\xF75 Fact Family</h4>
            <p>5 \xF7 5 = 1,  10 \xF7 5 = 2,  15 \xF7 5 = 3,  20 \xF7 5 = 4,  25 \xF7 5 = 5</p>
            <p>30 \xF7 5 = 6,  35 \xF7 5 = 7,  40 \xF7 5 = 8,  45 \xF7 5 = 9,  50 \xF7 5 = 10</p>
          </div>
        </div>
        <p class="support-tip">\u{1F4A1} <strong>Tip:</strong> Division is the opposite of multiplication! If you know 6 \xD7 4 = 24, then 24 \xF7 4 = 6!</p>
      </div>
    `,
  },
};

// ===== SUPPORT VISIBILITY (always fully visible) =====
function getSupportVisibility(worldId) {
  return 1;
}
