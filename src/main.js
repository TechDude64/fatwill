import { createClient } from '@supabase/supabase-js'

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
const leaderboardList = document.getElementById('leaderboardList');
const authStatus = document.getElementById('authStatus');
const userInfo = document.getElementById('userInfo');
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const authPopup = document.getElementById('authPopup');
const authTitle = document.getElementById('authTitle');
const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('emailInput');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authToggle = document.getElementById('authToggle');
const closeAuthBtn = document.getElementById('closeAuthBtn');
const authError = document.getElementById('authError');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const menuDropdown = document.getElementById('menuDropdown');
const statsBtn = document.getElementById('statsBtn');
const statsPopup = document.getElementById('statsPopup');
const closeStatsBtn = document.getElementById('closeStatsBtn');
const statsContainer = document.getElementById('statsContainer');

// Supabase setup
const supabaseUrl = 'https://umocrvwffkxiusdxsgjs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtb2NydndmZmt4aXVzZHhzZ2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODkyNjksImV4cCI6MjA5MjM2NTI2OX0.hcwj6jyT9d_CHtv9EiLlQUgNyiFdFtNnFqrvRSQhRhU';
const supabase = createClient(supabaseUrl, supabaseKey);

// Auth state
let currentUser = null;
let isSignUp = false;

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


function getLocation() {
    if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log(`Latitude: ${lat}, Longitude: ${lon}`);
  }, (error) => {
    console.error("Error Code: " + error.code + " - " + error.message);
  });
} else {
  console.log("Geolocation is not supported by this browser.");
}
return lat, lon;
}
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
                    burger.style.display = 'none';
                    setTimeout(() => {
                        showWinPopup();
                    }, 500);
                } else {
                    // Move burger to random position
                    const winW = window.innerWidth - burger.width;
                    const winH = window.innerHeight - burger.height;
                    const randX = Math.random() * winW;
                    const randY = Math.random() * winH;
                    burger.style.left = randX + 'px';
                    burger.style.top = randY + 'px';
                }
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
        burger.style.display = '';
    }, 300);
}

async function submitScore(timeString) {
    if (!supabase) {
        console.error('Supabase not loaded');
        return;
    }

    // Anti-cheat: Check if burger or mouthZone sizes were altered from expected values
    const expectedBurgerStyle = "width: 8.5%; height: auto; position: absolute; z-index: 3; cursor: grab; user-drag: none; user-select: none;".replace(/\s+/g, '');
    const currentBurgerStyle = burger.getAttribute('style').replace(/left:\s*[^;]+;|top:\s*[^;]+;|display:\s*[^;]+;/g, '').replace(/\s+/g, '');
    
    const expectedMouthStyle = "position:absolute;left:50%;top:40%;width:80px;height:40px;transform:translate(-50%,-50%);z-index:2;".replace(/\s+/g, '');
    const currentMouthStyle = mouthZone.getAttribute('style').replace(/\s+/g, '');
    
    // We check against the current expected styles, if they don't match, we block the score
    // Since styles can be slightly varied by the browser, we check the specific width properties instead
    
    const isBurgerWidthValid = burger.style.width === '8.5%';
        const isMouthWidthValid = mouthZone.style.width === '4.16vw';
        const isMouthHeightValid = mouthZone.style.height === '3.7vh';

    if (!isBurgerWidthValid || !isMouthWidthValid || !isMouthHeightValid) {
        alert('Cheating detected! Game files were modified. Your IP Address and Location have been recorded \n Your score will not be submitted.');
        return;
    }

    if (!currentUser) {
        alert('Please sign in to save your score!');
        showAuthPopup(false);
        return;
    }

    // Parse time string "MM:SS.mmm" to milliseconds
    const parts = timeString.split(':');
    const minutes = parseInt(parts[0]);
    const secondsParts = parts[1].split('.');
    const seconds = parseInt(secondsParts[0]);
    const milliseconds = parseInt(secondsParts[1]);
    const totalMs = minutes * 60000 + seconds * 1000 + milliseconds;

    try {
        // Check if user has a profile (meaning they signed up with username)
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', currentUser.id)
            .single();

        if (profileError && profileError.code === 'PGRST116') { // Profile not found
            alert('Please sign up again to set a username before submitting scores!');
            handleSignOut(); // Sign them out so they can sign up properly
            return;
        } else if (profileError) {
            console.error('Error checking profile:', profileError);
            return;
        }

        // User has a profile with username from signup, submit the score
        const { data, error } = await supabase
            .from('leaderboard')
            .insert([{ time_ms: totalMs, profile_id: currentUser.id }]);

        if (error) {
            console.error('Error submitting score:', error);
        } else {
            console.log('Score submitted:', data);
        }
    } catch (error) {
        console.error('Error in submitScore:', error);
    }
}

playAgainBtn.addEventListener('click', hideWinPopup);
leaderboardBtn.addEventListener('click', () => {
    showLeaderboard();
    closeHamburgerMenu();
});
closeLeaderboardBtn.addEventListener('click', hideLeaderboard);
statsBtn.addEventListener('click', () => {
    showStats();
    closeHamburgerMenu();
});
closeStatsBtn.addEventListener('click', hideStats);
signInBtn.addEventListener('click', () => {
    showAuthPopup(false);
    closeHamburgerMenu();
});
signOutBtn.addEventListener('click', () => {
    handleSignOut();
    closeHamburgerMenu();
});
authForm.addEventListener('submit', handleAuthSubmit);
authToggle.addEventListener('click', () => showAuthPopup(!isSignUp));
closeAuthBtn.addEventListener('click', hideAuthPopup);

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
    menuDropdown.style.display = 'flex';
    // Trigger reflow
    void menuDropdown.offsetWidth;
    menuDropdown.classList.add('show');
    hamburgerBtn.classList.add('active');
}

function closeHamburgerMenu() {
    menuDropdown.classList.remove('show');
    hamburgerBtn.classList.remove('active');
    setTimeout(() => {
        if (!menuDropdown.classList.contains('show')) {
            menuDropdown.style.display = 'none';
        }
    }, 300);
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

function showStats() {
    fetchStats();
    statsPopup.style.display = 'flex';
    void statsPopup.offsetWidth;
    statsPopup.classList.add('show');
}

function hideStats() {
    statsPopup.classList.remove('show');
    setTimeout(() => {
        statsPopup.style.display = 'none';
    }, 300);
}

async function fetchStats() {
    if (!supabase) {
        statsContainer.innerHTML = '<p>Statistics unavailable</p>';
        return;
    }
    
    try {
        const { count, error: countError } = await supabase
            .from('leaderboard')
            .select('*', { count: 'exact', head: true });

        const { count: profilesCount, error: profilesError } = await supabase
            .from('profiles') 
            .select('*', { count: 'exact', head: true });

        if (countError || profilesError) {
            throw new Error('Error fetching data');
        }

        // Stats calculation
        let totalPlayers = profilesCount || 0;
        let gamesPlayed = count || 0;
        let totalBurgers = gamesPlayed * 5;
        let totalCost = totalBurgers * 8.70;
        let roundedCost = totalCost.toFixed(2);
        let totalGigaCalories = totalBurgers * 621 / 1000000;
        let totalCows = totalBurgers * 9 / 20000;
        let roundedCows = totalCows.toFixed(2);
        let wheatGrains = totalBurgers * 2750;
        
        statsContainer.innerHTML = `
            <div class="leaderboard-entry silver" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                <span class="username" style="font-size: 0.9em; color: #666;">Total Players</span>
                <span class="time" style="font-size: 1.2em; width: 100%; text-align: right;">${totalPlayers.toLocaleString()}</span>
            </div>
            <div class="leaderboard-entry silver" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                <span class="username" style="font-size: 0.9em; color: #666;">Games Played</span>
                <span class="time" style="font-size: 1.2em; width: 100%; text-align: right;">${gamesPlayed.toLocaleString()}</span>
            </div>
            <div class="leaderboard-entry silver" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                <span class="username" style="font-size: 0.9em; color: #666;">Total Burgers Fed</span>
                <span class="time" style="font-size: 1.2em; width: 100%; text-align: right;">${totalBurgers.toLocaleString()}</span>
            </div>
            <div class="leaderboard-entry silver" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                <span class="username" style="font-size: 0.9em; color: #666;">Gigacalories Consumed</span>
                <span class="time" style="font-size: 1.2em; width: 100%; text-align: right;">${totalGigaCalories.toFixed(2)}</span>
            </div>
            <div class="leaderboard-entry silver" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                <span class="username" style="font-size: 0.9em; color: #666;">Cows Slaughtered</span>
                <span class="time" style="font-size: 1.2em; width: 100%; text-align: right;">${roundedCows.toLocaleString()}</span>
            </div>
            <div class="leaderboard-entry silver" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                <span class="username" style="font-size: 0.9em; color: #666;">Cost to Buy Big Macs</span>
                <span class="time" style="font-size: 1.2em; width: 100%; text-align: right;">$${roundedCost.toLocaleString()}</span>
            </div>
            <div class="leaderboard-entry silver" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                <span class="username" style="font-size: 0.9em; color: #666;">Wheat Grains Used</span>
                <span class="time" style="font-size: 1.2em; width: 100%; text-align: right;">${wheatGrains.toLocaleString()}</span>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching statistics:', error);
        statsContainer.innerHTML = '<p>Error loading statistics</p>';
    }
}

async function fetchLeaderboard() {
    if (!supabase) {
        leaderboardList.innerHTML = '<p>Leaderboard unavailable</p>';
        return;
    }
    
        const { data, error } = await supabase
        .from('leaderboard')
        .select(`
            time_ms,
            created_at,
            profiles!profile_id(username)
        `)
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
        li.className = 'leaderboard-entry';
        if (index === 0) li.classList.add('gold');
        else if (index === 1) li.classList.add('silver');
        else if (index === 2) li.classList.add('bronze');
        
        const userDisplay = entry.profiles?.username || 'Anonymous';
        li.innerHTML = `
            <div class="user-info">
                <strong>${index + 1}.</strong> 
                <span class="username">${userDisplay}</span>
            </div>
            <div class="time">${formatTime(entry.time_ms)}</div>
        `;
        leaderboardList.appendChild(li);
    });
}

// Authentication functions
async function initializeAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    currentUser = user;
    updateAuthUI();
}

async function updateAuthUI() {
    if (currentUser) {
        // Fetch username from profiles table
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', currentUser.id)
            .single();

        const displayName = profile?.username || currentUser.email;
        userInfo.textContent = `Welcome, ${displayName}`;
        signInBtn.style.display = 'none';
        signOutBtn.style.display = 'inline-block';
    } else {
        userInfo.textContent = 'Not signed in';
        signInBtn.style.display = 'inline-block';
        signOutBtn.style.display = 'none';
    }
}

function showAuthPopup(signUp = false) {
    isSignUp = signUp;
    authTitle.textContent = signUp ? 'Sign Up' : 'Sign In';
    authSubmitBtn.textContent = signUp ? 'Sign Up' : 'Sign In';
    authToggle.textContent = signUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up";
    authError.style.display = 'none';
    authForm.reset();
    
    // Show/hide username field
    usernameInput.style.display = signUp ? 'block' : 'none';
    usernameInput.required = signUp;
    
    authPopup.style.display = 'flex';
    void authPopup.offsetWidth;
    authPopup.classList.add('show');
}

function hideAuthPopup() {
    authPopup.classList.remove('show');
    setTimeout(() => {
        authPopup.style.display = 'none';
    }, 300);
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    const username = usernameInput.value;

    try {
        let result;
        if (isSignUp) {
            // Validate username for sign-up
            if (!username.trim()) {
                throw new Error('Username is required');
            }
            if (username.length < 3) {
                throw new Error('Username must be at least 3 characters long you egg');
            }

            result = await supabase.auth.signUp({
                email,
                password,
            });
        } else {
            result = await supabase.auth.signInWithPassword({
                email,
                password,
            });
        }

        if (result.error) {
            throw result.error;
        }

        if (isSignUp) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{ id: result.data.user.id, username: username.trim() }]);

            if (profileError) {
                console.error('Error creating profile:', profileError);
            }
        }

        currentUser = result.data.user;
        updateAuthUI();
        hideAuthPopup();
    } catch (error) {
        authError.textContent = error.message;
        authError.style.display = 'block';
    }
}

async function handleSignOut() {
    await supabase.auth.signOut();
    currentUser = null;
    updateAuthUI();
}

// Initialize auth on app start
initializeAuth();

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    updateAuthUI();
});