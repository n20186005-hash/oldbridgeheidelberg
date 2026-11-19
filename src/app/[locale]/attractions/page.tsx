import { setRequestLocale } from 'next-intl/server';
import { useTranslations, useLocale, useMessages } from 'next-intl';
import {
  SITE_NAME,
  SITE_URL,
  absSightsUrl,
  absLocalizedUrl,
  localizedAlternates,
  ogLocale,
  homeHref,
  SIGHTS_PATH,
} from '@/lib/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';
import { guides, type GuideSlug, type GuideLocale } from '@/lib/attraction-guides';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const meta = (messages?.attractions as any)?.meta;
  const title = meta?.title || messages?.meta?.title;
  const description = meta?.description || messages?.meta?.description;
  const selfUrl = absSightsUrl(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: localizedAlternates(locale, SIGHTS_PATH),
    openGraph: {
      title,
      description,
      url: selfUrl,
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      type: 'website',
    },
  };
}

type AttractionItem = {
  id: string;
  name: string;
  distance: string;
  description: string;
};

function AttractionsHero() {
  const t = useTranslations('attractions');
  const th = useTranslations('header');
  const locale = useLocale();

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: th('home'),
        item: absLocalizedUrl(locale),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('badge'),
        item: absSightsUrl(locale),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <section className="relative min-h-[70vh] flex items-end pb-16 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/gallery/old-bridge-heidelberg (1).jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full pt-28">
          <div className="max-w-3xl">
            <span
              className="inline-block text-xs sm:text-sm font-medium tracking-wide uppercase rounded-full px-4 py-1.5 mb-6 text-white"
              style={{ background: 'var(--accent)' }}
            >
              {t('badge')}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              {t('title')}
            </h1>
          </div>
        </div>
      </section>
    </>
  );
}

function AttractionsBody() {
  const t = useTranslations('attractions');
  const locale = useLocale();
  const messages = useMessages() as any;
  const intro = (messages?.attractions?.intro || []) as string[];
  const items = (messages?.attractions?.items || []) as AttractionItem[];
  const tips = (messages?.attractions?.tips?.list || []) as string[];
  const home = homeHref(locale);
  const guideSlugs = Object.keys(guides) as GuideSlug[];

  return (
    <>
      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          {intro.map((paragraph, i) => (
            <p
              key={i}
              className="text-base sm:text-lg leading-relaxed mb-4 last:mb-0"
              style={{ color: 'var(--text-secondary)' }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section id="attractions-list" className="section-padding pt-0">
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-display text-2xl sm:text-3xl font-semibold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('overviewTitle')}
          </h2>
          <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

          {/* Quick-reference comparison table: name + walking distance from the Old Bridge. */}
          <div
            className="rounded-xl overflow-hidden mb-12"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <table className="w-full text-left text-sm sm:text-base border-collapse">
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)' }}>
                  <th
                    className="px-4 sm:px-6 py-3 font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t('colName')}
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t('colDistance')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    style={{
                      borderTop: '1px solid var(--border-color)',
                    }}
                  >
                    <td className="px-4 sm:px-6 py-3">
                      <a
                        href={`#${item.id}`}
                        className="font-medium transition-colors"
                        style={{ color: 'var(--accent)' }}
                      >
                        {`${index + 1}. ${item.name}`}
                      </a>
                    </td>
                    <td
                      className="px-4 sm:px-6 py-3"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {item.distance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2
            className="font-display text-2xl sm:text-3xl font-semibold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('itemsTitle')}
          </h2>
          <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

          <div className="space-y-6">
            {items.map((item, index) => (
              <article
                key={item.id}
                id={item.id}
                className="rounded-xl p-6 sm:p-8 scroll-mt-24"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-sm font-bold rounded-full w-9 h-9 flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: 'var(--accent)' }}
                    >
                      {index + 1}
                    </span>
                    <h3
                      className="font-display text-xl sm:text-2xl font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.name}
                    </h3>
                  </div>
                  <span
                    className="text-xs font-medium rounded-full px-3 py-1.5"
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {item.distance}
                  </span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {guideSlugs.map(slug => (
              <a key={slug} href={`/${locale}/attractions/${slug}`} className="block rounded-xl p-5 transition-opacity hover:opacity-80" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <h3 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{guides[slug][locale as GuideLocale].name}</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{guides[slug][locale as GuideLocale].subtitle}</p>
                <span className="font-medium" style={{ color: 'var(--accent)' }}>→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div
            className="rounded-xl p-6 sm:p-8"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent)' }}
          >
            <h2
              className="font-display text-xl sm:text-2xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('tips.title')}
            </h2>
            <ul className="space-y-3">
              {tips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent)' }} className="flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            {t('bridgeTitle')}
          </h2>
          <p className="text-base sm:text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
            {t('bridgeText')}
          </p>
          <a
            href={home}
            className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-white font-medium transition-all hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {t('bridgeCta')}
          </a>
        </div>
      </section>
    </>
  );
}

export default async function AttractionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Header />
      <main>
        <AttractionsHero />
        <AttractionsBody />
      </main>
      <Footer />
    </>
  );
}
