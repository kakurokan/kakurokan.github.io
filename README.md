# kakurokan.github.io

Personal portfolio of **Léo Kakali**, software engineer (Java, Python), finishing a BSc in Informatics Engineering at the University of the Algarve and available from **July 2027**.

**Live:** https://kakurokan.github.io · Portuguese: https://kakurokan.github.io/?lang=pt

The site is a retro desktop. Cards work like windows: you can drag one onto another to swap them, minimize, expand or close them, and reopen any of them from the taskbar. A small pixel-art cat, Koji, walks across the cards, jumps between them and naps now and then.

## Features

- **Projects, contests, education and stack** in draggable cards. Only the most relevant ones are open on load.
- **English / Portuguese**, switchable from the taskbar or with `?lang=pt` in the URL.
- **Five themes:** Game Boy (default, with an animated pixel-art wallpaper drawn on a canvas), vaporwave, pink, mint and night.
- **Search** across every card, including closed ones, accent-insensitive.
- **Command prompt** with `HELP`, `DIR`, `TYPE stack.yml`, `START projects`, `THEME vapor` and `LANG pt`.
- **Accessible and lightweight:** real buttons and links, keyboard support, `prefers-reduced-motion` respected, and no build step or dependencies.

## Stack

Plain HTML, CSS and JavaScript in a single `index.html`. There is no framework and no bundler. Fonts come from Google Fonts. Every icon and the wallpaper is pixel art defined in code.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Editing content

Everything lives in the `<script>` at the end of `index.html`:

| What | Where |
| --- | --- |
| All text, in English and Portuguese | `I18N` |
| Projects (description, stats, tags, links) | `PROJECTS` |
| Compact "More projects" list | `MORE` |
| Card order and which cards start closed | `DEFAULT_ORDER`, `DEFAULT_CLOSED` |
| CV file per language | `cv.file` in `I18N` (`cv-en.pdf`) |

## Deploy

GitHub Pages serves the `main` branch from the repository root. Pushing to `main` updates the site in about a minute.

## Contact

[LinkedIn](https://www.linkedin.com/in/leo-kakali) · [GitHub](https://github.com/kakurokan) · leokakali7@gmail.com

© 2026 Léo Kakali
