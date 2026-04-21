const img = document.getElementById('fatWill');
const btn = document.getElementById('stretchBtn');

let step = 0;
const maxStep = 5;
// 0 clicks = normal, 5 clicks = full screen width
const widths = ['40vw', '52vw', '64vw', '76vw', '88vw', '100vw'];

// Set initial width to match first step for smooth animation
img.style.width = widths[0];

btn.addEventListener('click', () => {
    step = (step + 1) % (maxStep + 1);
    img.style.width = widths[step];
});