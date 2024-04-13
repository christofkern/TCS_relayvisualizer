const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
let timerInterval = null;

function startTimer(startTime) {
    clearInterval(timerInterval);  // Clear existing timer interval if any
    let diff;

    timerInterval = setInterval(() => {
        diff = new Date(Date.now() - startTime);
        let hours = diff.getUTCHours().toString().padStart(2, '0');
        let minutes = diff.getMinutes().toString().padStart(2, '0');
        let seconds = diff.getSeconds().toString().padStart(2, '0');
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

// Initial start time setup
startTimer(new Date("2024-12-31T00:15:50.000Z"));

startButton.addEventListener('click', () => {
    startTimer(new Date());
});