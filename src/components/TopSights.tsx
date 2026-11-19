import { useTranslations, useLocale, useMessages } from 'next-intl';
import { sightsHref } from '@/lib/seo';

type SightItem = {
  name: string;
  distance: string;
  desc: string;
};

export default function TopSights() {
  const t = useTranslations('topSights');
  const locale = useLocale();
  const messages = useMessages() as any;
  const items = (messages?.topSights?.items || []) as SightItem[];
  const guideSlugs = ['schloss', 'koenigstuhl', 'philosophenweg', 'altstadt', 'heiliggeistkirche', 'universitaet'];
  const additional = {
    de: [
      { name: 'Brückentor', distance: 'Direkt an der Brücke', desc: 'Historische Tortürme mit Blick auf den Neckar.', slug: 'brueckentor' },
      { name: 'Heidelberger Brückenaffe', distance: 'Am Brückentor', desc: 'Die bekannte Bronzefigur am Zugang zur Alten Brücke.', slug: 'brueckenaffe' },
      { name: 'Jesuitenkirche', distance: 'In der Altstadt', desc: 'Barocke Kirche mit hellem Innenraum nahe dem Universitätsplatz.', slug: 'jesuitenkirche' },
      { name: 'Studentenkarzer', distance: 'Bei der Universität', desc: 'Historische Arrestzellen mit studentischer Wandkunst.', slug: 'studentenkarzer' },
    ],
    en: [
      { name: 'Bridge Gate', distance: 'At the bridge', desc: 'Historic gate towers overlooking the Neckar.', slug: 'brueckentor' },
      { name: 'Heidelberg Bridge Monkey', distance: 'By the gate', desc: 'The famous bronze sculpture beside the Old Bridge entrance.', slug: 'brueckenaffe' },
      { name: 'Jesuit Church', distance: 'Old Town', desc: 'A light-filled Baroque church near University Square.', slug: 'jesuitenkirche' },
      { name: 'Student Jail', distance: 'University Quarter', desc: 'Historic detention rooms covered in student drawings.', slug: 'studentenkarzer' },
    ],
    zh: [
      { name: '海德堡老桥门', distance: '老桥入口', desc: '守护内卡河畔的历史双塔城门。', slug: 'brueckentor' },
      { name: '海德堡桥猴', distance: '老桥门旁', desc: '老桥入口的著名青铜雕塑与拍照地标。', slug: 'brueckenaffe' },
      { name: '耶稣会教堂', distance: '老城区', desc: '大学广场附近明亮而庄严的巴洛克教堂。', slug: 'jesuitenkirche' },
      { name: '学生禁闭室', distance: '大学街区', desc: '保留历史学生涂鸦的大学禁闭室。', slug: 'studentenkarzer' },
    ],
  }[locale as 'de' | 'en' | 'zh'] || [];
  const cards = [
    ...items.map((item, index) => ({ ...item, slug: guideSlugs[index] })),
    ...additional,
  ];

  return (
    <section id="top-sights" className="section-padding" style={{ background: 'var(--bg-tertiary)' }}>
      <div className="max-w-6xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="text-base sm:text-lg mb-6 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('subtitle')}
        </p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {cards.map((item, index) => (
            <a
              key={item.name}
              href={`/${locale}/attractions/${item.slug}`}
              className="rounded-xl p-6"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <span
                  className="text-3xl font-display font-bold"
                  style={{ color: 'var(--accent)', opacity: 0.9 }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className="text-xs font-medium rounded-full px-3 py-1 flex-shrink-0"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  {item.distance}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                {item.name}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.desc}
              </p>
            </a>
          ))}
        </div>

        <div className="text-center">
          <a
            href={sightsHref(locale)}
            className="inline-flex flex-col items-center gap-1.5 rounded-full px-8 py-3 text-white font-medium transition-all hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            <span>{t('cta')}</span>
            <span className="text-xs font-normal opacity-80">{t('ctaHint')}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
