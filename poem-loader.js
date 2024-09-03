function getPoemIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 0;
}

async function loadPoem() {
    const poemId = getPoemIdFromUrl();
    const response = await fetch('poems.csv');
    const csvText = await response.text();
    const poems = parseCSV(csvText);
    const poem = poems[poemId];

    if (poem) {
        document.title = poem.title_in_farsi;
        document.getElementById('poem-title').textContent = poem.title_in_farsi;
        document.getElementById('poem-in-farsi').innerHTML = poem.poem_in_farsi.replace(/\n/g, '<br>');
        document.getElementById('transliteration').innerHTML = poem.poem_in_english.replace(/\n/g, '<br>');
        document.getElementById('literal-translation').innerHTML = poem.poem_in_english_translation.replace(/\n/g, '<br>');
        document.getElementById('meaning').innerHTML = poem.meaning.replace(/\n/g, '<br>');
        document.getElementById('implications').textContent = poem.implications_for_21st_century;
        document.getElementById('poetic-translation').innerHTML = poem.poetic_translation.replace(/\n/g, '<br>');
    }
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