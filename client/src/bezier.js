function drawDot(point, color) {
  ctx.fillStyle = color;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 8, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
//BEZIER CURVES
// line: percent is 0-1
function getLineXYatPercent(startPt, endPt, percent) {
  var dx = endPt.x - startPt.x;
  var dy = endPt.y - startPt.y;
  var X = startPt.x + dx * percent;
  var Y = startPt.y + dy * percent;
  return { x: X, y: Y };
}
// quadratic bezier: percent is 0-1
function getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
  var x =
    Math.pow(1 - percent, 2) * startPt.x +
    2 * (1 - percent) * percent * controlPt.x +
    Math.pow(percent, 2) * endPt.x;
  var y =
    Math.pow(1 - percent, 2) * startPt.y +
    2 * (1 - percent) * percent * controlPt.y +
    Math.pow(percent, 2) * endPt.y;
  return { x: x, y: y };
}
// cubic bezier percent is 0-1
function getCubicBezierXYatPercent(
  startPt,
  controlPt1,
  controlPt2,
  endPt,
  percent
) {
  var x = CubicN(percent, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
  var y = CubicN(percent, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
  return { x: x, y: y };
}

// cubic helper formula at percent distance
function CubicN(pct, a, b, c, d) {
  var t2 = pct * pct;
  var t3 = t2 * pct;
  return (
    a +
    (-a * 3 + pct * (3 * a - a * pct)) * pct +
    (3 * b + pct * (-6 * b + b * 3 * pct)) * pct +
    (c * 3 - c * 3 * pct) * t2 +
    d * t3
  );
}
if (pathPercent < 25) {
  var line1percent = pathPercent / 24;
  xy = getLineXYatPercent({ x: 100, y: 20 }, { x: 200, y: 160 }, line1percent);
} else if (pathPercent < 50) {
  var quadPercent = (pathPercent - 25) / 24;
  xy = getQuadraticBezierXYatPercent(
    { x: 200, y: 160 },
    { x: 230, y: 200 },
    { x: 250, y: 120 },
    quadPercent
  );
} else if (pathPercent < 75) {
  var cubicPercent = (pathPercent - 50) / 24;
  xy = getCubicBezierXYatPercent(
    { x: 250, y: 120 },
    { x: 290, y: -40 },
    { x: 300, y: 200 },
    { x: 400, y: 150 },
    cubicPercent
  );
} else {
  var line2percent = (pathPercent - 75) / 25;
  xy = getLineXYatPercent({ x: 400, y: 150 }, { x: 500, y: 90 }, line2percent);
}

// draw the tracking rectangle
stage.addChild(xy);
