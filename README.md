# Text Comparator (urldiff)

A small, fast, browser-based React tool to compare two pieces of text (lists or paragraphs). It highlights exact duplicates, finds near-matches (similar lines) using a similarity score, and lets you clean and export results.

This repository contains a single-page React app built with Vite.

## Key features

- Paste or upload two inputs (text areas + drag & drop for TXT/CSV).
- Side-by-side and inline (unified) diff views.
- Exact-match detection (red highlight) and "near-match" detection (yellow highlight) powered by Levenshtein similarity.
- Select duplicates and remove them from List B (one-click cleaning and selective removal).
- Export comparison as CSV, JSON, or plain text.
- Dark and light themes with improved readability and focus states.
- Responsive layout for desktop and mobile.

## Quick start

Requirements: Node.js 18+ and npm

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
# open http://localhost:5173
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## How it works (brief)

- Exact matches: lines that are identical after normalization (lowercasing and trimming) are flagged as exact duplicates.
- Near-matches: the app computes a similarity score between lines using a Levenshtein distance based routine and converts that into a percent similarity. The slider "Similarity sensitivity" controls how strict the app is when deciding what counts as a "near match":
  - Higher values = stricter (only very similar lines are marked)
  - Lower values = more flexible (looser matches allowed)

UX hints:
- Use the slider to adjust sensitivity. Try 85% for strict, 72% for balanced, 60% for flexible.
- Use the duplicate filter + select/deselect tools to remove only the items you want from List B.

## Files of interest

- `src/App.jsx` — main application wiring
- `src/components/*` — React components (InputPanel, Controls, Results, Diff view, FileDrop)
- `src/utils/*` — comparison engine and utilities (Levenshtein similarity, parsing, exporters)
- `src/styles.css` — styling, dark/light theme tokens and layout

