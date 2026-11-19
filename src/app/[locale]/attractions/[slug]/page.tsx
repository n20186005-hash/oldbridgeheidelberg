import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { guides, type GuideLocale, type GuideSlug } from '@/lib/attraction-guides';
import { SITE_URL, localizedAlternates, SITE_LOCALES } from '@/lib/seo';

const isGuide = (slug: string): slug is GuideSlug => Object.prototype.hasOwnProperty.call(guides, slug);
const isLocale = (locale: string): locale is GuideLocale => SITE_LOCALES.some(l => l === locale);
type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return SITE_LOCALES.flatMap(locale => Object.keys(guides).map(slug => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isGuide(slug)) return {};
  const guide = guides[slug][locale];
  const suffix = `/attractions/${slug}`;
  return {
    title: `${guide.name} | Old Bridge Heidelberg`,
    description: `${guide.subtitle}. ${guide.intro.slice(0, 140)}`,
    alternates: localizedAlternates(locale, suffix),
    openGraph: { title: guide.name, description: guide.intro, url: `${SITE_URL}/${locale}${suffix}`, type: 'article' },
  };
}

const ui = {
  de: { back: 'Alle Sehenswürdigkeiten', explore: 'Entdecken', tips: 'Besuch planen', highlights: 'Sehenswertes', about: 'Über diesen Ort und seine Betreuung', basic: 'Grundinformationen', location: 'Standort', time: 'Empfohlene Besuchsdauer', access: 'Zugang und Eintritt', check: 'Aktuelle Hinweise vor Ort prüfen', history: 'Geschichte und Architektur', route: 'Spazierroute', photo: 'Fotospots', transit: 'Anreise', faq: 'Häufige Fragen', source: 'Quelle & weitere Informationen', map: 'Standort auf Google Maps', nearby: 'Weitere Sehenswürdigkeiten', photoTime: 'Individuell; siehe Besuchsplanung' },
  en: { back: 'All attractions', explore: 'Explore', tips: 'Plan your visit', highlights: 'Highlights', about: 'About this place and its management', basic: 'Essential information', location: 'Location', time: 'Suggested visit length', access: 'Access and admission', check: 'Check current notices on site', history: 'History and architecture', route: 'Walking itinerary', photo: 'Photo viewpoints', transit: 'Getting there', faq: 'Frequently asked questions', source: 'Source and further information', map: 'Open in Google Maps', nearby: 'More attractions', photoTime: 'Flexible; see visit advice' },
  zh: { back: '全部周边景点', explore: '探索景点', tips: '游览建议', highlights: '景区特色', about: '关于景点与管理主体', basic: '基本资料', location: '所在地', time: '建议停留', access: '开放与门票', check: '请以现场最新公告为准', history: '历史与建筑特色', route: '步行路线', photo: '拍照机位', transit: '交通方式', faq: '常见问答', source: '资料来源与延伸阅读', map: '在 Google 地图查看位置', nearby: '更多周边景点', photoTime: '依行程安排，详见游览建议' },
} as const;

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isGuide(slug)) notFound();
  setRequestLocale(locale);
  const guide = guides[slug][locale];
  const u = ui[locale];
  const others = (Object.keys(guides) as GuideSlug[]).filter(key => key !== slug);
  const h2 = 'font-display text-2xl sm:text-3xl font-semibold mb-4';
  const text = 'leading-relaxed text-base sm:text-lg';
  const siteUrl = `${SITE_URL}/${locale}/attractions/${slug}`;
  const structured = {
    '@context': 'https://schema.org', '@type': 'TouristAttraction', name: guide.name,
    description: guide.intro, url: siteUrl, hasMap: guides[slug].map,
    isAccessibleForFree: slug !== 'schloss',
    mainEntityOfPage: siteUrl,
  };
  return <>
    <Header />
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }} />
      <section className="pt-32 pb-16 px-4 sm:px-6" style={{ background: 'var(--bg-tertiary)' }}>
        <div className="max-w-5xl mx-auto">
          <a href={`/${locale}/attractions`} className="text-sm underline" style={{ color: 'var(--accent)' }}>← {u.back}</a>
          <p className="uppercase tracking-widest text-sm mt-10 mb-3" style={{ color: 'var(--accent)' }}>{u.explore}</p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>{guide.name}</h1>
          <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>{guide.subtitle}</p>
          <a href={guides[slug].map} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full text-white px-6 py-3" style={{ background: 'var(--accent)' }}>{u.map} ↗</a>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-16" style={{ color: 'var(--text-primary)' }}>
        <section><h2 className={h2}>{u.explore}</h2><p className={text}>{guide.intro}</p>
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            <div><h3 className="text-xl font-semibold mb-3">{u.tips}</h3><p className={text}>{guide.plan}</p></div>
            <div><h3 className="text-xl font-semibold mb-3">{u.highlights}</h3><ul className="list-disc pl-5 space-y-2">{guide.features.map(f => <li key={f}>{f}</li>)}</ul></div>
          </div>
        </section>
        <section><h2 className={h2}>{u.about}</h2><p className={text}>{guide.about}</p></section>
        <section><h2 className={h2}>{u.basic}</h2>
          <dl className="grid sm:grid-cols-2 gap-5 rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div><dt className="font-semibold">{u.location}</dt><dd className="mt-2"><a href={guides[slug].map} className="underline" style={{ color: 'var(--accent)' }}>{guide.name}, Heidelberg ↗</a></dd></div>
            <div><dt className="font-semibold">{u.time}</dt><dd className="mt-2">{u.photoTime}</dd></div>
            <div className="sm:col-span-2"><dt className="font-semibold">{u.access}</dt><dd className="mt-2">{u.check}</dd></div>
          </dl>
        </section>
        <section><h2 className={h2}>{u.history}</h2><p className={text}>{guide.history}</p></section>
        <section><h2 className={h2}>{u.route}</h2><p className={text}>{guide.plan}</p></section>
        <section><h2 className={h2}>{u.transit}</h2><p className={text}>{guide.transport}</p></section>
        <section><h2 className={h2}>{u.photo}</h2><p className={text}>{guide.photo}</p></section>
        <section><h2 className={h2}>{u.faq}</h2><div className="space-y-5">{guide.faq.map(([q, a]) => <div key={q} className="rounded-xl p-5" style={{ background: 'var(--bg-secondary)' }}><h3 className="font-semibold mb-2">{q}</h3><p>{a}</p></div>)}</div></section>
        <section><h2 className={h2}>{u.nearby}</h2><div className="flex flex-wrap gap-4">{others.map(key => <a key={key} href={`/${locale}/attractions/${key}`} className="rounded-full px-5 py-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>{guides[key][locale].name} →</a>)}</div></section>
        <section><h2 className={h2}>{u.source}</h2><a href={guides[slug].source} target="_blank" rel="noopener noreferrer" className="underline break-all" style={{ color: 'var(--accent)' }}>{guides[slug].source} ↗</a><p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{u.check}</p></section>
      </div>
    </main>
    <Footer />
  </>;
}
