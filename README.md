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

## Suggested GitHub workflow (one-time)

```bash
git init
git add .
git commit -m "Initial: React text comparator"
# create a repo on GitHub then
git remote add origin git@github.com:<yourUser>/<yourRepo>.git
git branch -M main
git push -u origin main
```

If you want GitHub Pages hosting (static): configure the repository to serve from the `dist/` folder after building (or use GitHub Actions to build then publish to gh-pages).

## CI / GitHub Actions (automatic Pages deploy)

This project includes a GitHub Actions workflow that builds the app and publishes the `dist/` folder to GitHub Pages automatically when you push to the `main` branch.

How it works:

- The workflow runs on `push` to `main`.
- It installs dependencies, runs `npm run build`, uploads the `dist/` folder as an artifact, and then deploys it to GitHub Pages using the official GitHub Actions.

Files added:

- `.github/workflows/pages.yml` — builds the site and deploys to Pages.

Notes:

- Your repository must have a `main` branch. If you use a different default branch, update the workflow trigger.
- GitHub Pages will be enabled automatically for the repository when the workflow first deploys (you may need to enable Pages in repository settings the first time).
- The workflow uses the built-in `GITHUB_TOKEN`, so no extra secrets are required for basic Pages publishing.

To test locally before pushing, run:

```bash
npm ci
npm run build
```

Then push to `main` and GitHub Actions will do the rest.

## LinkedIn post draft

Copy and paste the following text into LinkedIn when you publish:

"Launched a tiny utility: Text Comparator — a fast client-side tool to compare lists and paragraphs, detect exact duplicates and near-matches, remove duplicates selectively, and export results. Built with React + Vite. Try the demo locally: `git clone <repo>` → `npm install` → `npm run dev`. Feedback welcome!"

(Shorten or personalize as needed; include screenshots or a short demo GIF.)

## Notes & next steps

- The UI now includes a "Similarity sensitivity" control and helper text to make fuzzy/near-match behavior clearer.
- I recommend adjusting the default sensitivity to 72 for a balanced experience.
- Next I can improve dark-mode contrast further if you still find fonts hard to read — I can raise text contrast and/or change the font stack to a more legible web font.

## License

MIT

---

If you want, I can now:
1. Tweak the dark-mode text contrast and font sizes further (I left this as the next todo). 
2. Create a ready-to-run GitHub Actions workflow to build and publish `dist/` to GitHub Pages.
3. Draft images and a short LinkedIn post with step-by-step share text and sample hashtags.

Tell me which next step to take (reply: 1, 2, or 3) or ask for edits to the README.
