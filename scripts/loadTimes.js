function loadTimes(table){


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

        const episodeOrder = jsonData["episode_order"].split(',');
        const teams = Object.keys(jsonData);
        teams.splice(teams.indexOf("start_time"),1)
        teams.splice(teams.indexOf("episode_order"),1)
        let lastEpisode = episodeOrder[episodeOrder.length - 1];

        function updateRunners(){
            table.innerHTML = ""
            let lastEndTimes = {};
            lastEndTimes = teams.reduce((acc, team) => {
                acc[team] = "";
                return acc;
            }, {});
            let anyRunnerActive = {};
            anyRunnerActive = teams.reduce((acc, team) => {
                acc[team] = false;
                return acc;
            }, {})

            episodeOrder.forEach(ep => {
                const row = table.insertRow();
                const cellEpisode = row.insertCell();
                cellEpisode.textContent = ep;
                let seperator;
                if (ep !== lastEpisode){
                    seperator = table.insertRow();
                    seperator.insertCell();
                }
        
                teams.forEach(team => {
                    const cellLeft = row.insertCell();
                    const cellRight = row.insertCell();
                    cellLeft.classList.add('cell-left');
                    cellRight.classList.add('cell-right');
        
                    const data = jsonData[team][ep];
        
                    let activeRunner = false;
                    if (data.end_time == "" && (lastEndTimes[team] !== "" || ep == episodeOrder[0]) ){
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
        
                        if (ep !== lastEpisode){                        
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
            if (Object.values(anyRunnerActive).some(val => !val)){
                const row = table.insertRow();
            
                row.insertCell();
                
                teams.forEach(team => {
                
                    if (!anyRunnerActive[team]){   
                        const cell = row.insertCell();                
                        cell.textContent =  formatDuration(jsonData.start_time, new Date(jsonData[team][lastEpisode]["end_time"]), "", true);
                        cell.classList.add('cell-end');
                        row.insertCell();
                    }else{
                        row.insertCell();
                        row.insertCell();
                    }                    
                });
            }
            
        }

        updateRunners();
        timesInterval = setInterval(() => {
            updateRunners();
        }, 1000);

    });

}