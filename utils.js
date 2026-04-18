function detectShape(points) {
  if (points.length < 10) return "none";

  let start = points[0];
  let end = points[points.length - 1];

  let dist = Math.hypot(start.x - end.x, start.y - end.y);

  // Circle detection
  if (dist < 30) return "circle";

  // Line detection
  let dx = end.x - start.x;
  let dy = end.y - start.y;

  if (Math.abs(dy/dx) < 0.2) return "line";

  return "free";
}
