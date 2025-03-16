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
upgradedAirplaneImg.src = 'joke.png'; // Upgraded airplane image

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
  if (!gameStarted) return;
  event.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
  const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;

  if (isInsideAirplane(x, y)) {
    airplane.isDragging = true;
  }
}

function handleMove(event) {
  if (!gameStarted || !airplane.isDragging) return;
  event.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;

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
canvas.addEventListener('touchend', handleEnd, { passive: false });

// Ensure buttons respond to touch
canvas.addEventListener('click', handleMenuClick);
canvas.addEventListener('touchstart', (e) => handleMenuClick(e.touches[0]), { passive: false });

function handleMenuClick(event) {
  const x = event.clientX;
  const y = event.clientY;

  if (inUpgradeMenu) {
    const birdX = canvas.width / 2 - 50;
    const birdY = canvas.height / 3;

    if (x >= canvas.width / 2 - 100 && x <= canvas.width / 2 + 100 &&
        y >= canvas.height / 2 - 25 && y <= canvas.height / 2 + 25) {
      inUpgradeMenu = false;
      drawMenu();
    }

    if (x >= birdX - 20 && x <= birdX + 120 && y >= birdY && y <= birdY + 120 && coinBank >= 500 && !upgraded) {
      coinBank -= 500;
      upgraded = true;
      drawMenu();
    }
  } else {
    if (x >= canvas.width / 2 - 100 && x <= canvas.width / 2 + 100 &&
        y >= canvas.height / 3 - 25 && y <= canvas.height / 3 + 25) {
      gameStarted = true;
      drawGame();
    }

    if (x >= canvas.width / 2 - 150 && x <= canvas.width / 2 + 150 &&
        y >= canvas.height / 2 - 25 && y <= canvas.height / 2 + 25) {
      inUpgradeMenu = true;
      drawUpgradeMenu();
    }
  }
}

// Start the game when the page loads
drawMenu();
