import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './locales/de.json';
import en from './locales/en.json';

export const LOCALE_STORAGE_KEY = 'process-to-flow.locale';
export type AppLocale = 'de' | 'en';

function resolveInitialLocale(): AppLocale {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === 'de' || stored === 'en') {
    return stored;
  }
  return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
}

void i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    en: { translation: en },
  },
  lng: resolveInitialLocale(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (locale) => {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  document.documentElement.lang = locale;
});

document.documentElement.lang = i18n.language;

export default i18n;
