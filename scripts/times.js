let timesInterval = null;

fetch('/data')
.then(response => response.json())
.then(jsonData => {

    clearInterval(timesInterval); 

    function formatDuration(start, end, offset) {        
        if (! (end instanceof Date) | isNaN(end) ) return "--:--";                
        const startDate = new Date(offset || start);
        //console.log(end)
        const diff = end - startDate;
        const minutes = Math.floor(diff / 60000);
        const seconds = ((diff % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds + "";
    }

    const table = document.getElementById('episodeTable');
    const episodes = ["E1", "E2", "E4", "E6", "E3", "E5"];    

    function updateRunners(){
        table.innerHTML = ""
        let lastEndTimes = { team1: "", team2: "", team3: "" };

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
    }

    updateRunners();

    timesInterval = setInterval(() => {
        updateRunners();
    }, 1000);

});
