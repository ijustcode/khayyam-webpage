# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Khayyam is a static website showcasing the Rubaiyat (quatrains) of Omar Khayyam, the 12th-century Persian poet. It features bilingual Persian/English content with multiple translation formats and a Firebase-powered comment system.

## Development Commands

This is a static website with no build system. To run locally:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/entry.html`. A local server is required because the site fetches CSV data via JavaScript.

## Architecture

### Data Flow
- All poem content is stored in `poems.csv` with columns for Persian text, transliteration, translations, meanings, and modern implications
- `poem-loader.js` contains `parseCSV()` which parses the CSV and `loadPoem()` which populates HTML elements
- URL query parameter `?id=N` selects which poem to display

### Pages
- **entry.html**: Landing page that dynamically generates a bilingual list of poems from CSV
- **lyrics01.html**: Poem detail page with 6 content sections plus comment system
- **lyrics02.html**: Simpler poem detail page without comments

### Authentication
- `firebase-auth.js` handles Google OAuth via Firebase
- Config is fetched from `/api/firebase-config` endpoint (requires backend server in production)

### HTML Element IDs for Poem Content
The poem detail pages expect these IDs to be populated:
- `poem-title`, `poem-in-farsi`, `transliteration`, `literal-translation`, `meaning`, `implications`, `poetic-translation`

## Current Status

The `dynamic-parsing-of-structured-data` branch is actively working on CSV parsing improvements. Known issues exist with multi-line field handling in the parser.
