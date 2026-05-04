const img = document.getElementById('fatWill');
const burger = document.getElementById('burger');
const mouthZone = document.getElementById('mouthZone');
const winPopup = document.getElementById('winPopup');
const playAgainBtn = document.getElementById('playAgainBtn');
const timerDisplay = document.getElementById('timerDisplay');
const finalTimeDisplay = document.getElementById('finalTimeDisplay');
const leaderboardBtn = document.getElementById('leaderboardBtn');
const leaderboardPopup = document.getElementById('leaderboardPopup');
const closeLeaderboardBtn = document.getElementById('closeLeaderboardBtn');
const winLeaderboardBtn = document.getElementById('winLeaderboardBtn');

// Hamburger menu elements
const hamburgerBtn = document.getElementById('hamburgerBtn');
const menuDropdown = document.getElementById('menuDropdown');

// Supabase setup
const supabaseUrl = 'https://umocrvwffkxiusdxsgjs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtb2NydndmZmt4aXVzZHhzZ2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODkyNjksImV4cCI6MjA5MjM2NTI2OX0.hcwj6jyT9d_CHtv9EiLlQUgNyiFdFtNnFqrvRSQhRhU';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

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
    const finalTime = timerDisplay.textContent;
    finalTimeDisplay.textContent = `Time: ${finalTime}`;
    winPopup.style.display = 'flex';
    // Trigger reflow
    void winPopup.offsetWidth;
    winPopup.classList.add('show');

    // Submit score to leaderboard
    submitScore(finalTime);
}

function hideWinPopup() {
    winPopup.classList.remove('show');
    setTimeout(() => {
        winPopup.style.display = 'none';
        // Reset game
        step = 0;
        img.style.width = widths[0];
        timerDisplay.textContent = "00:00.000";
        burger.style.left = '140px';
        burger.style.top = '20px';
    }, 300);
}

function submitScore(timeString) {
    if (!supabase) {
        console.error('Supabase not loaded');
        return;
    }
    // Parse time string "MM:SS.mmm" to milliseconds
    const parts = timeString.split(':');
    const minutes = parseInt(parts[0]);
    const secondsParts = parts[1].split('.');
    const seconds = parseInt(secondsParts[0]);
    const milliseconds = parseInt(secondsParts[1]);
    const totalMs = minutes * 60000 + seconds * 1000 + milliseconds;

    supabase
        .from('leaderboard')
        .insert([{ time_ms: totalMs }])
        .then(({ data, error }) => {
            if (error) {
                console.error('Error submitting score:', error);
            } else {
                console.log('Score submitted:', data);
            }
        });
}

playAgainBtn.addEventListener('click', hideWinPopup);
winLeaderboardBtn.addEventListener('click', () => {
    hideWinPopup();
    showLeaderboard();
});
leaderboardBtn.addEventListener('click', () => {
    showLeaderboard();
    closeHamburgerMenu();
});
closeLeaderboardBtn.addEventListener('click', hideLeaderboard);

// Hamburger menu functionality
hamburgerBtn.addEventListener('click', toggleHamburgerMenu);

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburgerBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
        closeHamburgerMenu();
    }
});

function toggleHamburgerMenu() {
    const isOpen = menuDropdown.classList.contains('show');
    if (isOpen) {
        closeHamburgerMenu();
    } else {
        openHamburgerMenu();
    }
}

function openHamburgerMenu() {
    menuDropdown.classList.add('show');
    hamburgerBtn.classList.add('active');
}

function closeHamburgerMenu() {
    menuDropdown.classList.remove('show');
    hamburgerBtn.classList.remove('active');
}

function showLeaderboard() {
    fetchLeaderboard();
    leaderboardPopup.style.display = 'flex';
    void leaderboardPopup.offsetWidth;
    leaderboardPopup.classList.add('show');
}

function hideLeaderboard() {
    leaderboardPopup.classList.remove('show');
    setTimeout(() => {
        leaderboardPopup.style.display = 'none';
    }, 300);
}

async function fetchLeaderboard() {
    if (!supabase) {
        leaderboardList.innerHTML = '<p>Leaderboard unavailable</p>';
        return;
    }
    const { data, error } = await supabase
        .from('leaderboard')
        .select('time_ms, created_at')
        .order('time_ms', { ascending: true })
        .limit(10);

    if (error) {
        console.error('Error fetching leaderboard:', error);
        leaderboardList.innerHTML = '<p>Error loading leaderboard</p>';
        return;
    }

    leaderboardList.innerHTML = '';
    data.forEach((entry, index) => {
        const li = document.createElement('div');
        li.style.marginBottom = '10px';
        li.style.padding = '5px';
        li.style.borderBottom = '1px solid #ccc';
        li.innerHTML = `<strong>${index + 1}.</strong> ${formatTime(entry.time_ms)} <small>(${new Date(entry.created_at).toLocaleDateString()})</small>`;
        leaderboardList.appendChild(li);
    });
}