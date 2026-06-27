export const metadata = {
  title: 'Mr. Lombardi PDF Demo',
  description: 'Minimal HTML-to-PDF demo using Next.js, Puppeteer Core, and Sparticuz Chromium.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
