const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

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
 * Schedules an appointment.
 */
function schedule(queryObj, res) {
    if (!queryObj.name || !queryObj.day || !queryObj.time) {
        return error(400, "Error: Missing name, day, or time parameter.", res);
    }

    if (availableTimes[queryObj.day] && availableTimes[queryObj.day].includes(queryObj.time)) {
        const timeIndex = availableTimes[queryObj.day].indexOf(queryObj.time);
        availableTimes[queryObj.day].splice(timeIndex, 1);
        appointments.push({ name: queryObj.name, day: queryObj.day, time: queryObj.time });
        console.log("Appointment Added! Current appointments:", appointments);
        sendResponse(res, 200, 'text/plain', "Scheduled");
    } else {
        const errorMessage = `Unable to schedule. The time slot on ${queryObj.day} at ${queryObj.time} is not available.`;
        error(400, errorMessage, res);
    }
}

/**
 * Cancels an appointment.
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
        appointments.splice(appointmentIndex, 1);
        if (availableTimes[day]) {
            availableTimes[day].push(time);
            availableTimes[day].sort();
        }
        console.log("Appointment Canceled! Current appointments:", appointments);
        sendResponse(res, 200, 'text/plain', "Appointment has been canceled");
    } else {
        error(404, "Appointment not found.", res);
    }
}

/**
 * Checks if a time slot is available.
 */
function check(queryObj, res) {
    if (!queryObj.day || !queryObj.time) {
        return error(400, "Error: Missing day or time parameter.", res);
    }
    
    if (availableTimes[queryObj.day] && availableTimes[queryObj.day].includes(queryObj.time)) {
        sendResponse(res, 200, 'text/plain', `The time slot on ${queryObj.day} at ${queryObj.time} is available.`);
    } else {
        sendResponse(res, 200, 'text/plain', `The time slot on ${queryObj.day} at ${queryObj.time} is NOT available.`);
    }
}

/**
 * A helper function to send an error response.
 */
function error(status, message, res) {
    sendResponse(res, status, 'text/plain', message);
}

/**
 * A helper function to send a complete response. 
 */
function sendResponse(res, statusCode, contentType, content) {
    res.writeHead(statusCode, {'Content-Type': contentType});
    res.end(content);
}

/**
 * Gets the content type based on the file extension. 
 */
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.html': return 'text/html';
        case '.css': return 'text/css';
        case '.js': return 'application/javascript';
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        default: return 'application/octet-stream'; // Default for unknown types
    }
}

/**
 * Reads a file and sends it to the client. 
 */
function sendFile(filePath, res) {
    const contentType = getContentType(filePath);
    fs.readFile(filePath, (err, content) => {
        if (err) {
            error(404, 'File not found', res);
        } else {
            sendResponse(res, 200, contentType, content);
        }
    });
}

/**
 * Main server callback function to handle all requests.
 */
const server = http.createServer((req, res) => {
    console.log(`Request received for: ${req.url}`); // 
    
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // API Routing
    if (pathname === '/schedule') {
        schedule(query, res);
        return;
    } else if (pathname === '/cancel') {
        cancel(query, res);
        return;
    } else if (pathname === '/check') {
        check(query, res);
        return;
    }
    
    // Serve index.html by default 
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Serve static files from the public_html directory
    const filePath = path.join(__dirname, 'public_html', pathname);
    sendFile(filePath, res);
});

const port = 80;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
