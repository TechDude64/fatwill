const img = document.getElementById('fatWill');
const burger = document.getElementById('burger');
const mouthZone = document.getElementById('mouthZone');

// Prevent native drag
burger.addEventListener('dragstart', e => e.preventDefault());

let step = 0;
const maxStep = 5;
const widths = ['40vw', '52vw', '64vw', '76vw', '88vw', '100vw'];
img.style.width = widths[0];

// Drag state
let offsetX = 0, offsetY = 0;
let isDragging = false;

burger.addEventListener('mousedown', (e) => {
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

document.addEventListener('mouseup', (e) => {
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
        // Move burger to random position
        const winW = window.innerWidth - burger.width;
        const winH = window.innerHeight - burger.height;
        const randX = Math.random() * winW;
        const randY = Math.random() * winH;
        burger.style.left = randX + 'px';
        burger.style.top = randY + 'px';
    }
});