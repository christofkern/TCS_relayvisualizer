async function fetchUTCTime() {
    try {
        const response = await fetch('http://worldtimeapi.org/api/timezone/Etc/UTC');
        const data = await response.json();
        const utcDateTime = new Date(data.datetime); // Convert datetime string to Date object
        return utcDateTime;        
    } catch (error) {
        console.error('Failed to fetch UTC time:', error);
        return null; // Return null or handle the error appropriately
    }
}

async function fetchFormattedUTCTime() {
    try {
        const response = await fetch('http://worldtimeapi.org/api/timezone/Etc/UTC');
        const data = await response.json();
        const utcDateTime = data.datetime; // This returns the datetime in ISO 8601 format

        // Extract the date and time in the desired format
        const year = utcDateTime.slice(0, 4);
        const month = utcDateTime.slice(5, 7);
        const day = utcDateTime.slice(8, 10);
        const time = utcDateTime.slice(11, 19); // This includes hours, minutes, and seconds

        // Return the formatted UTC datetime string
        console.log(`${year}-${month}-${day}T${time}`)
        return `${year}-${month}-${day}T${time}`;
    } catch (error) {
        console.error('Failed to fetch UTC time:', error);
        return null; // Return null or handle the error appropriately
    }
}