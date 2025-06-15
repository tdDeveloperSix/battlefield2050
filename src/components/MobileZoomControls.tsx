import React, { useState, useEffect } from 'react';

interface MobileZoomControlsProps {
  className?: string;
}

const MobileZoomControls: React.FC<MobileZoomControlsProps> = ({ className = '' }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 0.2, 3);
    setZoomLevel(newZoom);
    document.body.style.zoom = newZoom.toString();
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.2, 0.5);
    setZoomLevel(newZoom);
    document.body.style.zoom = newZoom.toString();
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    document.body.style.zoom = '1';
  };

  // Only show on mobile devices
  if (!isMobile) return null;

  return (
    <div className={`zoom-controls ${className}`}>
      <button
        className="zoom-btn"
        onClick={handleZoomIn}
        aria-label="Zoom ind"
        title="Zoom ind"
      >
        +
      </button>
      <button
        className="reset-zoom-btn"
        onClick={handleResetZoom}
        aria-label="Nulstil zoom"
        title="Nulstil zoom"
      >
        1:1
      </button>
      <button
        className="zoom-btn"
        onClick={handleZoomOut}
        aria-label="Zoom ud"
        title="Zoom ud"
      >
        −
      </button>
    </div>
  );
};

export default MobileZoomControls; 