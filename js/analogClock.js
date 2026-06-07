// ===== Reusable Analog Clock SVG Generator =====
// Returns an SVG string for an analog clock face with the given hour and minute.
// Usage: createAnalogClock(hour, minute) -> SVG string

function createAnalogClock(hour, minute) {
  // Normalize inputs
  hour = hour % 12;
  minute = Math.min(59, Math.max(0, minute || 0));

  // Clock face dimensions
  const cx = 100,
    cy = 100,
    r = 90;

  // Calculate hand angles (in radians, clockwise from 12 o'clock)
  // Hour hand: each hour = 30°, plus minute offset (0.5° per minute)
  const hourAngle = (hour * 30 + minute * 0.5 - 90) * (Math.PI / 180);
  // Minute hand: each minute = 6°
  const minuteAngle = (minute * 6 - 90) * (Math.PI / 180);

  // Hand endpoint calculations
  const hourLen = 50,
    hourWidth = 6;
  const minLen = 70,
    minWidth = 4;

  const hx = cx + hourLen * Math.cos(hourAngle);
  const hy = cy + hourLen * Math.sin(hourAngle);
  const mx = cx + minLen * Math.cos(minuteAngle);
  const my = cy + minLen * Math.sin(minuteAngle);

  // Generate hour markers (1-12)
  let markers = "";
  for (let i = 1; i <= 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const mx2 = cx + (r - 16) * Math.cos(angle);
    const my2 = cy + (r - 16) * Math.sin(angle);
    markers += `<text x="${mx2}" y="${my2 + 4}" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${i}</text>\n    `;
  }

  // Generate minute tick marks (60 ticks, thicker at 5-minute intervals)
  let ticks = "";
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const innerR = i % 5 === 0 ? r - 20 : r - 12;
    const outerR = r - 4;
    const x1 = cx + innerR * Math.cos(angle);
    const y1 = cy + innerR * Math.sin(angle);
    const x2 = cx + outerR * Math.cos(angle);
    const y2 = cy + outerR * Math.sin(angle);
    const strokeW = i % 5 === 0 ? 3 : 1.5;
    const opacity = i % 5 === 0 ? 0.8 : 0.4;
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#555" stroke-width="${strokeW}" opacity="${opacity}" />\n    `;
  }

  // Build the SVG
  const svg = `<svg viewBox="0 0 200 200" width="180" height="180" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
    <!-- Clock face outer circle -->
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#333" stroke-width="4" />
    
    <!-- Inner decorative ring -->
    <circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="none" stroke="#ddd" stroke-width="1" />
    
    <!-- Minute ticks -->
    ${ticks}
    
    <!-- Hour numbers -->
    ${markers}
    
    <!-- Hour hand -->
    <line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="#222" stroke-width="${hourWidth}" stroke-linecap="round" />
    
    <!-- Minute hand -->
    <line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}" stroke="#222" stroke-width="${minWidth}" stroke-linecap="round" />
    
    <!-- Center dot -->
    <circle cx="${cx}" cy="${cy}" r="5" fill="#222" />
    <circle cx="${cx}" cy="${cy}" r="2.5" fill="#fff" />
  </svg>`;

  return svg;
}
