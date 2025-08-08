import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import daTranslations from './locales/da.json';
import enTranslations from './locales/en.json';

const resources = {
  da: {
    translation: daTranslations
  },
  en: {
    translation: enTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'da',
    supportedLngs: ['da', 'en'],
    debug: false,
    
    detection: {
      // Rækkefølge af sprogdetektering metoder
      order: [
        'localStorage',     // Gemt bruger præference
        'sessionStorage',   // Session præference
        'navigator',        // Browser sprog indstillinger (navigator.language)
        'htmlTag',          // HTML lang attribut
        'path',             // URL path (f.eks. /en/page)
        'subdomain'         // Subdomain (f.eks. en.example.com)
      ],
      
      // Cache bruger præferencer
      caches: ['localStorage', 'sessionStorage'],
      
      // Konverter sprog koder (f.eks. 'en-US' -> 'en')
      convertDetectedLanguage: (lng: string) => {
        // Konverter lange sprog koder til korte
        if (lng.startsWith('da')) return 'da';
        if (lng.startsWith('en')) return 'en';
        return lng.split('-')[0]; // Tag første del af sprog kode
      }
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 