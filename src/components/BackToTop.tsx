import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const BackToTop: React.FC = () => {
  const { i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState<number>(112); // default ~7rem

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll as EventListener);
  }, []);

  useEffect(() => {
    const updateOffset = () => {
      const bar = document.querySelector('[data-role="decision-weight-bar"]') as HTMLElement | null;
      const barHeight = bar ? bar.getBoundingClientRect().height : 0;
      // Fjern visualViewport kode der kan forårsage uventede scroll-jumps
      const base = 24; // px ekstra luft
      setBottomOffset(Math.max(96, Math.ceil(barHeight) + base));
    };
    updateOffset();
    // Throttle resize events for at mindske layout thrashing
    let resizeTimeout: number | null = null;
    const throttledUpdate = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(updateOffset, 100);
    };
    window.addEventListener('resize', throttledUpdate);
    return () => {
      window.removeEventListener('resize', throttledUpdate);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label={i18n.language.startsWith('en') ? 'Back to top' : 'Til toppen'}
      title={i18n.language.startsWith('en') ? 'Back to top' : 'Til toppen'}
      onClick={handleClick}
      style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + ${bottomOffset}px)` }}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed right-4 sm:right-6 z-50 rounded-full border border-emerald-400/50 text-emerald-300 bg-black/40 hover:bg-black/60 px-3 py-2 sm:px-4 sm:py-3 shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-3'
      }`}
    >
      <span className="hidden sm:inline font-semibold">{i18n.language.startsWith('en') ? 'Top' : 'Til top'}</span>
      <svg
        className="sm:hidden w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
};

export default BackToTop; 
