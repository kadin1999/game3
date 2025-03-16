// Game canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions to fill the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Global variables
const airplane = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 50,
  height: 50,
  isDragging: false,
  lives: 1,
};

const obstacles = [];
const coins = [];
let gameOver = false;
let gameStarted = false;
let inUpgradeMenu = false;
let score = 0;
let coinsCollected = 0;
let coinBank = 0;
let level = 1;
let upgraded = false;

// Images
const airplaneImg = new Image();
airplaneImg.src = "fly.png";

const upgradedAirplaneImg = new Image();
upgradedAirplaneImg.src = "joke.png";

const enemyImg = new Image();
enemyImg.src = "PhQs airlines_processed.png";

const enemyImg2 = new Image();
enemyImg2.src = "Untitled design (18)_processed.png";

const coinImg = new Image();
coinImg.src = "$Bird$_processed.png";

const backgroundImg = new Image();
backgroundImg.src = "sky.avif";

// Background music setup
const backgroundMusic = new Audio("./backgroundmusic2.mp3");
backgroundMusic.loop = true;

// Start background music after user interaction
window.addEventListener("click", () => {
  backgroundMusic.play().catch((error) =>
    console.error("Audio play error:", error)
  );
});

// Helper function to check if a point is inside the airplane
function isInsideAirplane(x, y) {
  return (
    x >= airplane.x &&
    x <= airplane.x + airplane.width &&
    y >= airplane.y &&
    y <= airplane.y + airplane.height
  );
}

// Mouse and touch event handlers
function handleStart(event) {
  event.preventDefault();
  if (!gameStarted) return;

  let x, y;
  if (event.touches) {
    x = event.touches[0].clientX;
    y = event.touches[0].clientY;
  } else {
    x = event.clientX;
    y = event.clientY;
  }

  if (isInsideAirplane(x, y)) {
    airplane.isDragging = true;
  }
}

function handleMove(event) {
  if (!gameStarted || !airplane.isDragging) return;
  event.preventDefault(); // Prevents scrolling on touch devices

  let x;
  if (event.touches) {
    x = event.touches[0].clientX;
  } else {
    x = event.clientX;
  }

  airplane.x = x - airplane.width / 2;
  airplane.x = Math.max(0, Math.min(canvas.width - airplane.width, airplane.x));
}

function handleEnd() {
  airplane.isDragging = false;
}

// Attach event listeners with `passive: false` to allow `preventDefault()` on Safari
canvas.addEventListener("mousedown", handleStart);
canvas.addEventListener("mousemove", handleMove);
canvas.addEventListener("mouseup", handleEnd);
canvas.addEventListener("touchstart", handleStart, { passive: false });
canvas.addEventListener("touchmove", handleMove, { passive: false });
canvas.addEventListener("touchend", handleEnd);

// Draw functions
function drawBackground() {
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

function drawAirplane() {
  const img = upgraded ? upgradedAirplaneImg : airplaneImg;
  ctx.drawImage(img, airplane.x, airplane.y, airplane.width, airplane.height);
}

function drawCoins() {
  coins.forEach((coin, index) => {
    coin.y += 2;
    if (
      airplane.x < coin.x + coin.width &&
      airplane.x + airplane.width > coin.x &&
      airplane.y < coin.y + coin.height &&
      airplane.y + airplane.height > coin.y
    ) {
      coinsCollected += coin.value;
      coinBank += coin.value;
      coins.splice(index, 1);
    }

    if (coin.y > canvas.height) coins.splice(index, 1);
    ctx.drawImage(coinImg, coin.x, coin.y, coin.width, coin.height);
  });

  if (Math.random() < 0.02) {
    coins.push({
      x: Math.random() * (canvas.width - 30),
      y: -30,
      width: 125,
      height: 125,
      value: Math.random() < 0.1 ? (Math.random() < 0.5 ? 10 : 50) : 1,
    });
  }
}

function drawObstacles() {
  obstacles.forEach((obstacle, index) => {
    if (obstacle.type === "enemy1") {
      obstacle.y += obstacle.speed;
    } else if (obstacle.type === "enemy2") {
      obstacle.x += Math.sin(obstacle.swirlDirection) * 3;
      obstacle.y += obstacle.speed;
      obstacle.swirlDirection += 0.07;
    }

    if (
      airplane.x < obstacle.x + obstacle.width &&
      airplane.x + airplane.width > obstacle.x &&
      airplane.y < obstacle.y + obstacle.height &&
      airplane.y + airplane.height > obstacle.y
    ) {
      airplane.lives--;
      obstacles.splice(index, 1);
      if (airplane.lives <= 0) {
        gameOver = true;
      }
    }

    if (obstacle.y > canvas.height) obstacles.splice(index, 1);

    if (obstacle.type === "enemy1") {
      ctx.drawImage(enemyImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    } else if (obstacle.type === "enemy2") {
      ctx.drawImage(enemyImg2, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
  });

  if (Math.random() < 0.02) {
    const enemyType = Math.random() < 0.8 ? "enemy1" : "enemy2";
    const newEnemy = {
      x: Math.random() * (canvas.width - 150),
      y: -150,
      width: 150,
      height: 150,
      speed: 2 + Math.random() * 3,
      type: enemyType,
      swirlDirection: 0,
    };
    obstacles.push(newEnemy);
  }
}

function drawScoreAndLevel() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score}`, 20, 40);
  ctx.fillText(`Coins: ${coinsCollected}`, 20, 70);
  ctx.fillText(`Bank: ${coinBank}`, 20, 100);
  ctx.fillText(`Level: ${level}`, 20, 130);
}

function drawGameOver() {
  ctx.font = "50px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("Game Over!", canvas.width / 2 - 150, canvas.height / 2);
  ctx.font = "30px Arial";
  ctx.fillText("Returning to Main Menu...", canvas.width / 2 - 150, canvas.height / 2 + 50);

  setTimeout(() => {
    gameOver = false;
    gameStarted = false;
    drawMenu();
  }, 2000);
}

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawAirplane();
  drawCoins();
  drawObstacles();
  drawScoreAndLevel();

  if (gameOver) drawGameOver();
  requestAnimationFrame(gameLoop);
}

gameLoop();
