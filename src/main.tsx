import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// SPA tracking for Plausible (cookieless)
declare global {
  interface Window { plausible?: (event: string, opts?: any) => void }
}

let lastPath = location.pathname + location.search + location.hash;
const track = () => {
  const current = location.pathname + location.search + location.hash;
  if (current !== lastPath && typeof window.plausible === 'function') {
    window.plausible('pageview');
    lastPath = current;
  }
};
window.addEventListener('popstate', track);
window.addEventListener('hashchange', track);
