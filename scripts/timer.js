const timerDisplay = document.getElementById('timer');
let timerInterval = null;

function startTimer(startTime = null) {
    if (! (startTime instanceof Date) | isNaN(startTime) ) {
        timerDisplay.textContent == "00:00:00";
        return;
    } 
    clearInterval(timerInterval); 
    let diff;

    function calcTimerDisplay() {
        const diff = new Date(Date.now() - startTime);
        const hours = diff.getUTCHours();
        const minutes = diff.getMinutes();
        const seconds = diff.getSeconds().toString().padStart(2, '0');
    
        // Prepare an array to accumulate time parts
        let timeParts = [];
    
        // Only add hours if they are greater than 0
        if (hours > 0) {
            timeParts.push(hours.toString().padStart(2, '0'));
        }
    
        // Add minutes if hours are present, or if minutes are greater than 0
        if (hours > 0 || minutes > 0) {
            timeParts.push(minutes.toString().padStart(2, '0'));
        }
    
        // Seconds are always displayed
        timeParts.push(seconds);
    
        // Join all the time parts with colons
        timerDisplay.textContent = timeParts.join(':');
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
