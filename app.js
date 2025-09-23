// Import required Node.js modules
const http = require('http');
const url = require('url');

// Global data structures to hold appointment info
const availableTimes = {
    Monday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Tuesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Wednesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "4:00", "4:30"],
    Thursday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Friday: ["1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
};
const appointments = [];

/**
 * Schedules an appointment by removing the time from the available list
 * and adding a new record to the appointments list.
 */
function schedule(queryObj, res) {
    if (!queryObj.name || !queryObj.day || !queryObj.time) {
        return error(400, "Error: Missing name, day, or time parameter.", res);
    }

    if (availableTimes[queryObj.day] && availableTimes[queryObj.day].some(element => element == queryObj.time)) {
        const timeIndex = availableTimes[queryObj.day].indexOf(queryObj.time);
        availableTimes[queryObj.day].splice(timeIndex, 1);
        appointments.push({ name: queryObj.name, day: queryObj.day, time: queryObj.time });
        console.log("Appointment Added! Current appointments:", appointments);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write("Scheduled");
        res.end();
    } else {
        const errorMessage = `Unable to schedule. The time slot on ${queryObj.day} at ${queryObj.time} is not available.`;
        error(400, errorMessage, res);
    }
}

/**
 * Cancels an appointment by removing it from the appointments list
 * and adding the time back to the available list.
 */
function cancel(queryObj, res) {
    if (!queryObj.name || !queryObj.day || !queryObj.time) {
        return error(400, "Error: Missing name, day, or time parameter.", res);
    }

    const { name, day, time } = queryObj;
    const appointmentIndex = appointments.findIndex(appt =>
        appt.name === name && appt.day === day && appt.time === time
    );

    if (appointmentIndex !== -1) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write("Appointment has been canceled");
        res.end();

        appointments.splice(appointmentIndex, 1);
        if (availableTimes[day]) {
            availableTimes[day].push(time);
            availableTimes[day].sort();
        }
        console.log("Appointment Canceled! Current appointments:", appointments);
    } else {
        error(404, "Appointment not found.", res);
    }
}

/**
 * Checks if a time slot is available without booking it.
 */
function check(queryObj, res) {
    if (!queryObj.day || !queryObj.time) {
        return error(400, "Error: Missing day or time parameter.", res);
    }
    
    if (availableTimes[queryObj.day] && availableTimes[queryObj.day].includes(queryObj.time)) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`The time slot on ${queryObj.day} at ${queryObj.time} is available.`);
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`The time slot on ${queryObj.day} at ${queryObj.time} is NOT available.`);
    }
}

/**
 * A helper function to send an error response with a status and message.
 */
function error(status, message, res) {
    res.writeHead(status, { 'Content-Type': 'text/plain' });
    res.write(message);
    res.end();
}

// Create the main server and define the router logic
let myserver = http.createServer(function (req, res) {
    let urlObj = url.parse(req.url, true);
    console.log("Request received for:", req.url);
    
    // Router to direct requests to the correct function
    switch (urlObj.pathname) {
        case "/schedule":
            schedule(urlObj.query, res);
            break;
        case "/cancel":
            cancel(urlObj.query, res);
            break;
        case "/check":
            check(urlObj.query, res);
            break;
        default:
            error(404, "Error: Path name not found", res);
    }
});

// Start the server and have it listen for requests on port 80
myserver.listen(80, () => {
    console.log('Server is running on port 80');
});
