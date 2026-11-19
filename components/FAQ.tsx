import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import faq from '../data/faq.json';

type Lang = 'en' | 'fr';

interface FAQProps {
  lang: Lang;
  storeUrl: string;
  onContactClick: () => void;
}

const SITE = 'https://www.proathlete.ca';

// Turns "[text](url)" links in an answer into real links.
// Homepage links open the app store, "#contact" links open the Talk to us form.
const renderAnswer = (text: string, storeUrl: string, onContactClick: () => void) => {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const [, label, url] = m;
    const cls = 'text-[#5CE1E6] font-semibold underline underline-offset-2 hover:text-white transition-colors';
    const path = url.startsWith(SITE) ? url.slice(SITE.length) || '/' : url;
    if (path.endsWith('#contact')) {
      parts.push(
        <button key={i++} type="button" onClick={onContactClick} className={cls}>{label}</button>
      );
    } else if (path === '/' || path === '/?lang=fr') {
      parts.push(
        <a key={i++} href={storeUrl} target="_blank" rel="noopener noreferrer" className={cls}>{label}</a>
      );
    } else if (/^https?:/.test(path)) {
      parts.push(
        <a key={i++} href={path} target="_blank" rel="noopener noreferrer" className={cls}>{label}</a>
      );
    } else {
      parts.push(<a key={i++} href={path.replace(/^\/(\?lang=fr)?#/, '#')} className={cls}>{label}</a>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
};

const FAQ: React.FC<FAQProps> = ({ lang, storeUrl, onContactClick }) => {
  const [persona, setPersona] = useState(faq.personas[0].id);
  const [open, setOpen] = useState<number | null>(0);
  const current = faq.personas.find(p => p.id === persona) || faq.personas[0];

  const choose = (id: string) => {
    setPersona(id);
    setOpen(0);
  };

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    setOpen(next);
    if (next !== null && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'faq_open', { persona, question: current.items[i].q.en });
    }
  };

  return (
    <section id="faq" className="py-12 md:py-20 lg:py-32 px-4 bg-[#002337] border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl md:text-6xl font-heading font-black italic mb-4 md:mb-6 uppercase tracking-tight">
          {faq.title[lang]}
        </h2>
        <p className="text-center text-white/80 text-sm sm:text-base md:text-lg mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
          {faq.subtitle[lang]}
        </p>

        <div role="tablist" aria-label={faq.title[lang]} className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 md:mb-10">
          {faq.personas.map(p => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={p.id === persona}
              onClick={() => choose(p.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-widest border transition-all ${
                p.id === persona
                  ? 'bg-[#005776] border-[#005776] text-white'
                  : 'bg-transparent border-white/15 text-white/80 hover:border-[#005776] hover:text-white'
              }`}
            >
              {p.label[lang]}
            </button>
          ))}
        </div>

        <div className="space-y-3 md:space-y-4">
          {current.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={persona + i}
                className={`rounded-2xl border transition-colors ${isOpen ? 'border-[#005776] bg-[#001f30]' : 'border-white/10 bg-[#001f30]/60 hover:border-white/20'}`}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4 sm:py-5"
                  >
                    <span className="font-semibold text-white text-[15px] sm:text-base md:text-[17px] leading-snug" style={{ fontFamily: "'Inter', sans-serif" }}>{item.q[lang]}</span>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-[#5CE1E6] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-white/85 text-sm sm:text-base leading-relaxed">
                        {renderAnswer(item.a[lang], storeUrl, onContactClick)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
