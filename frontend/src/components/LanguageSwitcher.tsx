import { useTranslation } from 'react-i18next';
import type { AppLocale } from '../i18n';
import styles from './LanguageSwitcher.module.css';

const LOCALES: AppLocale[] = ['de', 'en'];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div
      className={styles.switcher}
      role="group"
      aria-label={t('language.label')}
    >
      {LOCALES.map((locale) => {
        const active = i18n.language === locale;
        return (
          <button
            key={locale}
            type="button"
            className={active ? styles.buttonActive : styles.button}
            aria-pressed={active}
            onClick={() => void i18n.changeLanguage(locale)}
          >
            {t(`language.${locale}`)}
          </button>
        );
      })}
    </div>
  );
}
