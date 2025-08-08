import React, { useEffect, useState } from 'react';

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll as EventListener);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label="Til toppen"
      title="Til toppen"
      onClick={handleClick}
      className={`fixed right-4 bottom-20 sm:right-6 sm:bottom-24 z-50 rounded-full border border-emerald-400/50 text-emerald-300 bg-black/40 hover:bg-black/60 px-3 py-2 sm:px-4 sm:py-3 shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-3'
      }`}
    >
      <span className="hidden sm:inline font-semibold">Til top</span>
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

export default React.memo(BackToTop); 