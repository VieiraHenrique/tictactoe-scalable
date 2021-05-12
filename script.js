// DOM variables
const grid = document.getElementById("grid");
const modal = document.getElementById("modal");

// Game variables
const cols = 3;
const rows = 3;
const amountOfPlayers = 2;
const winningLength = 3;

// Utility variables
let cells = [];
let players = {};
let currentPlayer = null;

// Start Game
const startGame = () => {
  cells = [];
  players = {};
  currentPlayer = null;
  definePlayers();
  mapCells();
  mountBoard();
};

// Define values for players (by numbers)
const definePlayers = () => {
  for (let p = 1; p <= amountOfPlayers; p++) {
    players[`player${p}`] = p;
  }
  currentPlayer = players["player1"];
};

// Create 2D array ("cells") for each cell in the game
//// For each row, push an array
//// For each col array, push the value "empty"
const mapCells = () => {
  for (let r = 0; r < rows; r++) {
    cells.push([]);
    for (let c = 0; c < cols; c++) {
      cells[r][c] = "empty";
    }
  }
};

// Mount board
//// Define css grid template columns to be the number of chosen cols
//// For each cell, create a div and give it :
//////// a class of cell
//////// a dataset of x for the x coordinate
//////// a dataset of y for the y coordinate
//// Append cell to the grid
//// Add an event listerner for a click in each cell that will trigger the "handleClick" function with the cell in parameter

const mountBoard = () => {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  cells.forEach((row, rowIndex) => {
    cells[rowIndex].forEach((col, colIndex) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = colIndex;
      cell.dataset.y = rowIndex;
      grid.appendChild(cell);
      cell.addEventListener(
        "click",
        () => {
          handleClick(cell);
        },
        { once: true }
      );
    });
  });
};

// Handle click
//// update cells array to hold the number of the player that has played this particular cell
//// Gives a class to the cell of current player so we can style it accordingly
//// Display the number of the player in the cell in DOM
//// Calls check for win
//// Calls swap player
const handleClick = (cell) => {
  const x = cell.dataset.x;
  const y = cell.dataset.y;
  cells[y][x] = currentPlayer;
  cell.classList.add(`player${currentPlayer}`);
  cell.innerText = currentPlayer;
  if (!checkForWin(cell)) {
    checkForTie();
  }
  swapPlayer();
};

// Swap player
//// Check if there is a next player and assign currentPlayer to it
//// If there isn't a next player, assign player 1 to currentPlayer
const swapPlayer = () => {
  if (players[`player${currentPlayer + 1}`]) {
    currentPlayer = players[`player${currentPlayer + 1}`];
  } else {
    currentPlayer = players["player1"];
  }
};

// Check for win
//// Calls functions to check horizontal, vertical, diagonal to the right and diagonal to the left for a win. Passes the current played cell as argument. If any of the checks returns true, openModal with custom message
const checkForWin = (cell) => {
  console.log(cells);
  if (
    checkHorizontal(cell) ||
    checkVertical(cell) ||
    checkDiagonalToRight(cell) ||
    checkDiagonalToLeft(cell)
  ) {
    openModal(`Player${currentPlayer} WINS`);
  }
};

// Open modal
//// Set modal display to visible
//// Set modal content to custom message
//// Listen for click in the button "play again"
const openModal = (message) => {
  modal.style.display = "flex";
  modal.querySelector(".modal-content p").innerHTML = message;
  modal.querySelector("button").addEventListener(
    "click",
    () => {
      modal.style.display = "none";
      startGame();
    },
    { once: true }
  );
};

// Check for tie
//// Flatens the cells array so we can check if any of its value is "empty"
//// If there are no "empty", it's a tie.
//// openModal with custom message
const checkForTie = () => {
  tempCells = cells.flat();
  if (!tempCells.includes("empty")) {
    openModal(`it's a tie`);
  }
};

// Check consecutive
//// This function will be called by each check(horizontal, vertical and diagonal) to check if there are three consecutive moves from the currentPlayer
////
const checkConsecutive = (arrayToBeTested) => {
  const check = arrayToBeTested.some((elem, index, array) => {
    return (
      array[index] === currentPlayer &&
      array[index + 1] === currentPlayer &&
      array[index + 2] === currentPlayer
    );
  });
  return check;
};

// Check horizontal
//// Select the particular row array
//// Pass this array to the checkConsecutive function
const checkHorizontal = (cell) => {
  const x = cell.dataset.x;
  const y = cell.dataset.y;
  const row = cells[y];

  if (checkConsecutive(row)) {
    return true;
  }
};

// Check vertical
//// Select the particular col array (loops through each row to select the particular position in x)
//// Pass this array to the checkConsecutive function
const checkVertical = (cell) => {
  const x = cell.dataset.x;
  const y = cell.dataset.y;
  const col = [];
  cells.forEach((elem) => {
    col.push(elem[x]);
  });
  if (checkConsecutive(col)) {
    return true;
  }
};

// Check diagonal to right
//// Goes backward through diagonal to find the first cell from this diagonal
//// From this first cell goes forward through the whole diagonal and create an array with each value
//// Pass this array to the checkConsecutive function
const checkDiagonalToRight = (cell) => {
  let x = cell.dataset.x;
  let y = cell.dataset.y;
  const diagonal = [];
  while (x > 0 && y > 0) {
    x--;
    y--;
  }

  diagonal.push(cells[y][x]);
  while (x < cols - 1 && y < rows - 1) {
    x++;
    y++;
    diagonal.push(cells[y][x]);
  }
  if (checkConsecutive(diagonal)) {
    return true;
  }
};

// Check diagonal to left
//// Goes backward through diagonal to find the first cell from this diagonal
//// From this first cell goes forward through the whole diagonal and create an array with each value
//// Pass this array to the checkConsecutive function
const checkDiagonalToLeft = (cell) => {
  let x = cell.dataset.x;
  let y = cell.dataset.y;
  const diagonal = [];
  while (y > 0 && x < cols) {
    x++;
    y--;
  }

  diagonal.push(cells[y][x]);

  while (x > 0 && y < rows - 1) {
    x--;
    y++;
    diagonal.push(cells[y][x]);
  }
  if (checkConsecutive(diagonal)) {
    return true;
  }
};

startGame();
