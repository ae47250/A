import chromium from '@sparticuz/chromium';
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const localBrowserPaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request) {
  let browser;

  try {
    const payload = await request.json();
    const inputText = String(payload?.text || '').trim();

    if (!inputText) {
      return Response.json({ error: 'Please enter text before creating the PDF.' }, { status: 400 });
    }

    if (inputText.length > 5000) {
      return Response.json({ error: 'Text is too long for this demo. Keep it under 5,000 characters.' }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
    const html = buildEstimateHtml(inputText, origin);
    const localBrowserPath = localBrowserPaths.find((browserPath) => existsSync(browserPath));

    browser = await puppeteer.launch({
      args: localBrowserPath ? ['--no-sandbox', '--disable-setuid-sandbox'] : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: localBrowserPath || await chromium.executablePath(),
      headless: chromium.headless
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.45in',
        right: '0.45in',
        bottom: '0.45in',
        left: '0.45in'
      }
    });

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="mr-lombardi-demo.pdf"',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unknown PDF generation error.'
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function buildEstimateHtml(inputText, origin) {
  const safeText = escapeHtml(inputText).replace(/\n/g, '<br />');
  const createdDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  const drumOne = `${origin}/drum-set-1.svg`;
  const drumTwo = `${origin}/drum-set-2.svg`;
  const drumThree = `${origin}/drum-set-3.svg`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Mr. Lombardi PDF Demo</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #eef2ef;
      color: #17201a;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14px;
      line-height: 1.5;
    }
    .page {
      min-height: 9.9in;
      background: #ffffff;
      border: 1px solid #d1d8d2;
      border-radius: 10px;
      overflow: hidden;
    }
    .banner {
      height: 1.45in;
      padding: 26px 34px;
      background: #2f6f3e;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 22px;
    }
    .eyebrow {
      margin: 0 0 6px;
      color: #e8f4ea;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.13em;
      text-transform: uppercase;
    }
    h1 {
      margin: 0;
      font-size: 38px;
      line-height: 1;
      letter-spacing: 0.03em;
    }
    .banner img {
      width: 205px;
      height: 92px;
      object-fit: contain;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.14);
      padding: 5px;
    }
    .content {
      padding: 32px 34px 38px;
    }
    .gallery {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 30px;
    }
    .gallery-card {
      border: 2px solid #d7e2da;
      border-radius: 16px;
      background: #f7faf8;
      padding: 10px;
      min-height: 132px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .gallery-card img {
      width: 100%;
      height: 112px;
      object-fit: contain;
    }
    .section-title {
      margin: 0 0 12px;
      font-size: 24px;
      line-height: 1.2;
      color: #17201a;
    }
    .notes-box {
      border: 1px solid #c8d0ca;
      border-radius: 14px;
      padding: 20px 22px;
      min-height: 180px;
      background: #fbfcfb;
      font-size: 18px;
      line-height: 1.55;
    }
    .thank-you {
      margin-top: 34px;
      min-height: 105px;
      border: 2px solid #d7e2da;
      border-radius: 16px;
      background: #eef4ee;
      color: #2f6f3e;
      font-size: 26px;
      font-weight: 800;
      line-height: 1.25;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
    }
    .footer {
      margin-top: 34px;
      color: #667068;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      gap: 18px;
    }
  </style>
</head>
<body>
  <article class="page">
    <header class="banner">
      <div>
        <p class="eyebrow">PDF Demo</p>
        <h1>MR. LOMBARDI</h1>
      </div>
      <img src="${drumOne}" alt="Full drum set" />
    </header>

    <main class="content">
      <section class="gallery" aria-label="Drum set images">
        <div class="gallery-card"><img src="${drumOne}" alt="Green studio drum set" /></div>
        <div class="gallery-card"><img src="${drumTwo}" alt="Red concert drum set" /></div>
        <div class="gallery-card"><img src="${drumThree}" alt="Blue jazz drum set" /></div>
      </section>

      <section>
        <h2 class="section-title">This is what you said:</h2>
        <div class="notes-box">${safeText}</div>
      </section>

      <section class="thank-you">
        Thank you for choosing Mr. Lombardi Services.
      </section>

      <footer class="footer">
        <span>Generated from the Mr. Lombardi demo web form.</span>
        <span>${createdDate}</span>
      </footer>
    </main>
  </article>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    return entities[character];
  });
}
