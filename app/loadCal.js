// /public/loadCal.js

// Function to load the Cal.com embed script
function loadCalEmbed() {
    // Check if the script is already loaded to prevent duplicates
    if (!document.querySelector('script[src="https://cal.com/embed.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://cal.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
    }
}

// Add a slight delay (e.g., 50ms) before executing the script loading.
// This gives React/Next.js time to finish rendering the buttons on the DOM.
setTimeout(loadCalEmbed, 50);