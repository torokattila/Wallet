import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enLocales from './en.json';
import huLocales from './hu.json';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translations: enLocales },
            hu: { translations: huLocales },
        },
        lng: localStorage.getItem('i18nextLng') || 'en',
        fallbackLng: 'en',
        debug: false,
        ns: ['translations'],
        defaultNS: 'translations',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
