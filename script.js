const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let prev = null;

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveImage() {
  const link = document.createElement("a");
  link.download = "airsketch.png";
  link.href = canvas.toDataURL();
  link.click();
}

function draw(x, y) {
  if (!prev) {
    prev = {x, y};
    return;
  }

  ctx.strokeStyle = colorPicker.value;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(prev.x, prev.y);
  ctx.lineTo(x, y);
  ctx.stroke();

  prev = {x, y};
}

const hands = new Hands({
  locateFile: file =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults(results => {
  if (!results.multiHandLandmarks.length) {
    prev = null;
    return;
  }

  const lm = results.multiHandLandmarks[0];

  let x = lm[8].x * canvas.width;
  let y = lm[8].y * canvas.height;

  let thumbX = lm[4].x * canvas.width;
  let thumbY = lm[4].y * canvas.height;

  // Pinch detection (like original site)
  let distance = Math.hypot(x - thumbX, y - thumbY);

  if (distance < 40) {
    draw(x, y);
  } else {
    prev = null;
  }

  // cursor dot
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fillStyle = colorPicker.value;
  ctx.fill();
});

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});

camera.start();
