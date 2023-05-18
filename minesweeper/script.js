import { toggleMode } from "./js/mode.js";
import { createPage } from "./js/page.js";
import { createBoard } from "./js/board.js";
import { getMinesPositions, positionExists, getTilePosition, getNearTiles, countNearMines } from "./js/tiles.js";
import { endGame, closePopup } from "./js/popup.js";
import { disableSettings, enableSettings, revealTile, cleanTiles } from "./js/utils.js";

//
// ELEMENTS
let buttonPlay;
let buttonStop;
let buttonMode;
let tiles;

let buttonPopupClose;

let secondsElement;
let movesElement;
let flagsElement;
let remainedElement;

let buttonsSize;
let buttonOk;
let input;

//
//
let size = 10;
let minesCount = 10;

let moves = 0;
let seconds = 0;
let flags = 0;
let remainedMines;

let timerId;

let gameStarted = false;
let success;

let inputFocused = false;

let minePositions = [];

//
//
createPage();
createBoard(size, minesCount);

initEvents();
setRemainedMinesValue();

//
// INIT EVENTS
function initEvents() {
  buttonPlay = document.querySelector(".button__play");
  buttonStop = document.querySelector(".button__stop");
  buttonMode = document.querySelector(".button__toggle-mode");
  tiles = Array.from(document.querySelectorAll(".button__tile"));

  buttonPopupClose = document.querySelector(".button__popup--close");

  secondsElement = document.querySelector(".seconds");
  movesElement = document.querySelector(".moves");
  flagsElement = document.querySelector(".flags--marked");
  remainedElement = document.querySelector(".mines--remained");

  buttonsSize = Array.from(document.querySelectorAll(".button__size"));
  buttonOk = document.querySelector(".button__ok");
  input = document.querySelector(".input");

  //
  // EVENTS
  buttonPlay.addEventListener("click", startGame);
  buttonStop.addEventListener("click", stopGame);

  buttonMode.addEventListener("click", toggleMode);

  tiles.forEach((tile) => {
    tile.addEventListener("click", handleLeftClick);
    tile.addEventListener("contextmenu", handleRightClick);
  });

  buttonsSize.forEach((button) => {
    button.addEventListener("click", updateSize);
  });

  buttonOk.addEventListener("click", updateMinesCount);
  input.addEventListener("focus", () => inputFocused = true);
  input.addEventListener("blur", updateMinesCount);

  buttonPopupClose.addEventListener("click", () => {
    closePopup();
    stopGame();
  });
}

//
//


//
// LEFT CLICK
function handleLeftClick(e) {
  if (!gameStarted) return;

  const tile = e.target;
  const tileState = tile.dataset.state;

  if (tileState !== "hidden") return;

  openTile(tile);
  updateMovesCount();

  if (moves === 1 && !minePositions.length) {
    minePositions = getMinesPositions(minesCount, size);

    console.log("💣 Mines: ", minePositions);
  } else return;
}

//
// RIGHT CLICK
function handleRightClick(e) {
  e.preventDefault();

  if (!gameStarted) return;

  const tile = e.target;
  const tileState = tile.dataset.state;

  if (tileState === "hidden") {
    markTile(tile);
  } else if (tileState === "marked") {
    unmarkTile(tile);
  }

  if (moves === 1 && !minePositions.length) {
    minePositions = getMinesPositions(minesCount, size);

    console.log("💣 Mines: ", minePositions);
  } else return;
}

//
// START GAME
function startGame() {
  if (!gameStarted) {
    gameStarted = true;

    startTimer();
    disableSettings(buttonsSize, buttonOk, input);

    console.log("Game started...");
  } else return;
}

//
// STOP GAME
function stopGame() {
  if (gameStarted) {
    gameStarted = false;

    minePositions = [];

    cleanTiles(tiles);
    nullTimer();
    nullMoves();
    nullMines();

    enableSettings(buttonsSize, buttonOk, input);

    console.log("Game stopped!");
  } else return;
}

//
// OPEN TILE
function openTile(tile) {
  const tilePos = getTilePosition(tile);
  const isMine = positionExists(minePositions, tilePos);

  if (isMine) {
    tile.dataset.state = "mine";

    success = false;

    pauseTimer();
    endGame(success);
  } 
  
  if (!isMine) {
    const count = countNearMines(tile, minePositions, size);

    if (count) {
      revealTile(tile, count);
    } else {
      revealTile(tile);
      revealNearTiles(tile);
    }

    if (isSuccess()) {
      success = true;

      pauseTimer();
      endGame(success, moves, seconds);
    }
  }
}

//
// REVEAL NEAR TILES
function revealNearTiles(tile) {
  if (moves < 1) return;

  const nearTiles = getNearTiles(tiles, tile, size);

  nearTiles.forEach((tile) => {
    const count = countNearMines(tile, minePositions, size);

    if (tile.dataset.state === "hidden" && !count) {
      revealTile(tile);
      revealNearTiles(tile);
    } else if (tile.dataset.state === "hidden" && count) {
      revealTile(tile, count);
    }
  });
}

//
//
//


//
// CHECK SUCCESS
function isSuccess() {
  const closedTiles = tiles.filter((tile) => {
    return tile.dataset.state === "hidden" || tile.dataset.state === "marked";
  });

  return closedTiles.length === minesCount;
}

//
// UPDATE MOVES
function updateMovesCount() {
  moves += 1;
  movesElement.textContent = moves;
}

//
// NULL MOVES
function nullMoves() {
  moves = 0;
  movesElement.textContent = moves;
}

//
// START TIMER
function startTimer() {
  // increaseSeconds();
  timerId = setInterval(() => {
    seconds += 1;
    secondsElement.textContent = seconds;
  }, 1000);
}

//
// NULL TIMER
function nullTimer() {
  seconds = 0;
  secondsElement.textContent = seconds;

  clearInterval(timerId);
}

//
// NULL MARKED MINES
function nullMines() {
  flags = 0;
  remainedMines = minesCount;

  flagsElement.textContent = flags;
  remainedElement.textContent = remainedMines;
}

//
// PAUSE TIMER
function pauseTimer() {
  clearInterval(timerId);
}

//
// UPDATE SECONDS
// function increaseSeconds() {
//   seconds += 1;
//   secondsElement.textContent = seconds;
// }

//
// MARK TILE
function markTile(tile) {
  tile.dataset.state = "marked";

  flags += 1;
  remainedMines -= 1;

  flagsElement.textContent = flags;
  remainedElement.textContent = remainedMines;
}

//
// UNMARK TILE
function unmarkTile(tile) {
  tile.dataset.state = "hidden";

  flags -= 1;
  remainedMines += 1;

  flagsElement.textContent = flags;
  remainedElement.textContent = remainedMines;
}

//
// SIZE
function updateSize(e) {
  const button = e.target;
  const selectedSize = e.target.dataset.size;

  if (gameStarted) return;
  if (button.classList.contains("button__size--selected")) return;

  size = selectedSize;

  createBoard(size, minesCount);
  stopGame();
  initEvents();

  buttonsSize.forEach((button) => {
    button.classList.remove("button__size--selected");
  });

  button.classList.add("button__size--selected");
}

//
// UPDATE MINES COUNT
function updateMinesCount() {
  if (gameStarted) return;
  if (!inputFocused) return;

  if (input.value < 10) input.value = 10;
  if (input.value > 99) input.value = 99;

  minesCount = input.value;

  setRemainedMinesValue();

  input.blur();
  inputFocused = false;
}

//
// SET REMAINED VALUE
function setRemainedMinesValue() {
  remainedMines = minesCount;
  remainedElement.textContent = remainedMines;
}

