// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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

// Images and sounds
const airplaneImg = new Image();
airplaneImg.src = 'fly.png';

const upgradedAirplaneImg = new Image();
upgradedAirplaneImg.src = 'joke.png';

const enemyImg = new Image();
enemyImg.src = 'PhQs airlines_processed.png';

const enemyImg2 = new Image();
enemyImg2.src = 'Untitled design (18)_processed.png';

const coinImg = new Image();
coinImg.src = '$Bird$_processed.png';

const backgroundImg = new Image();
backgroundImg.src = 'sky.avif';

const backgroundMusic = new Audio('./backgroundmusic2.mp3');
backgroundMusic.loop = true;

// Start background music after user interaction
window.addEventListener('click', () => {
  backgroundMusic.play().catch((error) => console.error('Audio play error:', error));
});

// Prevent default touch behavior to allow touch movement
document.addEventListener('touchmove', (event) => {
  event.preventDefault();
}, { passive: false });

// Event listeners for mouse/touch input
function isInsideAirplane(x, y) {
  return (
    x >= airplane.x &&
    x <= airplane.x + airplane.width &&
    y >= airplane.y &&
    y <= airplane.y + airplane.height
  );
}

function handleStart(event) {
  event.preventDefault();
  if (!gameStarted) return;
  const rect = canvas.getBoundingClientRect();
  const touch = event.touches ? event.touches[0] : event;
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  if (isInsideAirplane(x, y)) {
    airplane.isDragging = true;
  }
}

function handleMove(event) {
  event.preventDefault();
  if (!gameStarted || !airplane.isDragging) return;
  const rect = canvas.getBoundingClientRect();
  const touch = event.touches ? event.touches[0] : event;
  const x = touch.clientX - rect.left;

  airplane.x = x - airplane.width / 2;
  if (airplane.x < 0) airplane.x = 0;
  if (airplane.x + airplane.width > canvas.width) {
    airplane.x = canvas.width - airplane.width;
  }
}

function handleEnd(event) {
  event.preventDefault();
  airplane.isDragging = false;
}

canvas.addEventListener('mousedown', handleStart);
canvas.addEventListener('mousemove', handleMove);
canvas.addEventListener('mouseup', handleEnd);
canvas.addEventListener('touchstart', handleStart, { passive: false });
canvas.addEventListener('touchmove', handleMove, { passive: false });
canvas.addEventListener('touchend', handleEnd);

// Draw functions
function drawBackground() {
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

function drawAirplane() {
  const img = upgraded ? upgradedAirplaneImg : airplaneImg;
  ctx.drawImage(img, airplane.x, airplane.y, airplane.width, airplane.height);
}

// Game loop
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawAirplane();
  requestAnimationFrame(drawGame);
}

drawGame();
