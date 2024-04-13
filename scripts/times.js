let timesInterval = null;

fetch('/data')
.then(response => response.json())
.then(jsonData => {

    clearInterval(timesInterval); 

    function formatDuration(start, end, offset, showHours = false) {
        if (!(end instanceof Date) || isNaN(end.getTime()) || isNaN(new Date(start).getTime())) {
            return "--:--";
        }
    
        const startDate = new Date(offset || start);
        const diff = end - startDate;
        
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        if (showHours) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    const table = document.getElementById('episodeTable');
    const episodes = ["E1", "E2", "E4", "E6", "E3", "E5"];    

    function updateRunners(){
        table.innerHTML = ""
        let lastEndTimes = { team1: "", team2: "", team3: "" };
        let anyRunnerActive = { team1: false, team2: false, team3: false };

        episodes.forEach(ep => {
            const row = table.insertRow();
            const cellEpisode = row.insertCell();
            cellEpisode.textContent = ep;
            let seperator;
            if (ep !== "E5"){
                seperator = table.insertRow();
                seperator.insertCell();
            }
    
            ["team1", "team2", "team3"].forEach(team => {
                const cellLeft = row.insertCell();
                const cellRight = row.insertCell();
                cellLeft.classList.add('cell-left');
                cellRight.classList.add('cell-right');
    
                const data = jsonData[team][ep];
    
                let activeRunner = false;
                if (data.end_time == "" && (lastEndTimes[team] !== "" || ep == "E1") ){
                    activeRunner = true;
                    anyRunnerActive[team] = true;
                    cellLeft.classList.add('active');
                }
                 
                //console.log(data)
                if (data) {
                    let startTime = jsonData.start_time;      
                    let currentStart = lastEndTimes[team] || jsonData.start_time;
                    let end = new Date(data.end_time);
                    if (activeRunner) end = new Date();
                    cellLeft.textContent = formatDuration(jsonData.start_time, end, currentStart);
                    if (data.end_time !== "") cellLeft.classList.add('done');
                    cellRight.textContent = data.runner.toUpperCase();
                    lastEndTimes[team] = data.end_time;
    
                    if (ep !== "E5"){                        
                        const cellLeft = seperator.insertCell();
                        if (activeRunner){
                            cellLeft.classList.add('separatorActive');                        
                        }
                        else if (data.end_time != ""){
                            cellLeft.classList.add('separatorDone');
                        } else{
                            cellLeft.classList.add('separator');
                        }
                        
                        seperator.insertCell();
                        cellLeft.textContent = "";
                    }
    
                    //prevent NaN before the race has started
                    if (startTime === "") {
                        cellLeft.textContent = "--:--";
                    }

                    

                } 
            });    
        });
        
        //if all runner are finished, show the total time
        if (!anyRunnerActive.team1 || !anyRunnerActive.team2 || !anyRunnerActive.team3 ){
            const row = table.insertRow();
           
            row.insertCell();
            if (!anyRunnerActive.team1){   
                const cell = row.insertCell();                
                cell.textContent =  formatDuration(jsonData.start_time, new Date(jsonData["team1"]["E5"]["end_time"]), "", true);
                cell.classList.add('cell-end');
                row.insertCell();
            }else{
                row.insertCell();
                row.insertCell();
            }
            
            if (!anyRunnerActive.team2){
                row.insertCell(formatDuration(jsonData.start_time, jsonData["team2"]["E5"]));
                row.insertCell();
            }else{
                row.insertCell();
                row.insertCell();
            }

            if (!anyRunnerActive.team3){
                row.insertCell(formatDuration(jsonData.start_time, jsonData["team3"]["E5"]));
                row.insertCell();
            }else{
                row.insertCell();
                row.insertCell();
            }
        }
        
    }

    updateRunners();

    timesInterval = setInterval(() => {
        updateRunners();
    }, 1000);

});
