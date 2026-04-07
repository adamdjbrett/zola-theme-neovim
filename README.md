# Neovim Theme (Eleventy Port)

This repository is an **Eleventy 3.1.5 port** of the original `Super-Botman/neovim-theme`.

- Original theme repo: <https://github.com/Super-Botman/neovim-theme>
- Original demo: <https://super-botman.github.io>
- License: GPL-3.0-or-later (unchanged)

![image](https://github.com/user-attachments/assets/0317c951-4975-4150-ac43-7faf4c57aa8b)

## What this port includes

- Eleventy `3.1.5`
- Nunjucks templates
- Luxon date filters
- Atom, RSS, JSON Feed, and twtxt feeds
- Styled feed and sitemap XML via XSL
- Microformats (`h-card`, `h-entry`)
- JSON-LD (`WebSite`, `BlogPosting`)
- Pagefind search indexing
- Blog pagination and previous/next arrows
- `metadata.yml` site data

## Directory structure

```text
_data/
_includes/
content/
css/
public/
scripts/
```

This layout follows the organizational pattern used by `eleventy-base-blog`.

## Install

```bash
npm install
```

## Run locally

```bash
npm start
```

## Build

```bash
npm run build
```

Build output goes to `_site/`.

## Site metadata

All site metadata lives in:

```text
content/_data/metadata.yml
```

## Notes on original Zola usage

The original Zola files and templates have been removed from this ported repository.
If you need the original Zola implementation, use the upstream project linked above.
