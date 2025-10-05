// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 1. Importa tus archivos de traducción (locales)
import translationEN from './locales/en.json';
import translationES from './locales/es.json';

// Los recursos con todas las traducciones
const resources = {
  en: {
    translation: translationEN  // ✅ Sin .translation (ya es el objeto completo)
  },
  es: {
    translation: translationES  // ✅ Sin .translation (ya es el objeto completo)
  }
};

i18n
  .use(initReactI18next) // Pasa i18n al módulo react-i18next
  .init({
    resources,
    // Idioma por defecto para la demo NASA (inglés)
    lng: 'en', 
    fallbackLng: 'es', // Idioma de respaldo si la traducción falta

    interpolation: {
      escapeValue: false // React ya protege contra XSS
    },
    
    // Opcional: Detectar idioma del navegador automáticamente
    // detection: {
    //   order: ['navigator', 'htmlTag'],
    //   caches: []
    // }
  });

export default i18n;