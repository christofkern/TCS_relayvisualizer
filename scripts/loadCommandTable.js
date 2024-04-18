function loadCommandTable(data, commandTable) {
    const teams = Object.keys(data);

    // Clear existing table rows
    commandTable.innerHTML = '';

    // Get the episode order from the JSON data
    teams.splice(teams.indexOf("start_time"),1)
    teams.splice(teams.indexOf("episode_order"),1)

    const episodeOrder = data["episode_order"].split(',');

    // Create table header
    const headerRow = document.createElement('tr');
    const headers = ['Episode', ...teams];
    console.log(episodeOrder)
    
    headers.forEach((headerText, index) => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);        
    });
    commandTable.appendChild(headerRow);

    // Create table rows for each episode
    episodeOrder.forEach(episode => {
        const tr = document.createElement('tr');
        const tdEpisode = document.createElement('td');
        tdEpisode.textContent = episode;

        // Create table cells for each team
        teams.forEach(team => {
            const td = document.createElement('td');
            const inputRunner = document.createElement('input');
            inputRunner.type = 'text';
            inputRunner.name = `${team}_${episode}_runner`;
            inputRunner.value = data[team][episode].runner;
            const inputEndTime = document.createElement('input');
            inputEndTime.type = 'datetime-local';
            inputEndTime.name = `${team}_${episode}_endtime`;
            inputEndTime.step = '1';
            inputEndTime.value = data[team][episode].end_time ? data[team][episode].end_time.replace('Z', '').split('.')[0] : '';
            td.appendChild(inputRunner);
            td.appendChild(inputEndTime);
            tr.appendChild(td);
        });

        tr.insertBefore(tdEpisode, tr.firstChild); // Insert episode cell at the beginning of the row
        commandTable.appendChild(tr);  
    });

    const trButtons = document.createElement('tr');
    
    const tdSave = document.createElement('td');
    const saveButton = document.createElement('input');
    saveButton.type = 'submit';
    saveButton.value = 'Save Data';
    tdSave.appendChild(saveButton);
    trButtons.appendChild(tdSave);

    teams.forEach(team => {
        const tdSplit = document.createElement('td');
        const splitButton = document.createElement('button');
        splitButton.textContent = `Split ${team}`
        splitButton.onclick = function(){
            handleSplit(team);
        }
        tdSplit.appendChild(splitButton);
        trButtons.appendChild(tdSplit);
    });

    commandTable.appendChild(trButtons);
}
