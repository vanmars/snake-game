let canvas = document.getElementById("canvas");
let score = document.getElementById("score");
let playButton = document.getElementById("play");
let ctx = canvas.getContext("2d");

// Initial Styling
ctx.strokeStyle = "#fff";
ctx.lineWidth = 3;

// Core Objects
let board = [];
let snake = {};
let food = {
  x: 0,
  y: 0
};

// Interval Variables
let updateInterval = null;
let moveSnakeInterval = null;

// Helper Variables
cellsWide = 20
cellsTall = 20;
boardWidth = canvas.width;
boardHeight = canvas.height;
cellWidth = boardWidth / cellsWide;
cellHeight = boardHeight / cellsTall;

// Fill Board Array
for(let row = 0; row < cellsTall; row++){
  board.push([]);
  for(let column = 0; column < cellsWide; column++){
    board[row].push({
      isFood: false,
      color: "#fff"
    })
  }
}

const update = () => {
  ctx.clearRect(0,0, boardWidth, boardHeight);
  for(let row = 0; row < cellsTall; row++){
    for(let column = 0; column < cellsWide; column++){
      if (board[row][column].isFood) {
        ctx.fillStyle = "#00f";
      } else {
        ctx.fillStyle = "#777";
      }
      ctx.fillRect(
        column * cellWidth,
        row * cellHeight,
        cellWidth,
        cellHeight
      );
      ctx.strokeRect(
        column * cellWidth,
        row * cellHeight,
        cellWidth,
        cellHeight
      );
    } 
  }
  for (let segIndex = 0; segIndex < snake.segments.length; segIndex++) {
    let segment = snake.segments[segIndex];
    if (segIndex === snake.segments.length - 1) {
      ctx.fillStyle = "#f88";
    } else {
      ctx.fillStyle = "#f00";
    }
    ctx.fillRect(
      segment.x * cellWidth,
      segment.y * cellHeight,
      cellWidth,
      cellHeight
    );
  }
}

const moveSnake = () => {
  if (snake.direction === "up") {
    snake.y--;
  } else if (snake.direction === "down") {
    snake.y++;
  } else if (snake.direction === "right") {
    snake.x++;
  } else if (snake.direction === "left") {
    snake.x--;
  }
  // check to see if the snake is in bounds
  if (snake.x < 0 || snake.y < 0 || snake.x > cellsWide || snake.y > cellsTall) {
    gameOver();
  }
  // push a new segment onto the last index of segments
  // this means the segments are indexed backwards
  snake.segments.push({
    x: snake.x,
    y: snake.y
  });
  // shift removes the first element (index 0) from
  // the array, this is the last segment
  snake.segments.shift();
  // loop over all the segments except the first one
  // and check to see if we've collided
  for (let segIndex = 0; segIndex < snake.segments.length - 1; segIndex++) {
    let segment = snake.segments[segIndex];
    if (segment.x === snake.x && segment.y === snake.y) {
      gameOver();
    }
  }
  // try to eat a food if the snake is over one
  eatFood();
}

const gameOver = () => {
  window.clearInterval(updateInterval);
  window.clearInterval(moveSnakeInterval);
  updateInterval = null;
  moveSnakeInterval = null;
}

const placeFood = () => {
  board[food.y][food.x].isFood = false;
  food.x = Math.floor(Math.random() * cellsWide);
  food.y = Math.floor(Math.random() * cellsTall);
  board[food.y][food.x].isFood = true;
}

const eatFood = () => {
  if (snake.x === food.x && snake.y === food.y) {
    snake.length++;
    snake.segments.push({
      x: snake.x,
      y: snake.y
    });
    score.innerText = snake.length - 3;
    placeFood();
  }
}

playButton.addEventListener("click", () => {
  playButton.innerText = "Reset";
  snake = {
    x: 10,
    y: 10,
    segments: [],
    length: 3,
    direction: "up"
  };
  for (let seg = 0; seg < 3; seg++) {
    snake.segments.push({
      x: 10,
      y: 12 - seg
    });
  }
  placeFood();
  window.clearInterval(updateInterval);
  window.clearInterval(moveSnakeInterval);
  updateInterval = window.setInterval(update, 33);
  moveSnakeInterval = window.setInterval(moveSnake, 125);
});

window.addEventListener("keydown",(event) => {
  if ((event.key === "w" || event.which === 38) && snake.direction !== "down") {
    snake.direction = "up";
  } else if (
    (event.key === "a" || event.which === 37) &&
    snake.direction !== "right"
  ) {
    snake.direction = "left";
  } else if (
    (event.key === "s" || event.which === 40) &&
    snake.direction !== "up"
  ) {
    snake.direction = "down";
  } else if (
    (event.key === "d" || event.which === 39) &&
    snake.direction !== "left"
  ) {
    snake.direction = "right";
  }
});

