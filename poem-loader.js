function parseCSV(csvText) {
    const rows = [];
    let current = '';
    let inQuotes = false;
    const lines = csvText.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!inQuotes) {
            current = line;
        } else {
            current += '\n' + line;
        }

        // Count unescaped quotes
        let quoteCount = 0;
        for (let j = 0; j < line.length; j++) {
            if (line[j] === '"') quoteCount++;
        }

        if (inQuotes) {
            if (quoteCount % 2 === 1) {
                inQuotes = false;
                rows.push(current);
                current = '';
            }
        } else {
            if (quoteCount % 2 === 1) {
                inQuotes = true;
            } else {
                rows.push(current);
                current = '';
            }
        }
    }
    if (current) rows.push(current);

    const headers = splitCSVRow(rows[0]).map(h => h.trim());
    const poems = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row) continue;
        const values = splitCSVRow(row);
        const obj = {};
        headers.forEach((header, idx) => {
            let val = (values[idx] || '').trim();
            // Remove surrounding quotes and unescape
            if (val.startsWith('"') && val.endsWith('"')) {
                val = val.slice(1, -1).replace(/""/g, '"');
            }
            obj[header] = val;
        });
        poems.push(obj);
    }

    return poems;
}

function splitCSVRow(row) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        if (ch === '"') {
            inQuotes = !inQuotes;
            current += ch;
        } else if (ch === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    values.push(current);
    return values;
}

function toPersianNum(num) {
    const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return String(num).replace(/\d/g, d => persianDigits[d]);
}

function getPoemIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 0;
}

async function fetchPoems() {
    const response = await fetch('poems.csv');
    const csvText = await response.text();
    return parseCSV(csvText);
}

async function loadPoemList() {
    const poems = await fetchPoems();
    const list = document.getElementById('poem-list');
    if (!list) return;

    poems.forEach((poem, index) => {
        const firstLine = poem.title_in_farsi || poem.poem_in_farsi.split('\n')[0];
        const li = document.createElement('li');
        li.innerHTML = `<a href="poem.html?id=${index}"><span class="poem-number">رباعی شماره ${toPersianNum(index + 1)}:</span> ${firstLine}</a>`;
        list.appendChild(li);
    });
}

async function loadPoem() {
    const poemId = getPoemIdFromUrl();
    const poems = await fetchPoems();
    const poem = poems[poemId];
    const total = poems.length;

    if (!poem) {
        document.querySelector('.poem-card').innerHTML = '<p style="text-align:center;padding:40px;">رباعی یافت نشد</p>';
        return;
    }

    // Title / breadcrumb
    const num = toPersianNum(poemId + 1);
    document.title = `رباعی شماره ${num} - رباعیات خیام`;
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `<a href="index.html">خیام</a> &laquo; <a href="index.html">رباعیات</a> &laquo; رباعی شماره ${num}`;
    }

    const poemTitle = document.getElementById('poem-title');
    if (poemTitle) poemTitle.textContent = `رباعی شماره ${num}`;

    // Poem sections
    setContent('poem-in-farsi', poem.poem_in_farsi);
    setContent('transliteration', poem.poem_in_english);
    setContent('literal-translation', poem.poem_in_english_translation);
    setContent('poetic-translation', poem.poetic_traslation);

    // Navigation
    const prevLink = document.getElementById('prev-poem');
    const nextLink = document.getElementById('next-poem');
    if (prevLink) {
        if (poemId > 0) {
            prevLink.href = `poem.html?id=${poemId - 1}`;
        } else {
            prevLink.classList.add('disabled');
        }
    }
    if (nextLink) {
        if (poemId < total - 1) {
            nextLink.href = `poem.html?id=${poemId + 1}`;
        } else {
            nextLink.classList.add('disabled');
        }
    }
}

function setContent(id, text) {
    const el = document.getElementById(id);
    if (el && text) {
        el.innerHTML = text.replace(/\\n/g, '\n').replace(/\n/g, '<br>');
    }
}
