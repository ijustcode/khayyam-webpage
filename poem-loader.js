function getPoemIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 0;
}

function loadPoem(id) {
    console.log('Loading poem with id:', id);
    
    // Fetch the CSV file
    fetch('poems.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvText => {
            if (!csvText) {
                throw new Error('CSV text is empty');
            }
            console.log('CSV text loaded:', csvText.substring(0, 100) + '...'); // Log first 100 characters
            const poems = parseCSV(csvText);
            // Rest of your code to display the poem
        })
        .catch(error => {
            console.error('Error loading poem:', error);
            alert('Error: Could not load poem. Please check the console for more information.');
        });
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    return lines.slice(1).map(line => {
        const values = [];
        let startValueIndex = 0;
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') {
                inQuotes = !inQuotes;
            } else if (line[i] === ',' && !inQuotes) {
                values.push(line.slice(startValueIndex, i).trim().replace(/^"|"$/g, ''));
                startValueIndex = i + 1;
            }
        }
        values.push(line.slice(startValueIndex).trim().replace(/^"|"$/g, ''));
        
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
}