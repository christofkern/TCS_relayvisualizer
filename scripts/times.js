
fetch('/data') // Adjust the URL as necessary
.then(response => response.json())
.then(jsonData => {

    

    function formatDuration(start, end, offset) {
        if (end == "") return "--:--";                
        const startDate = new Date(offset || start);
        const endDate = new Date(end);
        const diff = endDate - startDate;
        const minutes = Math.floor(diff / 60000);
        const seconds = ((diff % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds + "";
    }

    const table = document.getElementById('episodeTable');
    const episodes = ["E1", "E2", "E4", "E6", "E3", "E5"];
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
            console.log(data)
            if (data) {
                let currentStart = lastEndTimes[team] || jsonData.start_time;
                cellLeft.textContent = formatDuration(jsonData.start_time, data.end_time, currentStart);
                if (data.end_time !== "") cellLeft.classList.add('done');
                cellRight.textContent = data.runner.toUpperCase();
                lastEndTimes[team] = data.end_time;


                if (ep !== "E5"){                        
                    const cellLeft = seperator.insertCell();
                    if (data.end_time != ""){
                        cellLeft.classList.add('separatorDone');
                    } else{
                        cellLeft.classList.add('separator');
                    }
                    
                    seperator.insertCell();
                    cellLeft.textContent = "";
                }
            } else {
                cellLeft.textContent = "--:--";
                cellRight.textContent = "";
                lastEndTime = "";  // Reset lastEndTime if there's no valid data
            }
        });

    
    });

});
