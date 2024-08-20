const gameGrid = document.getElementById('game-grid');
const moveCounter = document.getElementById('move-counter');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');

let cards = [
    { id: 1, icon: '🍎' },
    { id: 2, icon: '🍌' },
    { id: 3, icon: '🍇' },
    { id: 4, icon: '🍉' },
    { id: 5, icon: '🍒' },
    { id: 6, icon: '🍍' },
    { id: 7, icon: '🥝' },
    { id: 8, icon: '🍓' }
];

let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let matchedPairs = 0;
let moves = 0;
let timer;
let timeElapsed = 0;

function startGame() {
    resetGame();

    let shuffledCards = shuffle([...cards, ...cards]);
    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.icon = card.icon;

        cardElement.innerHTML = `
            <div class="inner">
                <div class="front">${card.icon}</div>
                <div class="back"></div>
            </div>
        `;
        
        cardElement.addEventListener('click', flipCard);
        gameGrid.appendChild(cardElement);
    });

    timer = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = timeElapsed;
    }, 1000);
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    moveCounter.textContent = moves;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    resetBoard();
    matchedPairs++;

    if (matchedPairs === cards.length) {
        clearInterval(timer);
        alert(`You won! Time: ${timeElapsed} seconds, Moves: ${moves}`);
    }
}

function unflipCards() {
    lockBoard = true;
    
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function resetGame() {
    gameGrid.innerHTML = '';
    moveCounter.textContent = 0;
    timerDisplay.textContent = 0;
    clearInterval(timer);

    moves = 0;
    timeElapsed = 0;
    matchedPairs = 0;
    [firstCard, secondCard] = [null, null];
    [hasFlippedCard, lockBoard] = [false, false];
}

restartBtn.addEventListener('click', startGame);

startGame();
