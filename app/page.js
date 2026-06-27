'use client';

import { useState } from 'react';

const drumImages = [
  { src: '/drum-set-1.svg', alt: 'Green studio drum set' },
  { src: '/drum-set-2.svg', alt: 'Red concert drum set' },
  { src: '/drum-set-3.svg', alt: 'Blue jazz drum set' }
];

export default function HomePage() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('Ready to create PDF.');
  const [isCreating, setIsCreating] = useState(false);

  async function createPdf() {
    setIsCreating(true);
    setStatus('Creating PDF...');

    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      const contentType = response.headers.get('content-type') || '';

      if (response.ok && contentType.includes('application/pdf')) {
        const pdfBlob = await response.blob();
        const pdfUrl = URL.createObjectURL(pdfBlob);

        setStatus('PDF conversion successful. Opening PDF...');
        window.open(pdfUrl, '_blank');

        window.setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
        }, 60000);

        return;
      }

      let errorMessage = `Request failed with status ${response.status}.`;

      if (contentType.includes('application/json')) {
        const errorPayload = await response.json();
        if (errorPayload?.error) {
          errorMessage = errorPayload.error;
        }
      } else {
        const textPayload = await response.text();
        if (textPayload) {
          errorMessage = textPayload;
        }
      }

      setStatus(`PDF conversion failed: ${errorMessage}`);
    } catch (error) {
      setStatus(`PDF conversion failed: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <header style={styles.banner}>
          <div>
            <p style={styles.eyebrow}>PDF Demo</p>
            <h1 style={styles.brand}>MR. LOMBARDI</h1>
          </div>
          <img src="/drum-set-1.svg" alt="Full drum set" style={styles.bannerImage} />
        </header>

        <section style={styles.contentGrid}>
          <section style={styles.formPanel}>
            <h2 style={styles.heading}>Hér er texti sem ég þarf að breyta í PDF-snið.</h2>
            <p style={styles.description}>Skrifaðu texta hér að neðan.</p>

            <label htmlFor="estimate-text" style={styles.label}>
              Texti
            </label>
            <textarea
              id="estimate-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={9}
              style={styles.textarea}
            />

            <button type="button" onClick={createPdf} disabled={isCreating} style={styles.button}>
              {isCreating ? 'Creating PDF...' : 'Create PDF'}
            </button>

            <p aria-live="polite" style={styles.status}>
              {status}
            </p>
          </section>

          <aside style={styles.gallery} aria-label="Drum set gallery">
            {drumImages.map((image) => (
              <figure key={image.src} style={styles.figure}>
                <img src={image.src} alt={image.alt} style={styles.galleryImage} />
              </figure>
            ))}
          </aside>
        </section>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    margin: 0,
    padding: '42px 20px',
    background: '#eef2ef',
    color: '#17201a',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  shell: {
    width: '100%',
    maxWidth: 1120,
    margin: '0 auto',
    borderRadius: 28,
    background: '#ffffff',
    overflow: 'hidden',
    boxShadow: '0 22px 70px rgba(0, 0, 0, 0.12)'
  },
  banner: {
    minHeight: 170,
    padding: '30px 38px',
    background: '#2f6f3e',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24
  },
  eyebrow: {
    margin: '0 0 6px',
    color: '#e8f4ea',
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: '0.14em',
    textTransform: 'uppercase'
  },
  brand: {
    margin: 0,
    fontSize: 58,
    lineHeight: 1,
    letterSpacing: '0.03em'
  },
  bannerImage: {
    width: 270,
    maxWidth: '36%',
    height: 118,
    objectFit: 'contain',
    borderRadius: 18,
    background: 'rgba(255, 255, 255, 0.14)',
    padding: 8
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 330px',
    gap: 30,
    padding: 38
  },
  formPanel: {
    minWidth: 0
  },
  heading: {
    margin: '0 0 12px',
    fontSize: 36,
    lineHeight: 1.12
  },
  description: {
    margin: '0 0 28px',
    fontSize: 20,
    lineHeight: 1.45,
    color: '#46514a'
  },
  label: {
    display: 'block',
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 800
  },
  textarea: {
    boxSizing: 'border-box',
    width: '100%',
    padding: 18,
    border: '2px solid #b9c6bc',
    borderRadius: 16,
    fontSize: 19,
    lineHeight: 1.5,
    resize: 'vertical',
    minHeight: 245,
    color: '#17201a'
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
    minWidth: 260,
    minHeight: 86,
    padding: '24px 42px',
    border: 0,
    borderRadius: 999,
    background: '#2f6f3e',
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 12px 24px rgba(47, 111, 62, 0.25)'
  },
  status: {
    margin: '22px 0 0',
    fontSize: 17,
    fontWeight: 800
  },
  gallery: {
    display: 'grid',
    gap: 18,
    alignContent: 'start'
  },
  figure: {
    margin: 0,
    padding: 12,
    border: '2px solid #d7e2da',
    borderRadius: 22,
    background: '#f7faf8'
  },
  galleryImage: {
    display: 'block',
    width: '100%',
    height: 150,
    objectFit: 'contain'
  }
};
