import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface DecisionWeightBarProps {
  activeSection: string;
}

interface SectionWeights {
  [key: string]: {
    human: number;
    ai: number;
  };
}

const DecisionWeightBar: React.FC<DecisionWeightBarProps> = ({ activeSection }) => {
  const { t } = useTranslation();
  const [currentWeights, setCurrentWeights] = useState({ human: 95, ai: 5 });
  const [isVisible, setIsVisible] = useState(false);

  const sectionWeights: SectionWeights = {
    'human-dominance': { human: 95, ai: 5 },
    'digital-integration': { human: 80, ai: 20 },
    'autonomous-assistance': { human: 60, ai: 40 },
    'hybrid-command': { human: 40, ai: 60 },
    'machine-superiority': { human: 10, ai: 90 },
    'singularity': { human: 1, ai: 99 },
  };

  useEffect(() => {
    // Show bar after initial load
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeSection && sectionWeights[activeSection]) {
      const weights = sectionWeights[activeSection];
      setCurrentWeights({ human: weights.human, ai: weights.ai });
    }
  }, [activeSection]);

  const getSectionTitle = (sectionId: string) => {
    return t(`decisionWeight.sections.${sectionId}`);
  };

  const currentSectionTitle = activeSection && sectionWeights[activeSection] 
    ? getSectionTitle(activeSection)
    : getSectionTitle('human-dominance');

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Decision Weight Bar */}
      <div className="group cursor-pointer relative">
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
          <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap border border-slate-600 shadow-xl backdrop-blur-sm">
            {currentWeights.human}% {t('decisionWeight.human')} / {currentWeights.ai}% {t('decisionWeight.ai')} – {currentSectionTitle}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
        </div>

        {/* Bar container with hover area */}
        <div className="relative">
          {/* Extended hover area for mobile */}
          <div className="absolute inset-x-0 -top-4 bottom-0 sm:-top-6"></div>
          
          {/* The actual bar */}
          <div className="h-1 sm:h-1.5 lg:h-2 relative overflow-hidden">
            {/* Human section (left) */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-300 transition-all duration-[400ms] ease-out"
              style={{ width: `${currentWeights.human}%` }}
            />
            
            {/* AI section (right) */}
            <div 
              className="absolute top-0 right-0 h-full bg-gradient-to-r from-blue-400 via-purple-500 to-purple-600 transition-all duration-[400ms] ease-out"
              style={{ width: `${currentWeights.ai}%` }}
            />
            
            {/* Transition point indicator */}
            <div 
              className="absolute top-0 h-full w-0.5 bg-white/70 shadow-sm transition-all duration-[400ms] ease-out"
              style={{ left: `${currentWeights.human}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionWeightBar; 