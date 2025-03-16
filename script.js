// Select the game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Airplane character
const airplane = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 50,
  height: 50,
  isDragging: false
};

// Load airplane image
const airplaneImg = new Image();
airplaneImg.src = "fly.png";

// Helper function to check if touch/mouse is inside airplane
function isInsideAirplane(x, y) {
  return (
    x >= airplane.x &&
    x <= airplane.x + airplane.width &&
    y >= airplane.y &&
    y <= airplane.y + airplane.height
  );
}

// Handle touch/mouse start
function handleStart(event) {
  event.preventDefault();
  let x = event.touches ? event.touches[0].clientX : event.clientX;
  let y = event.touches ? event.touches[0].clientY : event.clientY;

  if (isInsideAirplane(x, y)) {
    airplane.isDragging = true;
  }
}

// Handle touch/mouse move
function handleMove(event) {
  if (!airplane.isDragging) return;
  event.preventDefault(); // Prevents unwanted scrolling on mobile

  let x = event.touches ? event.touches[0].clientX : event.clientX;
  airplane.x = x - airplane.width / 2;

  // Prevent going off-screen
  airplane.x = Math.max(0, Math.min(canvas.width - airplane.width, airplane.x));
}

// Handle touch/mouse end
function handleEnd() {
  airplane.isDragging = false;
}

// Add event listeners with `{ passive: false }` to allow `preventDefault()`
canvas.addEventListener("mousedown", handleStart);
canvas.addEventListener("mousemove", handleMove);
canvas.addEventListener("mouseup", handleEnd);
canvas.addEventListener("touchstart", handleStart, { passive: false });
canvas.addEventListener("touchmove", handleMove, { passive: false });
canvas.addEventListener("touchend", handleEnd);

// Draw the airplane
function drawAirplane() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(airplaneImg, airplane.x, airplane.y, airplane.width, airplane.height);
  requestAnimationFrame(drawAirplane);
}

// Start game loop
drawAirplane();
