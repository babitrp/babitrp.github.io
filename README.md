# babitrp.github.io

Personal portfolio of **Babit Ranjan Pradhan**, Senior Analytics Consultant in pharmaceutical technology and data science.

**Live site:** https://babitrp.github.io

Clinical applications on CDISC ADaM, data engineering, AI/ML and application architecture, each with an interactive walkthrough that runs on public data.

## Projects

| Project | Page | Walkthrough |
|---|---|---|
| Patient Explorer: patient-level safety review | [/work/patient-explorer/](https://babitrp.github.io/work/patient-explorer/) | 12 screens from the app |
| DEEP: dose-escalation trial platform | [/work/deep/](https://babitrp.github.io/work/deep/) | Live simulator |
| PreviewR: clinical document comparison | [/work/previewr/](https://babitrp.github.io/work/previewr/) | Guided live demo |
| InsightsDiff: dataset comparison | [/work/insightsdiff/](https://babitrp.github.io/work/insightsdiff/) | Guided live demo |
| Header-statistics tables | [/work/header-tables/](https://babitrp.github.io/work/header-tables/) | Guided live demo |
| Synthetic ADaM generator | [/work/synthetic-adam/](https://babitrp.github.io/work/synthetic-adam/) | Guided live demo |
| Purvadrishti (personal project) | [/work/purvadrishti/](https://babitrp.github.io/work/purvadrishti/) | 8 screens from the [live demo](https://babitrp.github.io/nivesh-demo/) |

## Repository layout

```
.
├── index.html              Home page
├── resume.pdf              Downloadable resume (linked from every page)
├── assets/
│   ├── site.css            Shared styles, light and dark themes
│   ├── site.js             Theme toggle, menu, walkthrough engine
│   ├── img/                Project thumbnails
│   └── og/                 Social share images (1200 × 630)
├── work/
│   └── <project>/
│       ├── index.html      Case study and walkthrough
│       └── img/            Walkthrough screenshots (where used)
├── sitemap.xml
├── robots.txt
└── .nojekyll               Serve files as-is, without Jekyll
```

## How it works

- Static HTML, CSS and JavaScript with no build step or framework, served by GitHub Pages from `main` at the repository root.
- Each project page loads its own walkthrough data and screenshots, so the home page stays light.
- Interactive charts on the Patient Explorer page load plotly.js from its CDN on first use. If that fails, the step falls back to the screenshot.
- The theme defaults to light. A visitor's choice of light or dark is remembered in their browser.
- Every page has its own description, Open Graph and Twitter large-image cards, and JSON-LD structured data.
- Old `/#/work/<project>` links redirect to `/work/<project>/`.

## Updating

| To change | Edit |
|---|---|
| Home page text | `index.html` |
| A case study | `work/<project>/index.html` |
| Styles or colours | `assets/site.css` (colour tokens are at the top) |
| Resume | Replace `resume.pdf`, keeping the same name |
| Share image | Replace the matching file in `assets/og/`, at 1200 × 630 |

When you add a project page, also add its URL to `sitemap.xml`.

To preview locally:

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Data and confidentiality

- All walkthroughs use public CDISC pilot study data from the [pharmaverseadam](https://pharmaverse.github.io/pharmaverseadam/) R package. No client or patient data appears anywhere.
- Client work is described by what it does, not by whose it is.
- The Patient Explorer screens come from the application running on public data. The other clinical walkthroughs are in-browser illustrations of each application, not the applications themselves.
- Impact figures for the clinical applications are estimates, not measured results. The method is described on the home page.

## Contact

[LinkedIn](https://www.linkedin.com/in/babit-ranjan-pradhan/) · [GitHub](https://github.com/babitrp)
