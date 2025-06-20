export interface HighlightConfig {
  [key: string]: {
    da: string[];
    en: string[];
    className: string;
  };
}

export const highlightConfig: HighlightConfig = {
  technology: {
    da: ['OODA-loop', 'neurale netværk', 'datafusion', 'beslutningsstrøm'],
    en: ['OODA-loop', 'neural networks', 'data fusion', 'decision stream'],
    className: 'text-emerald-400 font-semibold'
  },
  military: {
    da: ['auftragstaktik', 'C2-system', 'kill chain'],
    en: ['auftragstaktik', 'C2 system', 'kill chain'],
    className: 'text-blue-400 font-semibold'
  },
  ai: {
    da: ['Artificial General Intelligence', 'LLM-baseret', 'kvante-link'],
    en: ['Artificial General Intelligence', 'LLM-based', 'quantum link'],
    className: 'text-purple-400 font-semibold'
  }
};

export function highlightText(text: string, language: 'da' | 'en'): string {
  let processedText = text;
  
  Object.values(highlightConfig).forEach(({ da, en, className }) => {
    const words = language === 'da' ? da : en;
    
    words.forEach(word => {
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      processedText = processedText.replace(regex, `<span class="${className}">$&</span>`);
    });
  });
  
  return processedText;
} 