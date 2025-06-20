import React from 'react';

interface HighlightedTextProps {
  text: string;
  highlights: Array<{
    word: string;
    className: string;
  }>;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text, highlights }) => {
  let processedText = text;
  
  // Erstat hvert highlight med en span
  highlights.forEach(({ word, className }) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    processedText = processedText.replace(regex, `<span class="${className}">${word}</span>`);
  });

  return (
    <span dangerouslySetInnerHTML={{ __html: processedText }} />
  );
};

export default HighlightedText; 