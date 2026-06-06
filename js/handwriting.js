// Math Outlaw Quest - Handwriting / Stylus Support
// Pointer Events API for Apple Pencil, finger, and mouse

let isDrawing = false;
let currentStroke = [];
let strokes = [];
let isEraser = false;
let canvasCtx = null;

function initHandwritingCanvas() {
  const canvas = document.getElementById("handwritingCanvas");
  if (!canvas) return;

  canvasCtx = canvas.getContext("2d");
  resizeCanvas(canvas);

  // Pointer events (handles pen, touch, mouse)
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerUp);

  // Prevent default touch behavior
  canvas.style.touchAction = "none";

  // Resize on window resize
  window.addEventListener("resize", () => resizeCanvas(canvas));
}

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  canvasCtx = canvas.getContext("2d");
  canvasCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  redrawAllStrokes();
}

function onPointerDown(e) {
  e.preventDefault();
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (isEraser) {
    // Erase: check if we hit any stroke
    eraseStrokeAt(x, y);
    return;
  }

  isDrawing = true;
  currentStroke = [];
  addPointToStroke(e);
}

function onPointerMove(e) {
  e.preventDefault();
  if (!isDrawing || isEraser) return;
  addPointToStroke(e);
  drawCurrentStroke();
}

function onPointerUp(e) {
  e.preventDefault();
  if (!isDrawing) return;

  isDrawing = false;
  if (currentStroke.length > 0) {
    strokes.push(currentStroke);
    currentStroke = [];
  }
}

function addPointToStroke(e) {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Determine line width based on pointer type
  let lineWidth = 3;
  if (e.pointerType === "pen") {
    lineWidth = 2; // Apple Pencil = thinner
  } else if (e.pointerType === "touch") {
    lineWidth = 4; // Finger = thicker
  }

  currentStroke.push({
    x,
    y,
    pressure: e.pressure || 0.5,
    lineWidth,
  });

  // Draw dot for single tap
  if (currentStroke.length === 1) {
    const ctx = canvasCtx;
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(x, y, lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();
  }
}

function drawCurrentStroke() {
  const ctx = canvasCtx;
  if (!ctx || currentStroke.length < 2) return;

  ctx.beginPath();
  ctx.strokeStyle = "#333";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (let i = 0; i < currentStroke.length - 1; i++) {
    const p1 = currentStroke[i];
    const p2 = currentStroke[i + 1];

    // Vary width by pressure
    const width = p1.lineWidth * (0.5 + p1.pressure * 0.5);
    ctx.lineWidth = width;

    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // Redraw all strokes to maintain consistency
  redrawAllStrokes();
}

function redrawAllStrokes() {
  const ctx = canvasCtx;
  if (!ctx) return;

  const canvas = document.getElementById("handwritingCanvas");
  if (!canvas) return;

  ctx.clearRect(
    0,
    0,
    canvas.width / window.devicePixelRatio,
    canvas.height / window.devicePixelRatio,
  );

  ctx.strokeStyle = "#333";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Draw all completed strokes
  for (const stroke of strokes) {
    if (stroke.length < 2) continue;
    ctx.beginPath();
    for (let i = 0; i < stroke.length - 1; i++) {
      const p1 = stroke[i];
      const p2 = stroke[i + 1];
      const width = p1.lineWidth * (0.5 + p1.pressure * 0.5);
      ctx.lineWidth = width;
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }

  // Draw current stroke
  if (currentStroke.length >= 2) {
    ctx.beginPath();
    for (let i = 0; i < currentStroke.length - 1; i++) {
      const p1 = currentStroke[i];
      const p2 = currentStroke[i + 1];
      const width = p1.lineWidth * (0.5 + p1.pressure * 0.5);
      ctx.lineWidth = width;
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }
}

// ===== CONTROLS =====
function undoStroke() {
  strokes.pop();
  redrawAllStrokes();
}

function toggleEraser() {
  isEraser = !isEraser;
  const eraserBtn = document.getElementById("eraserBtn");
  if (eraserBtn) {
    eraserBtn.classList.toggle("active", isEraser);
    eraserBtn.textContent = isEraser ? "🧹 Erasing..." : "🧹 Eraser";
  }
}

function clearCanvas() {
  strokes = [];
  currentStroke = [];
  isDrawing = false;
  redrawAllStrokes();
}

function eraseStrokeAt(x, y) {
  // Find closest stroke and remove it
  let closestDist = Infinity;
  let closestIndex = -1;

  for (let i = 0; i < strokes.length; i++) {
    const stroke = strokes[i];
    for (const point of stroke) {
      const dist = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    }
  }

  if (closestIndex >= 0 && closestDist < 20) {
    strokes.splice(closestIndex, 1);
    redrawAllStrokes();
  }
}

// Init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // Wait a tick for the canvas to be in DOM
  setTimeout(initHandwritingCanvas, 100);
});
