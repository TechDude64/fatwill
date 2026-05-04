const img = document.getElementById('fatWill');
const burger = document.getElementById('burger');
const mouthZone = document.getElementById('mouthZone');
const winPopup = document.getElementById('winPopup');
const playAgainBtn = document.getElementById('playAgainBtn');
const timerDisplay = document.getElementById('timerDisplay');
const finalTimeDisplay = document.getElementById('finalTimeDisplay');

// Prevent native drag on both images
burger.addEventListener('dragstart', e => e.preventDefault());
img.addEventListener('dragstart', e => e.preventDefault());

let step = 0;
const maxStep = 5;
const widths = ['40vw', '52vw', '64vw', '76vw', '88vw', '100vw'];
img.style.width = widths[0];

// Drag state
let offsetX = 0, offsetY = 0;
let isDragging = false;

// Timer state
let startTime = 0;
let timerInterval = null;
let isTimerRunning = false;

function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms) % 1000;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

function updateTimer() {
    const currentTime = performance.now();
    const elapsedTime = currentTime - startTime;
    timerDisplay.textContent = formatTime(elapsedTime);
}

function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        startTime = performance.now();
        timerInterval = setInterval(updateTimer, 10);
    }
}

function stopTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
}

// Mouse events
burger.addEventListener('mousedown', (e) => {
    startTimer();
    isDragging = true;
    offsetX = e.clientX - burger.offsetLeft;
    offsetY = e.clientY - burger.offsetTop;
    burger.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    burger.style.left = (e.clientX - offsetX) + 'px';
    burger.style.top = (e.clientY - offsetY) + 'px';
});

document.addEventListener('mouseup', handleDrop);

// Touch events
burger.addEventListener('touchstart', (e) => {
    startTimer();
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - burger.offsetLeft;
    offsetY = touch.clientY - burger.offsetTop;

    
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    burger.style.left = (touch.clientX - offsetX) + 'px';
    burger.style.top = (touch.clientY - offsetY) + 'px';
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', handleDrop);

function handleDrop(e) {
    if (!isDragging) return;
    isDragging = false;
    burger.style.cursor = 'grab';
    // Check if dropped on mouthZone
    const burgerRect = burger.getBoundingClientRect();
    const mouthRect = mouthZone.getBoundingClientRect();
    if (
        burgerRect.left < mouthRect.right &&
        burgerRect.right > mouthRect.left &&
        burgerRect.top < mouthRect.bottom &&
        burgerRect.bottom > mouthRect.top
    ) {
        // Stretch Will
        step = (step + 1) % (maxStep + 1);
        img.style.width = widths[step];
        
                // Check if game is done
                if (step === maxStep) {
                    stopTimer();
                    setTimeout(() => {
                        showWinPopup();
                    }, 500);
                }
        
        // Move burger to random position
        const winW = window.innerWidth - burger.width;
        const winH = window.innerHeight - burger.height;
        const randX = Math.random() * winW;
        const randY = Math.random() * winH;
        burger.style.left = randX + 'px';
        burger.style.top = randY + 'px';
    }
}

function showWinPopup() {
    finalTimeDisplay.textContent = `Time: ${timerDisplay.textContent}`;
    winPopup.style.display = 'flex';
    // Trigger reflow
    void winPopup.offsetWidth;
    winPopup.classList.add('show');
}

function hideWinPopup() {
    winPopup.classList.remove('show');
    setTimeout(() => {
        winPopup.style.display = 'none';
        // Reset game
        step = 0;
        img.style.width = widths[0];
        timerDisplay.textContent = "00:00.000";
    }, 300);
}

playAgainBtn.addEventListener('click', hideWinPopup);