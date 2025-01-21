// Set up MutationObserver to watch for URL changes
let lastUrl = location.href;
const urlObserver = new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(analyzeProperty, 1000); // Wait for page content to load
    }
});

// Configure the observer to watch for changes
urlObserver.observe(document, { subtree: true, childList: true });

// Main analysis function
function analyzeProperty() {
    const results = extractPropertyData();
    chrome.runtime.sendMessage({ type: 'PROPERTY_DATA', data: results });
}

function extractPropertyData() {
    // Basic data extraction
    const price = document.querySelector('[data-testid="price"]')?.textContent;
    const sqft = document.querySelector('[data-testid="bed-bath-container"]')?.textContent;
    const address = document.querySelector('[data-testid="address"]')?.textContent;
    // Clean the extracted data
    const cleanPrice = price ? parseInt(price.replace(/[^0-9]/g, '')) : null;
    const cleanSqft = sqft ? parseInt(sqft.match(/(\d+,?\d*) sqft/)?.[1].replace(',', '')) : null;

    // Calculate basic metrics
    const pricePerSqft = cleanPrice && cleanSqft ? cleanPrice / cleanSqft : null;

    // Estimate monthly rent (very basic estimation - 0.8% rule)
    const estimatedMonthlyRent = cleanPrice ? (cleanPrice * 0.008) : null;


    return {
        price: cleanPrice,
        sqft: cleanSqft,
        pricePerSqft,
        estimatedMonthlyRent,
        address
    };
}

// Initial analysis when script loads
analyzeProperty();
