const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let points = [];
let drawing = false;

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function download() {
  let a = document.createElement("a");
  a.href = canvas.toDataURL();
  a.download = "sketch.png";
  a.click();
}

function drawLine(p1, p2) {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.strokeStyle = "cyan";
  ctx.lineWidth = 5;
  ctx.stroke();
}

function drawShape(shape) {
  if (shape === "circle") {
    let center = points[Math.floor(points.length/2)];
    ctx.beginPath();
    ctx.arc(center.x, center.y, 50, 0, Math.PI*2);
    ctx.stroke();
  }

  if (shape === "line") {
    drawLine(points[0], points[points.length-1]);
  }
}

// MediaPipe setup same as before...

hands.onResults(results => {
  if (!results.multiHandLandmarks.length) return;

  let lm = results.multiHandLandmarks[0];
  let gesture = getGesture(lm);

  let x = lm[8].x * canvas.width;
  let y = lm[8].y * canvas.height;

  if (gesture === "draw") {
    drawing = true;
    points.push({x, y});

    if (points.length > 1) {
      drawLine(points[points.length-2], points[points.length-1]);
    }
  }

  if (gesture === "erase") {
    ctx.clearRect(x-20, y-20, 40, 40);
  }

  if (gesture === "pause") {
    drawing = false;
    let shape = detectShape(points);
    drawShape(shape);
    points = [];
  }
});
