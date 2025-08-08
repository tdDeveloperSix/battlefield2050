import React, { useState, useEffect, useMemo } from 'react';
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
  const [currentWeights, setCurrentWeights] = useState({ human: 80, ai: 20 });
  const [isVisible, setIsVisible] = useState(false);
  const [lastValidSection, setLastValidSection] = useState<string | null>(null);

  const sectionWeights: SectionWeights = useMemo(() => ({
    'human-dominance': { human: 95, ai: 5 },
    'digital-integration': { human: 80, ai: 20 },
    'autonomous-assistance': { human: 60, ai: 40 },
    'hybrid-command': { human: 40, ai: 60 },
    'machine-superiority': { human: 10, ai: 90 },
    'singularity': { human: 1, ai: 99 },
  }), []);

  useEffect(() => {
    // Show bar starting from "human-dominance" section and keep it visible once shown
    if (activeSection && sectionWeights[activeSection]) {
      setIsVisible(true);
      setLastValidSection(activeSection);
    }
  }, [activeSection, sectionWeights]);

  useEffect(() => {
    if (activeSection && sectionWeights[activeSection]) {
      const weights = sectionWeights[activeSection];
      setCurrentWeights({ human: weights.human, ai: weights.ai });
    }
  }, [activeSection, sectionWeights]);

  const getSectionTitle = (sectionId: string) => {
    return t(`decisionWeight.sections.${sectionId}`);
  };

  const getSectionDescription = (sectionId: string) => {
    return t(`decisionWeight.descriptions.${sectionId}`);
  };

  const displaySection = (activeSection && sectionWeights[activeSection]) 
    ? activeSection 
    : (lastValidSection || 'human-dominance');

  const currentSectionTitle = getSectionTitle(displaySection);
  const currentSectionDescription = getSectionDescription(displaySection);

  return (
    <div 
      role="region" aria-label="Decision weight bar"
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Bottom Bar Container */}
      <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-700 px-4 py-3 sm:px-6 sm:py-4">
        
        {/* Header with current phase info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <h3 className="text-sm font-semibold text-white">
              {currentSectionTitle}
            </h3>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {currentWeights.human}% / {currentWeights.ai}%
          </div>
        </div>

        {/* Decision Weight Bar */}
        <div className="mb-3">
          <div className="h-2 sm:h-3 relative overflow-hidden bg-slate-800 rounded-full shadow-inner">
            {/* Human section (left) */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-300 transition-all duration-[400ms] ease-out rounded-l-full"
              style={{ width: `${currentWeights.human}%` }}
            />
            
            {/* AI section (right) */}
            <div 
              className="absolute top-0 right-0 h-full bg-gradient-to-r from-blue-400 via-purple-500 to-purple-600 transition-all duration-[400ms] ease-out rounded-r-full"
              style={{ width: `${currentWeights.ai}%` }}
            />
            
            {/* Transition point indicator */}
            <div 
              className="absolute top-0 h-full w-0.5 bg-white/70 shadow-sm transition-all duration-[400ms] ease-out"
              style={{ left: `${currentWeights.human}%` }}
            />
          </div>
        </div>

        {/* Labels and explanation */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-sm"></div>
            <span className="text-slate-300 font-medium">
              {t('decisionWeight.human')} {t('decisionWeight.dominance')}
            </span>
          </div>
          
          <div className="text-slate-400 text-center flex-1 mx-4">
            <span className="hidden sm:inline">
              {currentSectionDescription}
            </span>
            <span className="sm:hidden">
              {currentSectionDescription}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-slate-300 font-medium">
              {t('decisionWeight.ai')} {t('decisionWeight.dominance')}
            </span>
            <div className="w-3 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionWeightBar; 