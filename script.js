const img = document.getElementById('fatWill');
const burger = document.getElementById('burger');
const mouthZone = document.getElementById('mouthZone');

// Prevent native drag on both images
burger.addEventListener('dragstart', e => e.preventDefault());
img.addEventListener('dragstart', e => e.preventDefault());

let step = 0;
const maxStep = 5;
const widths = ['40vw', '52vw', '64vw', '76vw', '88vw', '100vw'];
img.style.width = widths[0];

// Friction variable - adjust this value to change the amount of friction
// Values closer to 1 mean less friction (more slippery), values farther from 1 mean more friction (more sticky)
let friction = 0.95;

// Drag state
let offsetX = 0, offsetY = 0;
let isDragging = false;
let lastPosition = { x: 0, y: 0 }; // Track last position for velocity calculation
let lastTimestamp = 0; // Track last timestamp for velocity calculation
let velocity = { x: 0, y: 0 }; // Track velocity when released
let isThrowing = false; // Flag to indicate if burger is currently moving after throw

// Mouse events
burger.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - burger.offsetLeft;
    offsetY = e.clientY - burger.offsetTop;
    burger.style.cursor = 'grabbing';
    
    // Record initial position and time for velocity calculation
    lastPosition = { x: e.clientX, y: e.clientY };
    lastTimestamp = Date.now();
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    // Update position
    burger.style.left = (e.clientX - offsetX) + 'px';
    burger.style.top = (e.clientY - offsetY) + 'px';
    
    // Calculate velocity if dragging
    if (isDragging) {
        const now = Date.now();
        if (now !== lastTimestamp) {
            // Calculate velocity based on movement
            const deltaTime = now - lastTimestamp;
            const deltaX = e.clientX - lastPosition.x;
            const deltaY = e.clientY - lastPosition.y;
            
            // Calculate velocity (pixels per second)
            velocity.x = (deltaX / deltaTime) * 1000;
            velocity.y = (deltaY / deltaTime) * 1000;
            
            // Update last position and timestamp
            lastPosition = { x: e.clientX, y: e.clientY };
            lastTimestamp = now;
        }
    }
});

document.addEventListener('mouseup', handleDrop);

// Touch events
burger.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - burger.offsetLeft;
    offsetY = touch.clientY - burger.offsetTop;
    e.preventDefault();
    
    // Record initial position and time for velocity calculation
    lastPosition = { x: touch.clientX, y: touch.clientY };
    lastTimestamp = Date.now();
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    
    // Update position
    burger.style.left = (touch.clientX - offsetX) + 'px';
    burger.style.top = (touch.clientY - offsetY) + 'px';
    
    // Calculate velocity if dragging
    if (isDragging) {
        const now = Date.now();
        if (now !== lastTimestamp) {
            // Calculate velocity based on movement
            const deltaTime = now - lastTimestamp;
            const deltaX = touch.clientX - lastPosition.x;
            const deltaY = touch.clientY - lastPosition.y;
            
            // Calculate velocity (pixels per second)
            velocity.x = (deltaX / deltaTime) * 1000;
            velocity.y = (deltaY / deltaTime) * 1000;
            
            // Update last position and timestamp
            lastPosition = { x: touch.clientX, y: touch.clientY };
            lastTimestamp = now;
        }
    }
    
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', handleDrop);

function handleDrop(e) {
    if (!isDragging) return;
    isDragging = false;
    burger.style.cursor = 'grab';
    
    // Calculate final velocity when releasing
    const now = Date.now();
    if (now !== lastTimestamp && (Math.abs(velocity.x) > 0 || Math.abs(velocity.y) > 0)) {
        // Start throwing physics simulation
        startThrowingPhysics();
    } else {
        // No significant velocity - reset velocity
        velocity = { x: 0, y: 0 };
    }
}

function startThrowingPhysics() {
    isThrowing = true;
    const burgerRect = burger.getBoundingClientRect();
    const mouthRect = mouthZone.getBoundingClientRect();
    
    // Check if burger is already in mouth zone
    const wasInMouth = isBurgerInMouth(burgerRect, mouthRect);
    
    // Start animation frame loop for physics simulation
    function animate() {
        if (!isThrowing) return;
        
        // Apply velocity to move burger
        const currentLeft = parseFloat(burger.style.left) || 0;
        const currentTop = parseFloat(burger.style.top) || 0;
        
        // Calculate new position based on velocity (with friction)
        const friction = 0.95; // Slow down over time
        const newX = currentLeft + (velocity.x / 60); // Divide by FPS approximation
        const newY = currentTop + (velocity.y / 60);
        
        // Update position
        burger.style.left = newX + 'px';
        burger.style.top = newY + 'px';
        
        // Apply friction to velocity
        velocity.x *= friction;
        velocity.y *= friction;
        
        // Check boundaries - stop if hitting edges of screen
        const burgerWidth = burger.offsetWidth;
        const burgerHeight = burger.offsetHeight;
        const maxX = window.innerWidth - burgerWidth;
        const maxY = window.innerHeight - burgerHeight;
        
        if (newX <= 0 || newX >= maxX || newY <= 0 || newY >= maxY || 
            Math.abs(velocity.x) < 0.5 && Math.abs(velocity.y) < 0.5) {
            // Stop if hitting edge or velocity is very low
            isThrowing = false;
            return;
        }
        
        // Get current positions for collision detection
        const currentBurgerRect = burger.getBoundingClientRect();
        const currentMouthRect = mouthZone.getBoundingClientRect();
        const isInMouth = isBurgerInMouth(currentBurgerRect, currentMouthRect);
        
        // Check if burger crossed the mouth zone during this frame
        if (!wasInMouth && isInMouth) {
            // Burger entered mouth zone - trigger stretching
            triggerStretch();
        }
        
        // Continue animation
        requestAnimationFrame(animate);
    }
    
    // Start the animation
    animate();
}

function isBurgerInMouth(burgerRect, mouthRect) {
    return (
        burgerRect.left < mouthRect.right &&
        burgerRect.right > mouthRect.left &&
        burgerRect.top < mouthRect.bottom &&
        burgerRect.bottom > mouthRect.top
    );
}

function triggerStretch() {
    // Stretch Will
    step = (step + 1) % (maxStep + 1);
    img.style.width = widths[step];
    
    // Check if game is done
    if (step === maxStep) {
        setTimeout(() => {
            alert('Fully Fattend!');
            // Reset game
            step = 0;
            img.style.width = widths[0];
        }, 500);
    }
    
    // Move burger to random position
    const winW = window.innerWidth - burger.offsetWidth;
    const winH = window.innerHeight - burger.offsetHeight;
    const randX = Math.random() * winW;
    const randY = Math.random() * winH;
    burger.style.left = randX + 'px';
    burger.style.top = randY + 'px';
    
    // Stop throwing physics
    isThrowing = false;
    velocity = { x: 0, y: 0 };
}