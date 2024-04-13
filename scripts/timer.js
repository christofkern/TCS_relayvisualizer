const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
let timerInterval = null;

function startTimer(startTime = null) {
    if (! (startTime instanceof Date) | isNaN(startTime) ) {
        timerDisplay.textContent == "00:00:00";
        return;
    } 
    clearInterval(timerInterval); 
    let diff;

    function calcTimerDisplay(){
        diff = new Date(Date.now() - startTime);
        let hours = diff.getUTCHours().toString().padStart(2, '0');
        let minutes = diff.getMinutes().toString().padStart(2, '0');
        let seconds = diff.getSeconds().toString().padStart(2, '0');
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
    calcTimerDisplay();
    timerInterval = setInterval(() => {
        calcTimerDisplay();
    }, 1000);
}


fetch('/data')
.then(response => response.json())
.then(jsonData => {
    // Initial start time setup, if the race is already on
    startTimer(new Date(jsonData.start_time));
});

startButton.addEventListener('click', () => {
    startTimer(new Date());
});