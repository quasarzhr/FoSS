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

// 小球与终点
let player = { x: 0, y: 0 };
let goal = { x: cols - 1, y: rows - 1 };
let speed = 0.2; // 控制灵敏度

// 生成空迷宫网格
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

// 递归回溯算法生成迷宫
function generateMaze(cx = 0, cy = 0) {
  visited[cy][cx] = true;
  maze[cy][cx] = 0;

  const directions = [[0,-1],[1,0],[0,1],[-1,0]].sort(() => Math.random()-0.5);

  for (let [dx,dy] of directions) {
    const nx = cx + dx*2;
    const ny = cy + dy*2;
    if (nx>=0 && nx<cols && ny>=0 && ny<rows && !visited[ny][nx]) {
      maze[cy+dy][cx+dx] = 0; // 打通墙
      generateMaze(nx, ny);
    }
  }
}

// 绘制迷宫和小球
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // 画墙
  for (let y=0; y<rows; y++) {
    for (let x=0; x<cols; x++) {
      if (maze[y][x]===1) {
        ctx.fillStyle="#555";
        ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
      }
    }
  }

  // 画终点
  ctx.fillStyle="limegreen";
  ctx.fillRect(goal.x*cellSize+cellSize*0.2, goal.y*cellSize+cellSize*0.2, cellSize*0.6, cellSize*0.6);

  // 画小球
  ctx.fillStyle="blue";
  ctx.beginPath();
  ctx.arc(player.x*cellSize+cellSize/2, player.y*cellSize+cellSize/2, cellSize/3, 0, Math.PI*2);
  ctx.fill();
}

// 检测碰撞
function canMove(nx, ny){
  return nx>=0 && nx<cols && ny>=0 && ny<rows && maze[ny][nx]===0;
}

// 移动小球
function moveBall(dx, dy){
  let nx = player.x;
  let ny = player.y;

  if (Math.abs(dx) > 0.5) nx += dx>0?1:-1;
  if (Math.abs(dy) > 0.5) ny += dy>0?1:-1;

  if (canMove(nx, ny)){
    player.x = nx;
    player.y = ny;
  }

  if(player.x===goal.x && player.y===goal.y){
    alert("🎉 恭喜通关！");
    resetGame();
  }

  draw();
}

// 初始化游戏
function resetGame(){
  initMaze();
  generateMaze();
  player = {x:0, y:0};
  goal = {x:cols-1, y:rows-1};
  draw();
}

// 陀螺仪控制
window.addEventListener("deviceorientation", e=>{
  moveBall(e.gamma*speed, e.beta*speed);
});

// 刷新按钮
restartBtn.addEventListener("click", resetGame);

// 初始化
resetGame();
