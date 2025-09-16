const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restart");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const rows = 12;
const cols = 12;
const cellSize = Math.min(canvas.width, canvas.height) / rows;

// 网格迷宫
let maze = [];
let visited = [];

// 小球像素位置与速度
let player = { x: cellSize/2, y: cellSize/2 };
let velocity = { x: 0, y: 0 };
let maxSpeed = 5;
let damping = 0.9;

// 终点像素位置
let goal = { x: cols - 0.5, y: rows - 0.5 };

// 初始化空迷宫
function initMaze() {
  maze = [];
  visited = [];
  for (let y = 0; y < rows; y++) {
    maze[y] = [];
    visited[y] = [];
    for (let x = 0; x < cols; x++) {
      maze[y][x] = 1; // 1=墙
      visited[y][x] = false;
    }
  }
}

// 递归回溯生成迷宫
function generateMaze(cx = 0, cy = 0) {
  visited[cy][cx] = true;
  maze[cy][cx] = 0;

  const directions = [[0,-1],[1,0],[0,1],[-1,0]].sort(() => Math.random()-0.5);

  for (let [dx, dy] of directions) {
    const nx = cx + dx*2;
    const ny = cy + dy*2;
    if (nx>=0 && nx<cols && ny>=0 && ny<rows && !visited[ny][nx]) {
      maze[cy+dy][cx+dx] = 0; // 打通墙
      generateMaze(nx, ny);
    }
  }
}

// 绘制迷宫与小球
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // 绘制墙壁
  ctx.fillStyle = "#555";
  for (let y=0; y<rows; y++){
    for (let x=0; x<cols; x++){
      if(maze[y][x]===1){
        ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
      }
    }
  }

  // 绘制终点
  ctx.fillStyle = "limegreen";
  ctx.fillRect((goal.x-0.5)*cellSize+cellSize*0.2, (goal.y-0.5)*cellSize+cellSize*0.2, cellSize*0.6, cellSize*0.6);

  // 绘制小球
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(player.x, player.y, cellSize/3, 0, Math.PI*2);
  ctx.fill();
}

// 碰撞检测
function canMove(newX, newY){
  const col = Math.floor(newX / cellSize);
  const row = Math.floor(newY / cellSize);
  return col>=0 && col<cols && row>=0 && row<rows && maze[row][col]===0;
}

// 更新小球位置
function update(){
  let newX = player.x + velocity.x;
  let newY = player.y + velocity.y;

  if(canMove(newX, player.y)) player.x = newX;
  else velocity.x *= -0.5; // 撞墙反弹

  if(canMove(player.x, newY)) player.y = newY;
  else velocity.y *= -0.5; // 撞墙反弹

  // 阻尼，惯性效果
  velocity.x *= damping;
  velocity.y *= damping;

  // 检测胜利
  const distX = player.x/cellSize - goal.x;
  const distY = player.y/cellSize - goal.y;
  if(Math.sqrt(distX*distX + distY*distY) < 0.5){
    alert("🎉 恭喜通关！");
    resetGame();
  }

  draw();
  requestAnimationFrame(update);
}

// 陀螺仪控制速度
window.addEventListener("deviceorientation", e=>{
  velocity.x += e.gamma * 0.05; // 左右倾斜
  velocity.y += e.beta * 0.05;   // 前后倾斜

  // 限制最大速度
  velocity.x = Math.max(Math.min(velocity.x, maxSpeed), -maxSpeed);
  velocity.y = Math.max(Math.min(velocity.y, maxSpeed), -maxSpeed);
});

// 重置游戏
function resetGame(){
  initMaze();
  generateMaze();
  player = { x: cellSize/2, y: cellSize/2 };
  velocity = { x: 0, y: 0 };
  goal = { x: cols - 0.5, y: rows - 0.5 };
  draw();
}

// 刷新按钮
restartBtn.addEventListener("click", resetGame);

// 初始化
resetGame();
update(); // 启动动画循环
