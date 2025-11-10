//   *********** Game State *************
let board = document.querySelector(".board");
let level = 1;
let cards = 8;
let icons = [];
let flippedCards = [];
let attempts = 0;
let time = 20;
let timer;
let wins = 0;
let allCards = [];
//  ****************************************

//        ******** Game start ********
generateIconsArr();

renderBoard();

function generateIconsArr() {
  for (let i = 0; i < cards / 2; i++) {
    icons[i] = `${i}.png`;
  }
  icons = icons.concat(icons);
}
//  *********************************

//  ********  UI rendering functions  ********
function renderTimer() {
  let timeLeft = document.querySelector(".timer");
  timeLeft.innerHTML = `Time left: ${time} s`;
}

function renderAttempts() {
  var h3 = document.querySelector(".attempts");
  h3.innerHTML = `attempts: ${attempts}`;
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
    front.innerHTML = "?";

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
  renderAttempts();
  renderCards();
  var boardMaxWidth = Math.floor(window.innerWidth * 0.6);
  var cols = Math.ceil(Math.sqrt(cards));
  var colWidth = Math.ceil(boardMaxWidth / cols);

  //   while (cards % cols !== 0) {
  //     cols--;
  //   }

  board.style.gridTemplateColumns = `repeat(${cols}, ${colWidth}px)`;

  allCards = document.querySelectorAll(".card");
}
//  ************************************************

//   ************  Game Logic  *************
function resetGame() {
  disableAllClicks();
  clearInterval(timer);
  timer = null;
  attempts = 0;
  icons = [];
  flippedCards = [];
  time = 20;
  wins = 0;
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
  attempts++;
  renderAttempts();
  var img1 = flippedCards[0].querySelector("img").src;
  var img2 = flippedCards[1].querySelector("img").src;
  if (img1 == img2) {
    flippedCards = [];
    wins++;
    addClickToAll();
    if (wins == cards / 2) {
      setTimeout(() => {
        alert(`Level ${level} Pass`);
        resetGame();
        level++;
      }, 100);
    }
  } else {
    setTimeout(function resetCards() {
      flippedCards.forEach((card) => card.classList.remove("flipped"));
      flippedCards = [];
      addClickToAll();
    }, 1000);
  }
}

function startTimer() {
  if (timer) return;
  timer = setInterval(function () {
    time--;
    renderTimer();
    if (time === 0) {
      alert("Time's up! Game over!!!");
      resetGame();
    }
  }, 1000);
}
// ************************************************
