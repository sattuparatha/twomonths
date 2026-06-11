// --- Password Logic ---
const passwordInput = document.getElementById('password-input');
const unlockBtn = document.getElementById('unlock-btn');
const errorMsg = document.getElementById('error-msg');
const lockScreen = document.getElementById('lock-screen');
const wrappedContainer = document.getElementById('wrapped-container');

const CORRECT_PASSWORD = "ilovechawal";

function attemptUnlock() {
    if (passwordInput.value.toLowerCase().trim() === CORRECT_PASSWORD) {
        lockScreen.classList.remove('active');
        wrappedContainer.classList.add('active');
        startWrapped();
    } else {
        errorMsg.textContent = "Incorrect password. Are you sure you are the right INTP?";
        passwordInput.value = '';
        passwordInput.focus();
    }
}

unlockBtn.addEventListener('click', attemptUnlock);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') attemptUnlock();
});

// --- Wrapped Logic ---
const slides = document.querySelectorAll('.slide');
const fills = document.querySelectorAll('.progress-fill');
const container = document.getElementById('wrapped-container');
const navLeft = document.getElementById('nav-left');
const navRight = document.getElementById('nav-right');
const replayBtn = document.getElementById('replay-btn');

let currentSlide = 0;
const SLIDE_DURATION = 6000; // 6 seconds per slide
let timerId = null;
let startTime = null;
let pausedTime = 0;

function startWrapped() {
    currentSlide = 0;
    resetFills();
    showSlide(currentSlide);
}

function showSlide(index) {
    // Bounds checking
    if (index < 0) {
        currentSlide = 0;
        return;
    }
    if (index >= slides.length) {
        // End of story
        clearTimeout(timerId);
        fills[slides.length - 1].style.width = '100%';
        fills[slides.length - 1].style.transition = 'none';
        return;
    }

    currentSlide = index;

    // Update slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) slide.classList.add('active');
    });

    // Update background
    const bgVar = slides[index].getAttribute('data-bg');
    container.style.background = `var(--${bgVar})`;

    // Update progress bars
    updateFills(index);

    // Start timer
    startTimer();
}

function updateFills(activeIndex) {
    fills.forEach((fill, i) => {
        // Clear transitions
        fill.style.transition = 'none';
        
        if (i < activeIndex) {
            fill.style.width = '100%'; // Completed
        } else if (i === activeIndex) {
            fill.style.width = '0%'; // Reset current
            // Force reflow
            void fill.offsetWidth;
            // Start animation
            fill.style.transition = `width ${SLIDE_DURATION}ms linear`;
            fill.style.width = '100%';
        } else {
            fill.style.width = '0%'; // Future
        }
    });
}

function startTimer() {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
        showSlide(currentSlide + 1);
    }, SLIDE_DURATION);
}

// Navigation
navRight.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) {
        showSlide(currentSlide + 1);
    }
});

navLeft.addEventListener('click', () => {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
});

// Replay
replayBtn.addEventListener('click', () => {
    startWrapped();
});

// Allow pausing by holding mouse down
const pauseTimer = () => {
    if (timerId) clearTimeout(timerId);
    const fill = fills[currentSlide];
    const computedStyle = window.getComputedStyle(fill);
    const width = computedStyle.getPropertyValue('width');
    fill.style.transition = 'none';
    fill.style.width = width;
};

const resumeTimer = () => {
    // Just restart the current slide for simplicity when they let go
    showSlide(currentSlide);
};

navLeft.addEventListener('mousedown', pauseTimer);
navRight.addEventListener('mousedown', pauseTimer);
navLeft.addEventListener('mouseup', resumeTimer);
navRight.addEventListener('mouseup', resumeTimer);

// Touch events for mobile
navLeft.addEventListener('touchstart', pauseTimer);
navRight.addEventListener('touchstart', pauseTimer);
navLeft.addEventListener('touchend', resumeTimer);
navRight.addEventListener('touchend', resumeTimer);
