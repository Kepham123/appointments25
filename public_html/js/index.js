alert("Testing File Server");
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const dayInput = document.getElementById('day');
    const timeInput = document.getElementById('time');
    const resultsDiv = document.getElementById('results');

    const scheduleBtn = document.getElementById('scheduleBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const checkBtn = document.getElementById('checkBtn');

    async function handleRequest(endpoint, params) {
        // Construct URL with query parameters
        const url = new URL(endpoint, window.location.origin);
        url.search = new URLSearchParams(params).toString();
        
        try {
            const response = await fetch(url);
            const resultText = await response.text();
            
            // Display the server's response in the results div 
            resultsDiv.textContent = resultText;
            resultsDiv.style.color = response.ok ? 'black' : 'red';
        } catch (error) {
            resultsDiv.textContent = 'A network error occurred. Is the server running?';
            resultsDiv.style.color = 'red';
        }
    }

    scheduleBtn.addEventListener('click', () => { // 
        const params = {
            name: nameInput.value,
            day: dayInput.value,
            time: timeInput.value,
        };
        handleRequest('/schedule', params);
    });

    cancelBtn.addEventListener('click', () => { // 
        const params = {
            name: nameInput.value,
            day: dayInput.value,
            time: timeInput.value,
        };
        handleRequest('/cancel', params);
    });

    checkBtn.addEventListener('click', () => { // 
        const params = {
            day: dayInput.value,
            time: timeInput.value,
        };
        handleRequest('/check', params);
    });
});
   
