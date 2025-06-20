import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface HighlightRule {
  pattern: string | RegExp;
  className: string;
}

export function useHighlightedText(text: string, rules: HighlightRule[]) {
  const { i18n } = useTranslation();
  
  const highlightedText = useMemo(() => {
    let result = text;
    
    rules.forEach(({ pattern, className }) => {
      const regex = typeof pattern === 'string' 
        ? new RegExp(`\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
        : pattern;
      
      result = result.replace(regex, `<span class="${className}">$&</span>`);
    });
    
    return result;
  }, [text, rules, i18n.language]);
  
  return highlightedText;
}

// Predefinerede regler for forskellige kategorier
export const highlightRules = {
  military: [
    { pattern: 'OODA-loop', className: 'text-emerald-400 font-semibold' },
    { pattern: 'auftragstaktik', className: 'text-blue-400 font-semibold' },
    { pattern: 'C2-system', className: 'text-purple-400 font-semibold' },
    { pattern: 'C2 system', className: 'text-purple-400 font-semibold' }
  ],
  technology: [
    { pattern: 'neurale netværk', className: 'text-cyan-400 font-semibold' },
    { pattern: 'neural networks', className: 'text-cyan-400 font-semibold' },
    { pattern: 'AI', className: 'text-yellow-400 font-semibold' },
    { pattern: 'Artificial Intelligence', className: 'text-yellow-400 font-semibold' }
  ],
  concepts: [
    { pattern: 'beslutningsstrøm', className: 'text-pink-400 font-semibold' },
    { pattern: 'decision stream', className: 'text-pink-400 font-semibold' },
    { pattern: 'datafusion', className: 'text-indigo-400 font-semibold' },
    { pattern: 'data fusion', className: 'text-indigo-400 font-semibold' }
  ]
}; 