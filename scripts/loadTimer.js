function loadTimer(timerDisplay) {
    let timerInterval = null;

    function startTimer(startTime = null) {
        clearInterval(timerInterval); 

        function calcTimerDisplay() {

            if (isNaN(startTime.getTime())) {
                //console.log("Invalid start time");
                timerDisplay.textContent = "00:00:00";
                return;
            }

            fetchUTCTime().then(utcTime => {
                const diff = new Date(utcTime - startTime);
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
            }); 
        }
        
        calcTimerDisplay();
        timerInterval = setInterval(() => {
            calcTimerDisplay();
        }, 1000);
    
    }


    fetch('/data')
    .then(response => response.json())
    .then(jsonData => {
        startTimer(new Date(jsonData.start_time));
    });
}
