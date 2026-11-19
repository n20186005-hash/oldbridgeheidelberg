import { useLocale, useTranslations } from 'next-intl';

export default function LocalizedNotFound() {
  const t = useTranslations('siteUi');
  const locale = useLocale();
  return (
    <main className="min-h-screen px-6 flex flex-col items-center justify-center text-center" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <p className="font-display font-bold text-6xl mb-5">404</p>
      <h1 className="font-display text-2xl font-semibold mb-3">{t('notFoundTitle')}</h1>
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{t('notFoundText')}</p>
      <a href={`/${locale}`} className="rounded-full px-6 py-3 text-white" style={{ background: 'var(--accent)' }}>{t('notFoundHome')}</a>
    </main>
  );
}
