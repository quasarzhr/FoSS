const output = document.getElementById("output");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 300;

function drawBall(x, y) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

let posX = canvas.width / 2;
let posY = canvas.height / 2;

if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", (event) => {
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
    output.textContent = `Orientation → alpha: ${alpha?.toFixed(2)}, beta: ${beta?.toFixed(2)}, gamma: ${gamma?.toFixed(2)}`;
  });
}

if (window.DeviceMotionEvent) {
  window.addEventListener("devicemotion", (event) => {
    const ax = event.accelerationIncludingGravity.x;
    const ay = event.accelerationIncludingGravity.y;
    posX += ax;
    posY += ay;

    posX = Math.max(15, Math.min(canvas.width - 15, posX));
    posY = Math.max(15, Math.min(canvas.height - 15, posY));

    drawBall(posX, posY);
  });
}
