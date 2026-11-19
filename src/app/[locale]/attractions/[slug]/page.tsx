import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { guides, guidePhotos, guidePractical, guideHoursAndTickets, type GuideLocale, type GuideSlug } from '@/lib/attraction-guides';
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
  de: { back: 'Alle Sehenswürdigkeiten', explore: 'Entdecken', tips: 'Besuch planen', highlights: 'Sehenswertes', about: 'Über diesen Ort und seine Betreuung', basic: 'Grundinformationen', location: 'Standort', time: 'Empfohlene Besuchsdauer', access: 'Zugang und Eintritt', check: 'Aktuelle Hinweise vor Ort prüfen', history: 'Geschichte und Architektur', route: 'Spazierroute', photo: 'Fotospots', transit: 'Anreise', faq: 'Häufige Fragen', source: 'Quelle & weitere Informationen', map: 'Standort auf Google Maps', nearby: 'Weitere Sehenswürdigkeiten', hours: 'Öffnungszeiten', tickets: 'Eintrittspreise', notice: 'Hinweise für Besucher', stay: 'Übernachten in der Nähe', stayText: 'Unterkünfte in der Altstadt eignen sich für Spaziergänge zu Fuß; rund um den Hauptbahnhof gibt es zusätzliche Verkehrsanbindungen. Preise hängen von Saison und Verfügbarkeit ab.', reviews: 'Bewertungen', reviewsText: 'Aktuelle Bewertungen und die Zahl der Rezensionen finden Sie direkt auf der jeweiligen Google-Maps-Ortsseite.', transport: 'Verkehr und Navigation' },
  en: { back: 'All attractions', explore: 'Explore', tips: 'Plan your visit', highlights: 'Highlights', about: 'About this place and its management', basic: 'Essential information', location: 'Location', time: 'Suggested visit length', access: 'Access and admission', check: 'Check current notices on site', history: 'History and architecture', route: 'Walking itinerary', photo: 'Photo viewpoints', transit: 'Getting there', faq: 'Frequently asked questions', source: 'Source and further information', map: 'Open in Google Maps', nearby: 'More attractions', hours: 'Opening hours', tickets: 'Admission prices', notice: 'Visitor guidance', stay: 'Where to stay nearby', stayText: 'Old Town accommodation suits travellers exploring on foot; the main station area provides other transport connections. Prices depend on dates and availability.', reviews: 'Visitor reviews', reviewsText: 'See the place listing on Google Maps for current reviews and review counts.', transport: 'Transport and navigation' },
  zh: { back: '全部周边景点', explore: '探索景点', tips: '游览建议', highlights: '景区特色', about: '关于景点与管理主体', basic: '基本资料', location: '所在地', time: '建议停留', access: '开放与门票', check: '请以现场最新公告为准', history: '历史与建筑特色', route: '步行路线', photo: '拍照机位', transit: '交通方式', faq: '常见问答', source: '资料来源与延伸阅读', map: '在 Google 地图查看位置', nearby: '更多周边景点', hours: '开放时间', tickets: '门票价格', notice: '游览须知', stay: '周边住宿建议', stayText: '住在老城区适合以步行为主的行程；中央车站周边则便于连接其他交通线路。住宿价格随季节和房态变化。', reviews: '游客评价', reviewsText: '最新游客评价与评价数量可通过该地点的 Google 地图页面查看。', transport: '交通与定位' },
} as const;

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isGuide(slug)) notFound();
  setRequestLocale(locale);
  const guide = guides[slug][locale];
  const u = ui[locale];
  const others = (Object.keys(guides) as GuideSlug[]).filter(key => key !== slug);
  const photos = guidePhotos[slug] || [];
  const practical = guidePractical[slug];
  const h2 = 'font-display text-2xl sm:text-3xl font-semibold mb-4';
  const text = 'leading-relaxed text-base sm:text-lg';
  const siteUrl = `${SITE_URL}/${locale}/attractions/${slug}`;
  const structured = {
    '@context': 'https://schema.org', '@type': 'TouristAttraction', name: guide.name,
    description: guide.intro, url: siteUrl, hasMap: guides[slug].map,
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
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{practical.address} · {practical.duration}</p>
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
        <section className="rounded-2xl p-7 sm:p-10" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <h2 className={h2}>{u.about}</h2><p className={text}>{guide.about}</p>
        </section>
        {photos.length > 0 && <section aria-label={guide.name} className="grid sm:grid-cols-2 gap-5">
          {photos.map((photo, index) => <figure key={photo.src}>
            <img src={photo.src} alt={`${guide.name} — ${index + 1}`} loading="lazy" className="w-full h-64 sm:h-72 object-cover rounded-xl" />
            <figcaption className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Wikimedia Commons · <a className="underline" href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(photo.credit.replaceAll(' ', '_'))}`} target="_blank" rel="noopener noreferrer">{photo.credit}</a>
            </figcaption>
          </figure>)}
        </section>}
        <section><h2 className={h2}>{u.basic}</h2>
          <dl className="grid sm:grid-cols-2 gap-5 rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div><dt className="font-semibold">{u.location}</dt><dd className="mt-2"><a href={guides[slug].map} className="underline" style={{ color: 'var(--accent)' }}>{practical.address} ↗</a></dd></div>
            <div><dt className="font-semibold">{u.time}</dt><dd className="mt-2">{practical.duration}</dd></div>
            <div className="sm:col-span-2"><dt className="font-semibold">{u.access}</dt><dd className="mt-2">{practical.access[locale]}</dd></div>
          </dl>
        </section>
        <section className="grid md:grid-cols-2 gap-8">
          <div><h2 className={h2}>{u.hours}</h2><p className={text}>{guideHoursAndTickets[slug][locale][0]}</p></div>
          <div><h2 className={h2}>{u.tickets}</h2><p className={text}>{guideHoursAndTickets[slug][locale][1]}</p></div>
        </section>
        <section><h2 className={h2}>{u.history}</h2><p className={text}>{guide.history}</p></section>
        <section><h2 className={h2}>{u.route}</h2><ol className="grid gap-4">{practical.routeStops[locale].map((step, i) => <li key={step} className="flex items-start gap-4 rounded-xl p-5" style={{ background: 'var(--bg-secondary)' }}><span className="rounded-full w-9 h-9 flex-shrink-0 flex items-center justify-center font-semibold text-white" style={{ background: 'var(--accent)' }}>{i + 1}</span><p className={text}>{step}</p></li>)}</ol></section>
        <section><h2 className={h2}>{u.transit}</h2><p className={text}>{guide.transport}</p></section>
        <section><h2 className={h2}>{u.notice}</h2><p className={text}>{practical.access[locale]} {u.check}</p></section>
        <section><h2 className={h2}>{u.photo}</h2><p className={text}>{guide.photo}</p></section>
        <section><h2 className={h2}>{u.stay}</h2><p className={text}>{u.stayText}</p></section>
        <section><h2 className={h2}>{u.reviews}</h2><p className={text}>{u.reviewsText}</p><a className="inline-block underline mt-3" href={guides[slug].map} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>{u.map} ↗</a></section>
        <section><h2 className={h2}>{u.faq}</h2><div className="space-y-5">{guide.faq.map(([q, a]) => <div key={q} className="rounded-xl p-5" style={{ background: 'var(--bg-secondary)' }}><h3 className="font-semibold mb-2">{q}</h3><p>{a}</p></div>)}</div></section>
        <section><h2 className={h2}>{u.transport}</h2><p className={text}>{practical.address}</p><a className="inline-block mt-4 rounded-full px-6 py-3 text-white" style={{ background: 'var(--accent)' }} href={guides[slug].map} target="_blank" rel="noopener noreferrer">{u.map} ↗</a></section>
        <section><h2 className={h2}>{u.nearby}</h2><div className="flex flex-wrap gap-4">{others.map(key => <a key={key} href={`/${locale}/attractions/${key}`} className="rounded-full px-5 py-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>{guides[key][locale].name} →</a>)}</div></section>
        <section><h2 className={h2}>{u.source}</h2><a href={guides[slug].source} target="_blank" rel="noopener noreferrer" className="underline break-all" style={{ color: 'var(--accent)' }}>{guides[slug].source} ↗</a><p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{u.check}</p></section>
      </div>
    </main>
    <Footer />
  </>;
}
