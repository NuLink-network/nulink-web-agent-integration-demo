import i18next from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "en",
    backend: {
      loadPath: `/locales/{{lng}}.json`
    },
    react: {
      useSuspense: false
    },
    fallbackLng: 'en',
    detection: {
      caches: ['localStorage', 'sessionStorage', 'cookie'],
    },
    ignoreJSONStructure:false,
    preload: ['en'],
    keySeparator: false,
    interpolation: { escapeValue: false }
  })

export default i18next;
