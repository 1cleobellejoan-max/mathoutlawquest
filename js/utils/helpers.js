// ===== HELPER FUNCTIONS =====
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function findGCD(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    var t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
