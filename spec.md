# Spec

## Phase 1: Poetry Pages

### Landing Page
- When you navigate to the domain, the landing page is a list of all the poems available from the famous poet Khayyam.
- Each poem has its own record in the list, showing the **first line** of the poem in Farsi.
- When you click on a poem, it navigates to the poem detail page.

### Poem Detail Page
A template page that has four parts:

1. **The actual poem in Farsi** - the original Persian text
2. **The translation in English** - a literal English translation
3. **The transliteration (romanization)** - how you would enunciate the Farsi in English/Latin letters (e.g. "agar aan tork-e shirazi")
4. **The poetic translation** - a more literary/poetic English rendering

### Data Source
- All poem data is stored in **CSV** format.
- Medium-sized collection (20-100 poems), expected to grow over time.

## Phase 2: Comment Section

- After Phase 1 is built, add a comment section on each poem detail page where people can leave comments.
- **Authentication required**: users must sign in (Google OAuth via Firebase) before commenting.
- **Storage**: comments are stored in **Firebase Firestore**.

## Design Direction

- Inspired by [ganjoor.net/hafez/ghazal](https://ganjoor.net/hafez/ghazal).
- Clean, scholarly, content-focused design.
- **RTL layout** for Persian text.
- Centered column layout with generous vertical spacing.
- Modern Persian web font (e.g. Vazirmatn).
- Minimal ornamentation - content accessibility over decoration.
- Light background, dark text, subtle UI elements.
