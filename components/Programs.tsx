import React, { useState } from 'react';
import { Dumbbell, ShieldCheck, Flame, BatteryCharging, Clock } from 'lucide-react';
import data from '../data/programs.json';

type Lang = 'en' | 'fr';

interface ProgramsProps {
  lang: Lang;
}

const ICONS: Record<string, React.ElementType> = {
  strength: Dumbbell,
  prevention: ShieldCheck,
  warmup: Flame,
  recovery: BatteryCharging,
};

// "What you get in the app": program cards and an example training week.
const Programs: React.FC<ProgramsProps> = ({ lang }) => {
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

        {/* Example week */}
        <div className="max-w-4xl mx-auto">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
              <h3 className="text-2xl md:text-4xl font-heading font-black italic uppercase tracking-tight text-white">{data.week.title[lang]}</h3>
              <div role="tablist" className="flex gap-1 bg-white/5 border border-white/10 rounded-full p-1">
                {data.week.tabs.map((t, i) => (
                  <button
                    key={t.label.en}
                    type="button"
                    role="tab"
                    aria-selected={i === tab}
                    onClick={() => setTab(i)}
                    className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-colors ${i === tab ? 'bg-[#005776] text-white' : 'text-white/70 hover:text-white'}`}
                  >
                    {t.label[lang]}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {week.days.map(d => (
                <div key={d.day.en} className="bg-[#001f30] border border-white/10 rounded-2xl p-4 sm:p-5">
                  <div className="text-[#5CE1E6] text-[11px] font-bold uppercase tracking-[0.2em] mb-3">{d.day[lang]}</div>
                  <div className="space-y-2">
                    {d.blocks.map(b => {
                      const Icon = ICONS[b.icon];
                      return (
                        <div key={b.name.en} className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-3 py-2.5">
                          <Icon className="w-4 h-4 text-[#5CE1E6] shrink-0" />
                          <span className="text-white text-sm font-semibold flex-1">{b.name[lang]}</span>
                          <span className="flex items-center gap-1 text-white/70 text-xs font-semibold"><Clock className="w-3.5 h-3.5" />{b.min} min</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-white/60 text-xs mt-3 italic">{data.week.note[lang]}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;
