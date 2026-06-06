// Math Outlaw Quest - Math Work Area (Finger-Optimized Drawing)
// Pointer Events API for finger touch, pen, and mouse

let isDrawing = false;
let currentStroke = [];
let strokes = [];
let isEraser = false;
let canvasCtx = null;
let pointerCount = 0;

function initWorkArea() {
  const canvas = document.getElementById("workAreaCanvas");
  if (!canvas) return;

  canvasCtx = canvas.getContext("2d");
  resizeWorkArea(canvas);

  // Pointer events (handles touch, pen, mouse)
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  // Prevent default touch behavior
  canvas.style.touchAction = "none";

  // Use ResizeObserver instead of just window.resize
  const resizeObserver = new ResizeObserver(() => {
    resizeWorkArea(canvas);
  });
  resizeObserver.observe(canvas);
}

function resizeWorkArea(canvas) {
  if (!canvas || canvas.clientWidth === 0) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvasCtx = canvas.getContext("2d");
  canvasCtx.scale(dpr, dpr);
  redrawAllStrokes();
}

function onPointerDown(e) {
  e.preventDefault();
  pointerCount++;

  if (pointerCount > 1) {
    // Ignore multi-touch for drawing
    return;
  }

  if (isEraser) {
    eraseStrokeAt(e);
    return;
  }

  isDrawing = true;
  currentStroke = [];
  addPointToStroke(e);
}

function onPointerMove(e) {
  e.preventDefault();
  if (!isDrawing || isEraser || pointerCount > 1) return;
  addPointToStroke(e);
}

function onPointerUp(e) {
  e.preventDefault();
  pointerCount = Math.max(0, pointerCount - 1);

  if (!isDrawing) return;

  isDrawing = false;
  if (currentStroke.length > 0) {
    strokes.push(currentStroke);
    currentStroke = [];
  }
}

function addPointToStroke(e) {
  const canvas = document.getElementById("workAreaCanvas");
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Clamp to canvas bounds
  const clampedX = Math.max(0, Math.min(x, rect.width));
  const clampedY = Math.max(0, Math.min(y, rect.height));

  // Determine line width based on pointer type
  let lineWidth = 3;
  if (e.pointerType === "pen") {
    lineWidth = 2.5; // Stylus = thinner
  } else if (e.pointerType === "touch") {
    lineWidth = 6; // Finger = thicker for comfortable drawing
  }

  currentStroke.push({
    x: clampedX,
    y: clampedY,
    pressure: e.pressure || 0.5,
    lineWidth,
  });

  // Draw dot for single tap
  if (currentStroke.length === 1) {
    const ctx = canvasCtx;
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(clampedX, clampedY, lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();
  }

  // Draw incrementally for smooth feedback
  if (currentStroke.length >= 2) {
    drawIncremental();
  }
}

function drawIncremental() {
  const ctx = canvasCtx;
  if (!ctx || currentStroke.length < 2) return;

  const p1 = currentStroke[currentStroke.length - 2];
  const p2 = currentStroke[currentStroke.length - 1];

  ctx.beginPath();
  ctx.strokeStyle = "#333";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const width = p1.lineWidth * (0.5 + p1.pressure * 0.5);
  ctx.lineWidth = width;

  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function redrawAllStrokes() {
  const ctx = canvasCtx;
  if (!ctx) return;

  const canvas = document.getElementById("workAreaCanvas");
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

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

function eraseStrokeAt(e) {
  const canvas = document.getElementById("workAreaCanvas");
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Find closest stroke and remove it (larger hit radius for finger)
  let closestDist = Infinity;
  let closestIndex = -1;
  const hitRadius = 30; // Increased for finger usability

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

  if (closestIndex >= 0 && closestDist < hitRadius) {
    strokes.splice(closestIndex, 1);
    redrawAllStrokes();
  }
}

// ===== DRAWING LAYER VISIBILITY (controlled by debug) =====
function setDrawingLayerEnabled(enabled) {
  const canvas = document.getElementById("workAreaCanvas");
  const controls = document.querySelector(".work-area-controls");
  if (canvas) {
    canvas.style.display = enabled ? "block" : "none";
  }
  if (controls) {
    controls.style.display = enabled ? "flex" : "none";
  }
}

// Init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initWorkArea, 100);
});
