let board = document.querySelector(".board");
let cards = 8;
let icons = [];
let flippedCards = [];
let atempts = 0;
let timer = 90;

let timeLeft = document.querySelector(".timer");
timeLeft.innerHTML = `Time left: ${timer} s`;

function renderTimer() {
  var startTimer = setInterval(function () {
    timer--;
    timeLeft.innerHTML = `Time left: ${timer} s`;
  }, 1000);
}

function renderAtempts() {
  var h3 = document.querySelector(".atempts");

  h3.innerHTML = `Atempts: ${atempts}`;
}

generateIconsArr();

renderCards(cards);

let allCards = document.querySelectorAll(".card");

function generateIconsArr() {
  for (let i = 0; i < cards / 2; i++) {
    icons[i] = `${i}.png`;
  }
  icons = icons.concat(icons);
}

function flipCard() {
  this.removeEventListener("click", flipCard);
  allCards.forEach((card) => card.removeEventListener("click", startTimer));
  flippedCards.push(this);
  this.classList.add("flipped");

  if (flippedCards.length == 2) {
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
  stopAllClicks();
  atempts++;
  renderAtempts();
  var back1 = flippedCards[0].querySelector(".back");
  var back2 = flippedCards[1].querySelector(".back");
  if (back1.innerHTML == back2.innerHTML) {
    flippedCards = [];
    addClickToAll();
    console.log("pogodok");
  } else {
    console.log("promasaj");
    setTimeout(function resetCards() {
      flippedCards.forEach((card) => card.classList.remove("flipped"));
      flippedCards = [];
      addClickToAll();
    }, 1000);
  }
}

function stopAllClicks() {
  allCards.forEach((card) => card.removeEventListener("click", flipCard));
}

function renderCards(cards) {
  renderAtempts();
  var boardMaxWidth = Math.floor(window.innerWidth * 0.6);
  var cols = Math.ceil(Math.sqrt(cards));
  var colWidth = Math.ceil(boardMaxWidth / cols);

  //   while (cards % cols !== 0) {
  //     cols--;
  //   }

  board.style.gridTemplateColumns = `repeat(${cols}, ${colWidth}px)`;

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

function startTimer() {
  renderTimer();
}
