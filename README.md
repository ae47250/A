# Mr. Lombardi PDF Demo

Minimal GitHub/Vercel-ready Next.js App Router demo for converting generated HTML into a PDF using `puppeteer-core` plus `@sparticuz/chromium`.

This version has a Mr. Lombardi drummer-themed browser page and generated PDF.

## What it does

1. Opens a simple web page at `/`.
2. Shows a green **MR. LOMBARDI** banner.
3. Displays the Icelandic heading: `Hér er texti sem ég þarf að breyta í PDF-snið.`
4. Lets the user type text into a textarea.
5. Shows three full drum-set image assets from the `public/` folder.
6. Sends the text to `/api/pdf` when the user clicks **Create PDF**.
7. Builds a simple Mr. Lombardi PDF HTML document with the same drum-set assets.
8. Converts the HTML to PDF with Puppeteer Core and Sparticuz Chromium.
9. Returns the PDF directly as `application/pdf`.
10. The frontend opens the returned PDF in a new browser tab.
11. If the API fails, it returns JSON with an error message and the frontend displays it.

## Directory structure

```text
Apdf-demo/
├─ package.json
├─ next.config.mjs
├─ README.md
├─ .gitignore
├─ app/
│  ├─ layout.js
│  ├─ page.js
│  └─ api/
│     └─ pdf/
│        └─ route.js
└─ public/
   ├─ alpha-logo.png
   ├─ drum-set-1.svg
   ├─ drum-set-2.svg
   └─ drum-set-3.svg
```

The extracted project uses this directory structure. Codex can infer the structure from the folders and from this README.

## Important files

- `app/page.js` controls the browser user interface.
- `app/api/pdf/route.js` controls the generated PDF HTML/CSS and Puppeteer conversion.
- `public/drum-set-1.svg`, `public/drum-set-2.svg`, and `public/drum-set-3.svg` are used by both the browser page and the generated PDF.

## Local test

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

Type text, click **Create PDF**, and confirm the PDF opens in a new tab.

## API-only smoke test

With the dev server running:

```bash
curl -X POST http://localhost:3000/api/pdf \
  -H "Content-Type: application/json" \
  -d '{"text":"hello hello"}' \
  --output mr-lombardi-test.pdf \
  --dump-header mr-lombardi-test-headers.txt
```

Expected result: `mr-lombardi-test.pdf` is created and the response headers include `Content-Type: application/pdf`.

## Vercel notes

This demo uses the Next.js App Router and forces the API route to run in the Node.js runtime because Puppeteer/Chromium cannot run in the Edge runtime.

If Vercel deployment fails, the most likely area to debug is Chromium startup inside `app/api/pdf/route.js`.
