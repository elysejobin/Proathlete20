import React, { useState } from 'react';
import { Dumbbell, ShieldCheck, Flame, BatteryCharging, TrendingUp, Smartphone, ChevronRight } from 'lucide-react';
import data from '../data/programs.json';

type Lang = 'en' | 'fr';

interface ProgramsProps {
  lang: Lang;
  storeUrl: string;
  onContactClick: () => void;
  onPricingClick: () => void;
}

const ICONS: Record<string, React.ElementType> = {
  strength: Dumbbell,
  prevention: ShieldCheck,
  warmup: Flame,
  recovery: BatteryCharging,
  tracking: TrendingUp,
};

// "What you get in the app": program cards, then a typical week for each plan (athlete, coach, organization) with an app screenshot.
const Programs: React.FC<ProgramsProps> = ({ lang, storeUrl, onContactClick, onPricingClick }) => {
  const [tab, setTab] = useState(0);
  const week = data.week.tabs[tab];

  return (
    <section id="programs" className="scroll-mt-16 py-12 md:py-20 lg:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#005776]/20 border border-[#5CE1E6]/30 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#5CE1E6] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5CE1E6]" />
            {data.tag[lang]}
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black italic mb-4 md:mb-6 uppercase tracking-tight text-balance">
            {data.title[lang]}
          </h2>
          <p className="text-white/85 text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-balance">{data.subtitle[lang]}</p>
        </div>

        {/* Program cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-16 md:mb-24">
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

        {/* Typical week by plan */}
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

            {/* App screenshot or short screen recording for this plan (set media.image or media.video in data/programs.json) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-[220px] sm:w-[250px] aspect-[9/19] rounded-[2.2rem] border-[6px] border-white/15 bg-[#002337] overflow-hidden shadow-2xl">
                {week.media.video ? (
                  <video key={week.media.video} src={week.media.video} poster={week.media.image || undefined} autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover" />
                ) : week.media.image ? (
                  <img src={week.media.image} alt={week.label[lang]} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center px-6 border-2 border-dashed border-white/10 rounded-[1.7rem]">
                    <Smartphone className="w-8 h-8 text-white/30" />
                    <span className="text-white/45 text-xs font-semibold uppercase tracking-widest">{data.week.screenshotPlaceholder[lang]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;
