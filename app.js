//   *********** Game State *************
let board = document.querySelector(".board");
let selectLevel = document.getElementById("levelSelect");
let level = 1;
let cards = level * 4;
let icons = [];
let flippedCards = [];
let moves = 0;
let time = level * 20;
let timer = null;
let match = 0;
let allCards = [];
let notification = false;

//  ****************************************

//        ******** Game start ********
generateIconsArr();
generateLevelSelect();
getSelectedLevel();

renderBoard();

function generateIconsArr() {
  icons = [];
  for (let i = 0; i < cards / 2; i++) {
    icons[i] = `${i}.png`;
  }
  icons = icons.concat(icons);
}

function generateLevelSelect() {
  for (let i = 1; i <= 12; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    selectLevel.appendChild(option);
  }
}

function getSelectedLevel() {
  selectLevel.addEventListener("change", function () {
    level = parseInt(this.value);
    resetGame();
  });
}
//  *********************************

//  ********  UI rendering functions  ********
function renderTimer() {
  document.querySelector(".timer").innerHTML = time;
}

function renderMoves() {
  document.querySelector(".moves").innerHTML = moves;
}

function renderLevel() {
  var currentLevel = selectLevel.selectedIndex + 1;
  if (currentLevel != level) {
    selectLevel.selectedIndex = level - 1;
  }
}

function renderCards() {
  for (let i = 0; i < cards; i++) {
    let random = Math.floor(Math.random() * icons.length);

    let card = document.createElement("div");
    card.classList.add("card");

    let back = document.createElement("div");
    back.classList.add("back");

    let img = document.createElement("img");
    img.src = `./images/${icons[random]}`;
    icons.splice(random, 1);

    let front = document.createElement("div");
    front.classList.add("front");
    // front.innerHTML = "?";

    board.appendChild(card);
    back.appendChild(img);
    card.appendChild(back);
    card.appendChild(front);

    card.addEventListener("click", startTimer);
    card.addEventListener("click", flipCard);
  }
}

function renderBoard() {
  board.innerHTML = "";
  renderTimer();
  renderMoves();
  renderLevel();
  renderCards();

  var cols = Math.ceil(Math.sqrt(cards));

  const isSmallScreen = window.innerWidth < 400;

  while (cards % cols != 0) {
    if (isSmallScreen) {
      cols--;
    } else {
      cols++;
    }
  }

  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  allCards = document.querySelectorAll(".card");
}
//  ************************************************

//   ************  Game Logic  *************
function resetGame() {
  disableAllClicks();
  clearInterval(timer);
  cards = level * 4;
  timer = null;
  moves = 0;
  icons = [];
  flippedCards = [];
  time = level * 20;
  match = 0;
  generateIconsArr();
  renderBoard();
}

function disableAllClicks() {
  allCards.forEach((card) => {
    card.removeEventListener("click", flipCard);
    card.removeEventListener("click", startTimer);
  });
}

function flipCard() {
  if (flippedCards.length >= 2) return;

  this.removeEventListener("click", flipCard);
  allCards.forEach((card) => card.removeEventListener("click", startTimer));
  flippedCards.push(this);
  this.classList.add("flipped");

  if (flippedCards.length == 2) {
    disableAllClicks();
    checkCards();
  }
}

function addClickToAll() {
  var allNotFlipped = document.querySelectorAll(".card:not(.flipped)");
  allNotFlipped.forEach((card) => {
    card.addEventListener("click", flipCard);
  });
}

function checkCards() {
  disableAllClicks();
  moves++;
  renderMoves();
  var img1 = flippedCards[0].querySelector("img").src;
  var img2 = flippedCards[1].querySelector("img").src;
  if (img1 == img2) {
    handleMatch();
  } else {
    handleMismatch();
  }
}

function handleMatch() {
  flippedCards = [];
  match++;
  time += 5;
  notification = true;
  addClickToAll();
  if (match == cards / 2) {
    alert(`Level ${level} Pass`);
    level++;
    if (level > 12) {
      alert("You win!");
      level = 1;
    }
    resetGame();
  }
}

function handleMismatch() {
  notification = false;
  setTimeout(() => {
    flippedCards.forEach((card) => card.classList.remove("flipped"));
    flippedCards = [];
    addClickToAll();
  }, 1000);
}

function startTimer() {
  if (timer) return;
  time--;

  timer = setInterval(function () {
    handleNotification();
    renderTimer();
    time--;
    if (time === 0) {
      alert("Time's up! Game over!!!");
      resetGame();
    }
  }, 1000);
}

function handleNotification() {
  let timeText = document.querySelector(".timer");
  if (notification && !timeText.classList.contains("win")) {
    timeText.classList.add("win");
    notification = false;
  } else {
    timeText.classList.remove("win");
    notification = false;
  }
}
// ************************************************
