document.addEventListener("DOMContentLoaded", function() {
  const gameBoard = document.getElementById("game-board");
  const startButton = document.getElementById("start-button");
  const stopButton = document.getElementById("stop-button");

  let snake = [{ x: 10, y: 10 }];
  let food = { x: 5, y: 5 };
  let direction = "right";
  let intervalId;

  function createGameBoard() {
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.id = `cell-${i}-${j}`;
        gameBoard.appendChild(cell);
      }
    }
  }

  function drawSnake() {
    snake.forEach(function(segment) {
      const cell = document.getElementById(`cell-${segment.x}-${segment.y}`);
      cell.classList.add("snake");
    });
  }

  function eraseSnake() {
    snake.forEach(function(segment) {
      const cell = document.getElementById(`cell-${segment.x}-${segment.y}`);
      cell.classList.remove("snake");
    });
  }

  function drawFood() {
    const cell = document.getElementById(`cell-${food.x}-${food.y}`);
    cell.classList.add("food");
  }

  function eraseFood() {
    const cell = document.getElementById(`cell-${food.x}-${food.y}`);
    cell.classList.remove("food");
  }

  function moveSnake() {
    const head = Object.assign({}, snake[0]);

    if (direction === "right") {
      head.y++;
    } else if (direction === "left") {
      head.y--;
    } else if (direction === "up") {
      head.x--;
    } else if (direction === "down") {
      head.x++;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      generateFood();
    } else {
      snake.pop();
    }
  }

  function generateFood() {
    const occupiedCells = snake;
    const emptyCells = [];

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        const isOccupied = occupiedCells.some(function(segment) {
          return segment.x === i && segment.y === j;
        });

        if (!isOccupied) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      // No empty cells available
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    food = emptyCells[randomIndex];
  }

  function handleKeyDown(event) {
    if (event.keyCode === 37 && direction !== "right") {
      direction = "left";
    } else if (event.keyCode === 38 && direction !== "down") {
      direction = "up";
    } else if (event.keyCode === 39 && direction !== "left") {
      direction = "right";
    } else if (event.keyCode === 40 && direction !== "up") {
      direction = "down";
    }
  }

  function startGame() {
    intervalId = setInterval(function() {
      eraseSnake();
      moveSnake();
      if (checkCollision()) {
        clearInterval(intervalId);
        alert("游戏结束！");
        snake = [{ x: 10, y: 10 }];
        direction = "right";
        drawSnake();
        return;
      }
      drawSnake();
    }, 200);
    drawFood();
    startButton.disabled = true;
  }

  function stopGame() {
    clearInterval(intervalId);
    eraseSnake();
    eraseFood();
    startButton.disabled = false;
  }

  function checkCollision() {
    const head = snake[0];
    if (
      head.x < 0 ||
      head.x >= 20 ||
      head.y < 0 ||
      head.y >= 20 ||
      snake.slice(1).some(function(segment) {
        return segment.x === head.x && segment.y === head.y;
      })
    ) {
      return true;
    }
    return false;
  }

  createGameBoard();
  drawSnake();

  startButton.addEventListener("click", startGame);
  stopButton.addEventListener("click", stopGame);
  document.addEventListener("keydown", handleKeyDown);
});
