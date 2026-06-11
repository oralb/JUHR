# Journal of Undergraduate Horticultural Research (JUHR)

Static website for the **Journal of Undergraduate Horticultural Research (JUHR)**,
an open-access undergraduate scholarly journal in horticultural science hosted by the
Department of Horticulture, Chonnam National University.

The site is pure HTML/CSS/vanilla JavaScript — no build system, no backend, no
frameworks. It works by opening `index.html` locally and deploys directly to GitHub Pages.

Live site (after Pages is enabled): `https://oralb.github.io/JUHR/`

## Site structure

```
index.html              Home: masthead, current issue ToC, announcements, sidebar
about.html              Mission, scope, philosophy
editorial-board.html    Editorial board
author-guidelines.html  Article types, format, checklist
policies.html           Peer review, open access, ethics, AI policy
submission.html         Google Form link + submission checklist
current-issue.html      Volume 1, Issue 1 table of contents (with search)
archive.html            All issues, filterable by year
awards.html             Journal awards
contact.html            Contact information
articles/               One landing page per article (v1i1-01.html ... v1i1-05.html)
assets/pdf/             Article PDFs (named juhr-v1i1-01.pdf, etc.)
css/style.css           All styling
js/script.js            Nav toggle, search, archive filter, back-to-top
```

## Before launch — replace these placeholders

Search the repository for these strings and replace them:

| Placeholder | Where | Replace with |
|---|---|---|
| Sample articles | `index.html`, `current-issue.html`, `articles/` | Real articles (or delete until the first acceptance) |
| `ISSN: pending` | Mastheads and footers | Real ISSN once assigned |

The five sample articles are marked with `SAMPLE CONTENT` / `SAMPLE ARTICLE PAGE`
comments in the HTML.

## How to add a new article

1. **Create the landing page.** Copy an existing file in `articles/`
   (e.g., `articles/v1i1-01.html`) to a new name such as `articles/v1i1-06.html`.
   Edit the title, authors, affiliation, dates, abstract, keywords, page range,
   citation, and the PDF file name.
2. **Upload the PDF.** Put the article PDF in `assets/pdf/` with a matching name,
   e.g., `juhr-v1i1-06.pdf`.
3. **Add the ToC entry.** In `current-issue.html` (and optionally `index.html`),
   copy one `<li class="toc-item searchable">` block and edit its text and links.
4. Commit and push — GitHub Pages updates automatically within a couple of minutes.

## How to add a new issue or year

1. In `archive.html`, add a new `<section class="archive-year" data-year="YYYY">`
   block and a matching `<button data-year="YYYY">` in the filter bar.
2. When a new volume starts, move the old issue's ToC from `current-issue.html`
   to its own page (e.g., copy it to `archive-v1i1.html`) and link it from the archive.

## How to edit journal information

- **Editorial board:** edit `editorial-board.html` (copy a `.board-member` block per person).
- **Navigation, masthead, footer:** these are repeated in every HTML file
  (there is no template system), so apply the same edit to each page.
- **Colors and fonts:** edit the variables at the top of `css/style.css`.

## Deploy to GitHub Pages

1. Push the files to the `main` branch of this repository (files must be at the
   repository root, with `index.html` at the top level).
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main**, folder **/ (root)**
4. Save. After a minute or two the site is live at
   `https://oralb.github.io/JUHR/`.

Every later push to `main` redeploys the site automatically.

> Note: the repository is public, so anything committed here (including PDFs) is
> publicly visible. Only commit published articles — keep manuscripts under review
> in Google Drive.

## Use with Google Sites

**Option A — link (recommended).** In Google Sites, add a button labeled
"Open JUHR Website" linked to `https://oralb.github.io/JUHR/`.

**Option B — embed.** In Google Sites: **Insert → Embed → Embed code**, then paste:

```html
<iframe
  src="https://oralb.github.io/JUHR/"
  width="100%"
  height="900"
  style="border:0;"
  loading="lazy">
</iframe>
```

The embedded site scrolls inside a fixed-height frame; if that feels cramped,
use Option A instead.

## License

Site code: see `LICENSE`. Published articles are licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) unless otherwise noted.
