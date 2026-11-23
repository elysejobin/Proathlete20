import React, { useState } from 'react';
import { Dumbbell, ShieldCheck, Flame, BatteryCharging, TrendingUp, Smartphone, ChevronRight } from 'lucide-react';
import data from '../data/programs.json';

type Lang = 'en' | 'fr';

interface ProgramsProps {
  lang: Lang;
  storeUrl: string;
  onContactClick: () => void;
  onPricingClick: () => void;
  // 'teaser' (homepage): cards + link to the Programs page; 'full' (/programs/): cards + typical week by plan
  variant?: 'teaser' | 'full';
  onSeeAll?: () => void;
  onBackToHome?: () => void;
}

const ICONS: Record<string, React.ElementType> = {
  strength: Dumbbell,
  prevention: ShieldCheck,
  warmup: Flame,
  recovery: BatteryCharging,
  tracking: TrendingUp,
};

// "What you get in the app": program cards, then a typical week for each plan (athlete, coach, organization) with an app screenshot.
const Programs: React.FC<ProgramsProps> = ({ lang, storeUrl, onContactClick, onPricingClick, variant = 'full', onSeeAll, onBackToHome }) => {
  const [tab, setTab] = useState(0);
  const week = data.week.tabs[tab];
  const isFull = variant === 'full';
  const Heading = isFull ? 'h1' : 'h2';

  return (
    <section id="programs" className={`scroll-mt-16 px-4 ${isFull ? 'pt-24 pb-12 md:pb-20 lg:pb-28' : 'py-12 md:py-20 lg:py-28'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb (Programs page) */}
        {isFull && (
          <div className="md:px-4 mb-8 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-[#5CE1E6] uppercase">
            <a href={lang === 'fr' ? '/?lang=fr' : '/'} onClick={(e) => { if (onBackToHome) { e.preventDefault(); onBackToHome(); } }} className="hover:text-white transition-colors">
              {lang === 'fr' ? 'Accueil' : 'Home'}
            </a>
            <span className="text-white/20">/</span>
            <span className="text-white/80">{lang === 'fr' ? 'Programmes' : 'Programs'}</span>
          </div>
        )}
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#005776]/20 border border-[#5CE1E6]/30 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#5CE1E6] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5CE1E6]" />
            {data.tag[lang]}
          </div>
          <Heading className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black italic mb-4 md:mb-6 uppercase tracking-tight text-balance">
            {data.title[lang]}
          </Heading>
          <p className="text-white/85 text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-balance">{data.subtitle[lang]}</p>
        </div>

        {/* Program cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 ${isFull ? 'mb-16 md:mb-24' : 'mb-10'}`}>
          {data.programs.map(p => {
            const Icon = ICONS[p.icon];
            return (
              <div key={p.icon} className="flex flex-col bg-[#005776]/10 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-7 hover:bg-[#005776]/20 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-[#005776]/30 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#5CE1E6]" />
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-black italic uppercase tracking-wide text-white mb-2">{p.name[lang]}</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-5">{p.goal[lang]}</p>
                <dl className="mt-auto divide-y divide-white/10 border-t border-white/10">
                  {p.facts.map(f => (
                    <div key={f.label.en} className="flex justify-between gap-3 py-2.5 text-xs sm:text-sm">
                      <dt className="text-white/60 uppercase tracking-wider text-[10px] sm:text-[11px] font-bold pt-0.5">{f.label[lang]}</dt>
                      <dd className="text-white font-semibold text-right">{f.value[lang]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>

        {!isFull && onSeeAll && (
          <div className="flex justify-center">
            <button type="button" onClick={onSeeAll} className="inline-flex items-center gap-2 bg-[#005776] hover:bg-[#006b91] text-white px-6 py-3.5 rounded-full font-bold uppercase tracking-[0.15em] text-xs transition-colors">
              {data.seeAll[lang]} <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Typical week by plan (Programs page) */}
        {isFull && (
        <div className="bg-[#001f30] border border-white/10 rounded-3xl p-5 sm:p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
            <div>
              <h3 className="text-2xl md:text-4xl font-heading font-black italic uppercase tracking-tight text-white">{data.week.title[lang]}</h3>
              <p className="text-white/75 text-sm md:text-base mt-1">{data.week.subtitle[lang]}</p>
            </div>
            <div role="tablist" className="flex gap-1 bg-white/5 border border-white/10 rounded-full p-1 self-start md:self-auto">
              {data.week.tabs.map((t, i) => (
                <button
                  key={t.label.en}
                  type="button"
                  role="tab"
                  aria-selected={i === tab}
                  onClick={() => setTab(i)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-colors ${i === tab ? 'bg-[#005776] text-white' : 'text-white/70 hover:text-white'}`}
                >
                  {t.label[lang]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <ol className="space-y-3">
                {week.items.map(item => {
                  const Icon = ICONS[item.icon];
                  return (
                    <li key={item.title.en} className="flex items-start gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5">
                      <div className="w-10 h-10 rounded-xl bg-[#005776]/30 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-[#5CE1E6]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-white font-bold text-sm sm:text-base">{item.title[lang]}</span>
                          {'tag' in item && item.tag && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5CE1E6] border border-[#5CE1E6]/40 rounded-full px-2 py-0.5">{item.tag[lang]}</span>
                          )}
                        </div>
                        <p className="text-white/75 text-sm mt-1">{item.detail[lang]}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <div className="flex flex-wrap items-center gap-4 mt-6">
                {week.cta.type === 'store' ? (
                  <a href={storeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#005776] hover:bg-[#006b91] text-white px-6 py-3 rounded-full font-bold uppercase tracking-[0.15em] text-xs transition-colors">
                    {week.cta.label[lang]} <ChevronRight size={16} />
                  </a>
                ) : (
                  <button type="button" onClick={week.cta.type === 'pricing' ? onPricingClick : onContactClick} className="inline-flex items-center gap-2 bg-[#005776] hover:bg-[#006b91] text-white px-6 py-3 rounded-full font-bold uppercase tracking-[0.15em] text-xs transition-colors">
                    {week.cta.label[lang]} <ChevronRight size={16} />
                  </button>
                )}
                <p className="text-white/55 text-xs italic">{data.week.note[lang]}</p>
              </div>
            </div>

            {/* iPhone mockup with an app screenshot or short screen recording for this plan (media.image / media.video in data/programs.json) */}
            <div className="lg:col-span-5 flex justify-center">
              {/* Clicking the phone opens the app's store page */}
              <a href={storeUrl} target="_blank" rel="noopener noreferrer" aria-label={lang === 'fr' ? "Télécharger l'app PRO ATHLETE" : 'Download the PRO ATHLETE app'} className="block relative w-[230px] sm:w-[260px] transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]">
                <span aria-hidden className="absolute -left-[3px] top-[17%] w-[3px] h-[5%] rounded-l bg-[#2a2d31]" />
                <span aria-hidden className="absolute -left-[3px] top-[25%] w-[3px] h-[9%] rounded-l bg-[#2a2d31]" />
                <span aria-hidden className="absolute -left-[3px] top-[36%] w-[3px] h-[9%] rounded-l bg-[#2a2d31]" />
                <span aria-hidden className="absolute -right-[3px] top-[28%] w-[3px] h-[13%] rounded-r bg-[#2a2d31]" />
                <div className="rounded-[2.9rem] bg-[#0b0c0e] p-[9px] ring-1 ring-white/25 shadow-2xl shadow-black/60">
                  <div className="relative rounded-[2.3rem] overflow-hidden aspect-[1170/2532] bg-[#002337]">
                    <span aria-hidden className="absolute top-[1.4%] left-1/2 -translate-x-1/2 w-[31%] h-[3.3%] rounded-full bg-black z-10" />
                    {week.media.video ? (
                      <video key={week.media.video} src={week.media.video} poster={week.media.image || undefined} autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover" />
                    ) : week.media.image ? (
                      <img src={week.media.image} alt={week.label[lang]} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center px-6">
                        <Smartphone className="w-8 h-8 text-white/30" />
                        <span className="text-white/45 text-xs font-semibold uppercase tracking-widest">{data.week.screenshotPlaceholder[lang]}</span>
                      </div>
                    )}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
};

export default Programs;
