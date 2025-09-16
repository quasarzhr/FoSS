const maze = document.getElementById("maze");
const ball = document.getElementById("ball");
const goal = document.getElementById("goal");
const restartBtn = document.getElementById("restart");

let ballX = 10;
let ballY = 10;
let speed = 2; // 控制灵敏度

function createRandomMaze() {
  // 先清空旧墙壁
  document.querySelectorAll(".wall").forEach(w => w.remove());

  const mazeWidth = maze.clientWidth;
  const mazeHeight = maze.clientHeight;

  // 生成一些随机墙壁
  for (let i = 0; i < 12; i++) {
    const wall = document.createElement("div");
    wall.classList.add("wall");

    // 随机位置与大小
    let w = Math.random() > 0.5 ? 150 : 20; // 横墙 or 竖墙
    let h = w === 150 ? 20 : 150;

    let x = Math.floor(Math.random() * (mazeWidth - w - 40)) + 20;
    let y = Math.floor(Math.random() * (mazeHeight - h - 40)) + 20;

    // 避开起点和终点区域
    if ((x < 60 && y < 60) || (x > mazeWidth - 100 && y > mazeHeight - 100)) {
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
  if (x < 0 || y < 0 || x + 20 > maze.clientWidth || y + 20 > maze.clientHeight) {
    return true;
  }
  // 墙壁检测
  const walls = document.querySelectorAll(".wall");
  for (let wall of walls) {
    const rect = wall.getBoundingClientRect();
    const ballRect = {
      left: maze.offsetLeft + x,
      top: maze.offsetTop + y,
      right: maze.offsetLeft + x + 20,
      bottom: maze.offsetTop + y + 20
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

function createRandomMaze() {
  document.querySelectorAll(".wall").forEach(w => w.remove());

  const mazeWidth = maze.clientWidth;
  const mazeHeight = maze.clientHeight;

  for (let i = 0; i < 20; i++) { // 难度稍微加大
    const wall = document.createElement("div");
    wall.classList.add("wall");

    // 横墙/竖墙，按屏幕大小比例生成
    let isHorizontal = Math.random() > 0.5;
    let w = isHorizontal ? mazeWidth * 0.3 : mazeWidth * 0.05;
    let h = isHorizontal ? mazeHeight * 0.05 : mazeHeight * 0.3;

    let x = Math.floor(Math.random() * (mazeWidth - w - 40)) + 20;
    let y = Math.floor(Math.random() * (mazeHeight - h - 40)) + 20;

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
