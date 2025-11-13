// Navigation helper for docs pages
// This script handles navigation back to the main app

document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('backToHome');

    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();

            // Check if running in Electron
            if (window.location.protocol === 'file:') {
                // Navigate back to index.html in the parent directory
                window.location.href = '../index.html';
            } else {
                // If running in browser, go to the docs index
                window.location.href = 'index.html';
            }
        });
    }
});
