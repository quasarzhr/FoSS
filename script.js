const maze = document.getElementById("maze");
const ball = document.getElementById("ball");
const goal = document.getElementById("goal");
const restartBtn = document.getElementById("restart");

let ballX = 10;
let ballY = 10;
let speed = 2; // 控制灵敏度

function createRandomMaze() {
  // 清空旧墙壁
  document.querySelectorAll(".wall").forEach(w => w.remove());

  const mazeWidth = maze.clientWidth;
  const mazeHeight = maze.clientHeight;

  for (let i = 0; i < 20; i++) { // 控制迷宫复杂度
    const wall = document.createElement("div");
    wall.classList.add("wall");

    // 横墙 / 竖墙，基于屏幕比例
    let isHorizontal = Math.random() > 0.5;
    let w = isHorizontal ? mazeWidth * 0.3 : mazeWidth * 0.05;
    let h = isHorizontal ? mazeHeight * 0.05 : mazeHeight * 0.3;

    let x = Math.floor(Math.random() * (mazeWidth - w - 40)) + 20;
    let y = Math.floor(Math.random() * (mazeHeight - h - 40)) + 20;

    // 避开起点 (左上角) 和终点 (右下角)
    if ((x < 100 && y < 100) || (x > mazeWidth - 150 && y > mazeHeight - 150)) {
      continue;
    }

    wall.style.left = x + "px";
    wall.style.top = y + "px";
    wall.style.width = w + "px";
    wall.style.height = h + "px";
    maze.appendChild(wall);
  }
}

function checkCollision(x, y) {
  // 边界检测
  if (x < 0 || y < 0 || x + ball.clientWidth > maze.clientWidth || y + ball.clientHeight > maze.clientHeight) {
    return true;
  }
  // 墙壁检测
  const walls = document.querySelectorAll(".wall");
  for (let wall of walls) {
    const rect = wall.getBoundingClientRect();
    const ballRect = {
      left: maze.offsetLeft + x,
      top: maze.offsetTop + y,
      right: maze.offsetLeft + x + ball.clientWidth,
      bottom: maze.offsetTop + y + ball.clientHeight
    };
    if (!(ballRect.right < rect.left || 
          ballRect.left > rect.right || 
          ballRect.bottom < rect.top || 
          ballRect.top > rect.bottom)) {
      return true;
    }
  }
  return false;
}

function checkGoal() {
  const ballRect = ball.getBoundingClientRect();
  const goalRect = goal.getBoundingClientRect();
  return !(ballRect.right < goalRect.left ||
           ballRect.left > goalRect.right ||
           ballRect.bottom < goalRect.top ||
           ballRect.top > goalRect.bottom);
}

function moveBall(dx, dy) {
  let newX = ballX + dx;
  let newY = ballY + dy;

  if (!checkCollision(newX, newY)) {
    ballX = newX;
    ballY = newY;
    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
  }

  if (checkGoal()) {
    alert("🎉 恭喜你成功通关！");
    resetGame();
  }
}

function resetGame() {
  ballX = 10;
  ballY = 10;
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
  createRandomMaze();
}

// 陀螺仪控制
window.addEventListener("deviceorientation", (e) => {
  let dx = (e.gamma || 0) * speed * 0.05; // 左右
  let dy = (e.beta || 0) * speed * 0.05;  // 前后
  moveBall(dx, dy);
});

// 点击按钮刷新迷宫
restartBtn.addEventListener("click", resetGame);

// 初始化
createRandomMaze();
