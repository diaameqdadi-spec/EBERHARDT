# Eberhardt Dental redesign

Modern responsive redesign of https://www.eberhardtdental.com, created locally on October 27, 2026.

## Run

Requires Node.js 20+. No packages or installation required.

```powershell
cd C:\Users\dmeqdadi\eberhardt-dental-redesign
npm start
```

Open http://127.0.0.1:4173. Stop the server with Ctrl+C.

```powershell
npm run check
npm run build
```

`dist/` is the static hosting output, including HTML for all imported routes. A host must serve `.aspx` as HTML for the legacy accessibility route, or rewrite it to index.html. `_redirects` supports Netlify-style hosts. The local preview is bound to loopback only.

## Included

- Local research archive: `source-pages/` (128 discovered original routes), `original.html`, and `doctors-original.html`. These raw snapshots are excluded from Git; all imported page content and required assets are included in the repository.
- `content.json`: imported patient education, doctor biographies, financial information, resources, policies, and disclosures. Original home information is also accessible at `/welcome/`.
- Searchable care library and site directory; patient resource hub; expandable FAQs; responsive menu; working browser history; call and map links.
- Original doctor portraits, educational images, seven patient PDFs saved locally, and original external video URLs.
- Shared responsive styling, keyboard focus, skip link, reduced-motion support, and meaningful image descriptions.

## Forms and integrations

Appointment requests, general contact, smile analysis submission, and review submission link to the practice’s existing live forms. This is intentional: the practice's ASP.NET backend, CAPTCHA, delivery configuration, and service credentials are not available in this local project. The preview does not store patient details, simulate submission, or claim delivery. A self-contained replacement requires an approved form service or the practice’s backend and recipient configuration. Never add private medical information to an unsecured form.

Patient reviews retain the original PracticeMojo embed and a direct fallback link. Videos link directly to the original ProSites MP4 files. External services require an internet connection and continued availability; original third-party reliability is outside this project. No real appointment or review was submitted during QA.

## Content preservation

The old site contains overlapping procedure routes; these are kept so every original address remains accessible. Original educational content is preserved, with obsolete visual formatting removed. The ADA version originally repeated the homepage; it is represented by an accessibility guidance page. The review submission page originally contained only a third-party script, so the new page routes visitors to the existing form. Legacy ASPX links are repaired to their current destinations.

Stock lifestyle photos are illustrative, not presented as portraits of the practice staff or actual patients. Hero: Andrea Piacquadio, Pexels photo 774909. Care image: Anna Shvets, Pexels photo 3845766. Google Fonts: DM Sans and Manrope (system fallbacks included). `asset-manifest.json` records all imported practice asset sources.

## Editing

`index.html` contains the shared navigation/footer. `app.js` renders the homepage and page experiences. `styles.css` controls responsive layout. `content.json` contains original content. Build again after changes. Import scripts and raw archives are development materials and excluded from `dist/`.

The original public content is preserved as provided; practice details, coverage, hours, and clinical guidance should be reviewed by the practice before a production launch. Nothing has been published or changed on the live domain.
