// Initialize analysis when popup opens
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
    });
});

document.getElementById('analyze').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: () => {
                // Trigger re-analysis
                analyzeProperty();
            }
        });
    });
});

// Listen for results from content script
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'PROPERTY_DATA') {
        displayResults(message.data);
    }
});

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="kpi-container">
            <h3>Property Analysis</h3>
            <div class="kpi-item">
                <label>Address:</label>
                <span>${data.address || 'N/A'}</span>
            </div>
            <div class="kpi-item">
                <label>Price:</label>
                <span>$${data.price?.toLocaleString() || 'N/A'}</span>
            </div>
            <div class="kpi-item">
                <label>Square Footage:</label>
                <span>${data.sqft?.toLocaleString() || 'N/A'} sqft</span>
            </div>
            <div class="kpi-item">
                <label>Price per Sqft:</label>
                <span>$${data.pricePerSqft?.toFixed(2) || 'N/A'}</span>
            </div>
            <div class="kpi-item">
                <label>Est. Monthly Rent:</label>
                <span>$${data.estimatedMonthlyRent?.toFixed(2) || 'N/A'}</span>
            </div>
        </div>
    `;
}
