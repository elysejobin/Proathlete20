
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Apple, PlayCircle, CheckCircle2, Scan, Activity, 
  ShieldCheck, BrainCircuit, HeartPulse, ChevronRight, 
  Menu, X, Star, Globe, Mail, Send,
  Accessibility, Footprints, Smile, Dumbbell, History,
  ArrowLeft, School, User, Heart, Zap, Timer, Star as StarIcon, Quote,
  Facebook, Instagram, MessageSquare, Trophy
} from 'lucide-react';
import { UserRole, Sport } from './types';
import { translations } from './translations';
import AppointmentModal from './components/AppointmentModal';
import { PricingPage } from './components/PricingPage';
import PrivacyPolicy from './components/PrivacyPolicy';

// Pantone Color Codes
const COLORS = {
  NAVY: '#002337', // Pantone 539 C
  TEAL: '#005776', // Pantone 634 C
  GRAY: '#69686C', // Cool Gray 10 C (Used for borders only now)
  WHITE: '#FFFFFF' // Blanc
};

// Logo component now uses the actual client logo
const ProAthleteLogo = ({ className = "w-12 h-12", animate = false }: { className?: string; animate?: boolean }) => (
  <motion.img 
    src="https://assets.bigvu.tv/image/69651f9b96b4ad5756466e3c/asset.png"
    alt="Pro Athlete Logo"
    className={className}
    animate={animate ? { rotate: 360 } : {}}
    transition={animate ? { duration: 40, repeat: Infinity, ease: "linear" } : {}}
  />
);

const PARTNERS = [
  { name: 'Partner 1', logo: 'https://assets.bigvu.tv/image/697260fe42169014d6ad6734/asset.png' },
  { name: 'Partner 2', logo: 'https://assets.bigvu.tv/image/697261104739a3d7de25ce86/asset.png' }
];

const SOCCER_PARTNERS = [
  { name: 'Soccer Partner 1', logo: 'https://assets.bigvu.tv/image/697cf9ce50728d0721b813da/asset.png-rotated.jpg' },
  { name: 'Soccer Partner 2', logo: 'https://assets.bigvu.tv/image/697b99d650728d07219f3857/asset.png' }
];

const ALL_PARTNERS = [
  ...PARTNERS,
  ...SOCCER_PARTNERS
];

const WhistleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 5c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v2H9V5Z" />
    <path d="M15 7h5a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5" />
    <path d="M6 15h9a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H6a4 4 0 0 0-4 4v0a4 4 0 0 0 6 4Z" />
    <circle cx="9" cy="11" r="1" />
  </svg>
);

const RunningIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 12h-3l-2-2.5L14 7l-2-3-3 4-2-1" />
    <path d="M8 15l-1 4" />
    <path d="M11 15l2 4" />
    <path d="M11 12l2-1" />
    <circle cx="15" cy="4" r="1" />
  </svg>
);

const SweatSmileIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
    <path d="M8 13c1 1.5 2 2 4 2s3-0.5 4-2" />
    <path d="M9 9h.01M15 9h.01" />
    <path d="M17 5.5c-.3.5-1 1-1.5 1s-1-.5-1-1 1-1 1.5-1 1 .5 1 1z" />
  </svg>
);

const LogoMarquee = ({ partners }: { partners: { name: string; logo: string }[] }) => {
  // Create a large enough set to fill wide screens.
  // 12 repeats ensures enough length for most screens before the wrap happens.
  const repeated = Array(12).fill(partners).flat();

  return (
    <div className="w-full overflow-hidden"
         style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-12 md:gap-32 items-center">
        {/* We double the content to allow the -50% translate to work seamlessly */}
        {[...repeated, ...repeated].map((partner, i) => (
          <img 
            key={i}
            src={partner.logo} 
            alt={partner.name} 
            className="h-12 md:h-20 w-auto object-contain transition-all duration-300 cursor-pointer hover:scale-105"
          />
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // Language can be set from the URL (?lang=fr), e.g. when coming from the French Resources page
  const [lang, setLang] = useState<'en' | 'fr'>(() =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('lang') === 'fr' ? 'fr' : 'en'
  );
  const [activeRole, setActiveRole] = useState<UserRole>('ATHLETES');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'pricing'>('home');
  
  const t = translations[lang];

  // Open the right section when arriving from another page (e.g. /#pricing from Resources)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    if (hash === 'pricing') { setCurrentPage('pricing'); window.scrollTo(0, 0); return; }
    if (hash === 'features') {
      setCurrentPage('pricing');
      setTimeout(() => document.getElementById('compare-features')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      return;
    }
    if (hash === 'contact') { setIsAppointmentOpen(true); return; }
    setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 300);
  }, []);

  const RESOURCES_URL = lang === 'fr' ? '/fr/ressources/' : '/resources/';
  // Opens the contact form and reports it to Google Analytics
  const openContact = (source: string) => {
    (window as any).gtag?.('event', 'open_contact_form', { source });
    setIsAppointmentOpen(true);
  };
  // Mobile menu: go to a section and close the menu
  const goToSection = (item: string) => {
    setIsMobileMenuOpen(false);
    if (item === 'Pricing') { setCurrentPage('pricing'); window.scrollTo(0, 0); return; }
    if (item === 'Features') {
      setCurrentPage('pricing');
      setTimeout(() => document.getElementById('compare-features')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      return;
    }
    setCurrentPage('home');
    setTimeout(() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const APPLE_STORE_URL = "https://apps.apple.com/ca/app/pro-athlete-training-app/id6768344217";
  const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=ca.proathlete.proathlete&hl=en_CA";

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  const currentRoleData = (t.roles as any)[activeRole];
  const roleDescription = currentRoleData.desc;

  return (
    <div className="bg-[#002337] text-white min-h-screen selection:bg-[#005776] selection:text-white">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}</style>
      
      <nav className="fixed top-0 w-full z-50 bg-[#002337]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-16 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            title="PRO ATHLETE"
          >
            <ProAthleteLogo className="w-10 h-10" />
            <span className="font-heading text-xl md:text-2xl font-black italic uppercase">PRO <span className="text-white">ATHLETE</span></span>
          </button>
        </div>
        
        <div className="hidden lg:flex gap-8 items-center">
          <div className="flex gap-6 xl:gap-8 text-[10px] font-bold uppercase tracking-[0.2em] items-center">
            {['Mission', 'Founder', 'Features', 'Pricing', 'Community'].map(item => {
              const isPricing = item === 'Pricing';
              const isFeatures = item === 'Features';
              const isPricingActive = isPricing && currentPage === 'pricing';
              const label = (t.nav as any)[item.toLowerCase()] || item;

              if (isFeatures) {
                return (
                  <button
                    key={item}
                    onClick={() => {
                      setCurrentPage('pricing');
                      setTimeout(() => {
                        const element = document.getElementById('compare-features');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                    className="hover:text-[#5CE1E6] text-white/80 transition-colors"
                  >
                    {label}
                  </button>
                );
              }

              if (isPricing) {
                return (
                  <button
                    key={item}
                    onClick={() => {
                      setCurrentPage('pricing');
                      window.scrollTo(0, 0);
                    }}
                    className={`transition-all duration-300 px-3 py-1.5 rounded-full ${
                      isPricingActive 
                        ? 'bg-[#5CE1E6] text-[#002337] font-black shadow-lg shadow-[#5CE1E6]/20' 
                        : 'hover:text-[#5CE1E6] text-white/80'
                    }`}
                  >
                    {label}
                  </button>
                );
              }

              return (
                <button
                  key={item}
                  onClick={() => {
                    setCurrentPage('home');
                    setTimeout(() => {
                      const element = document.getElementById(item.toLowerCase());
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 50);
                  }}
                  className="hover:text-[#5CE1E6] text-white/80 transition-colors"
                >
                  {label}
                </button>
              );
            })}
            <a href={RESOURCES_URL} className="normal-case hover:text-[#5CE1E6] text-white/80 transition-colors">
              {t.nav.resources}
            </a>
          </div>
          <div className="h-4 w-px bg-white/20 mx-2" />
          <button 
            onClick={() => setLang(prev => prev === 'en' ? 'fr' : 'en')}
            className="flex items-center gap-1.5 text-[10px] font-black hover:text-[#005776] transition-colors tracking-widest border border-white/20 px-3 py-1.5 rounded-full"
          >
            <Globe size={12} /> {lang.toUpperCase()}
          </button>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-4 border-r border-white/20 pr-6">
            <a href="https://www.facebook.com/proathletebasketball/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#005776] transition-colors" title="Facebook" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="https://www.instagram.com/proathlete.app/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#005776] transition-colors" title="Instagram" aria-label="Instagram">
              <Instagram size={20} />
            </a>
          </div>

          <button 
            onClick={() => openContact('header')}
            className="flex items-center gap-2 bg-[#005776] text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full font-bold text-xs md:text-sm hover:bg-white hover:text-[#002337] transition-all"
          >
            <MessageSquare size={16} className="hidden sm:block" /> 
            <span className="hidden sm:inline">{t.nav.talkToUs}</span>
            <span className="sm:hidden">Contact</span>
          </button>

          <button 
            onClick={() => setLang(prev => prev === 'en' ? 'fr' : 'en')}
            className="lg:hidden flex items-center gap-1.5 text-[10px] font-black hover:text-[#005776] transition-colors tracking-widest border border-white/20 px-2.5 py-1.5 rounded-full"
          >
            <Globe size={12} /> {lang.toUpperCase()}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full border border-white/20 hover:border-white transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#002337] border-b border-white/10 shadow-2xl">
            <div className="flex flex-col px-6 py-2">
              {['Mission', 'Founder', 'Features', 'Pricing', 'Community'].map(item => (
                <button
                  key={item}
                  onClick={() => goToSection(item)}
                  className="text-left py-4 border-b border-white/10 text-xs font-bold uppercase tracking-[0.2em] text-white/80 hover:text-[#5CE1E6] transition-colors"
                >
                  {(t.nav as any)[item.toLowerCase()] || item}
                </button>
              ))}
              <a href={RESOURCES_URL} className="py-4 border-b border-white/10 text-xs font-bold uppercase tracking-[0.2em] text-white/80 hover:text-[#5CE1E6] transition-colors">
                {t.nav.resources}
              </a>
              <div className="flex items-center gap-6 py-4">
                <a href="https://www.facebook.com/proathletebasketball/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#5CE1E6] transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="https://www.instagram.com/proathlete.app/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#5CE1E6] transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {currentPage === 'pricing' ? (
        <PricingPage 
          lang={lang} 
          activeSport="ALL" 
          onContactClick={() => openContact('pricing')} 
          onBackToHome={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <>
          {/* HERO SECTION WITH VIDEO BACKGROUND & MOBILE APP MOCKUP */}
      <section className="relative min-h-screen flex items-center overflow-hidden py-24 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <video 
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src="https://assets.bigvu.tv/video/69651fc2b4517a3552cd569f/2c36455f-2105-4f80-a137-3108e40260a6/asset_1080.mp4" type="video/mp4" />
          </video>
          {/* Dark teal overlay for optimal contrast and readability */}
          <div className="absolute inset-0 bg-[#002337]/75" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto w-full pt-12 sm:pt-16 lg:pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-stretch">
            {/* Left Column: Heading, Description & Download CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 flex flex-col justify-between items-start text-left"
            >
              <div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] xl:text-[6.5rem] font-heading font-black italic leading-[0.88] uppercase tracking-tight text-white mb-4">
                  {lang === 'fr' ? (
                    <>
                      PERFORME.<br/>
                      PRÉVIENS.<br/>
                      JOUE PLUS<br/>
                      LONGTEMPS.
                    </>
                  ) : (
                    <>
                      PERFORM.<br/>
                      PREVENT.<br/>
                      PLAY<br/>
                      LONGER.
                    </>
                  )}
                </h1>

                {/* Bold Red Accent Bar matching screenshot */}
                <div 
                  className={`h-2 sm:h-2.5 bg-[#DC2626] mb-6 sm:mb-8 ${
                    lang === 'fr' ? 'w-56 sm:w-72 md:w-88' : 'w-48 sm:w-60 md:w-72'
                  }`} 
                />

                <p className="text-base sm:text-lg md:text-xl text-white/90 font-light leading-relaxed max-w-xl mb-8">
                  {t.hero.desc}
                </p>
              </div>

              {/* App Store & Google Play CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mt-auto">
                <a 
                  href={APPLE_STORE_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#005776] hover:bg-[#006b91] text-white px-6 sm:px-7 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#005776]/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Apple size={26} className="shrink-0" /> 
                  <div className="text-left">
                    <div className="text-[9px] sm:text-[10px] text-white/90 uppercase tracking-wider font-semibold">{t.hero.appStore}</div>
                    <div className="text-base sm:text-lg font-bold leading-tight">App Store</div>
                  </div>
                </a>
                <a 
                  href={GOOGLE_PLAY_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-transparent hover:bg-white/10 border border-white/25 hover:border-white text-white px-6 sm:px-7 py-3 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlayCircle size={26} className="text-[#5CE1E6] shrink-0" />
                  <div className="text-left">
                    <div className="text-[9px] sm:text-[10px] text-white/80 uppercase tracking-wider font-semibold">{t.hero.googlePlay}</div>
                    <div className="text-base sm:text-lg font-bold leading-tight text-white">Google Play</div>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Right Column: Embedded Mobile App Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-5 flex flex-col items-center justify-center lg:items-end lg:justify-stretch mt-8 lg:mt-0 h-full"
            >
              <div className="relative w-full max-w-[275px] sm:max-w-[323px] md:max-w-[361px] lg:max-w-none lg:w-auto lg:h-full flex items-center lg:items-stretch justify-center lg:justify-end">
                <div className="relative overflow-hidden rounded-[36px] sm:rounded-[42px] md:rounded-[46px] lg:rounded-[48px] h-auto lg:h-full aspect-[352/762] max-h-[520px] sm:max-h-[580px] lg:max-h-full flex items-center justify-center">
                  <video
                    className="w-full h-full object-contain select-none pointer-events-none"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  >
                    <source src="/phone-preview.mp4" type="video/mp4" />
                    <source src="https://assets.bigvu.tv/video/6a959f1e9404970da2a8ed3d/4ea1c1c0-c5c5-4e40-9e87-fe0246598f8b/temp_bgNaQsIo_480.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-[#002337] py-10 md:py-20 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
           <h3 className="text-center font-medium text-white/90 text-sm md:text-base tracking-wide mb-8 md:mb-10 uppercase">
             {t.partners.trustedTitle}
           </h3>
           <LogoMarquee partners={ALL_PARTNERS} />
        </div>
      </section>

      {/* Role Switcher Section */}
      <section id="mission" className="py-12 md:py-20 lg:py-32 px-4 md:px-6 bg-[#002337]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl sm:text-4xl md:text-6xl font-heading font-black italic mb-8 md:mb-12 uppercase tracking-tight">{t.entrance.title}</h2>
          
          <div className="flex justify-center mb-12 md:mb-16 lg:mb-24 overflow-x-auto hide-scrollbar pb-2">
            <div className="bg-[#005776]/10 p-1.5 rounded-full border border-white/20 flex gap-1 whitespace-nowrap">
              {(['COACHES', 'ATHLETES', 'ATHLETIC_DIRECTORS', 'PARENTS'] as UserRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`px-4 sm:px-6 md:px-8 py-2 md:py-3 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeRole === role ? 'bg-[#005776] text-white' : 'text-white hover:text-white'
                  }`}
                >
                  {role === 'COACHES' ? t.entrance.coaches : 
                   role === 'PARENTS' ? t.entrance.parents : 
                   role === 'ATHLETES' ? t.entrance.athletes : t.entrance.athleticDirectors}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole + lang}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="font-mono text-[10px] text-white bg-[#005776]/10 border border-white/10 p-4 rounded-xl mb-6 md:mb-10 max-w-md">
                  {currentRoleData.badge}
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heading font-black italic mb-6 md:mb-8 leading-tight tracking-tight">
                  {currentRoleData.title}
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed mb-6 md:mb-8">
                  {roleDescription}
                </p>
                <button className="flex items-center gap-2 text-[#005776] font-bold uppercase tracking-[0.2em] text-xs group hover:text-white transition-colors">
                  LEARN MORE <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </AnimatePresence>

            <div className="space-y-3 md:space-y-4">
              {currentRoleData.features.map((feature: any, i: number) => (
                <motion.div
                  key={activeRole + i + lang}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#005776]/10 border border-white/10 p-5 sm:p-6 md:p-8 rounded-2xl flex items-start gap-4 md:gap-5 group hover:border-[#005776] transition-colors"
                >
                  <div className="p-2 md:p-3 rounded-full bg-[#005776]/20 group-hover:bg-[#005776] transition-colors shrink-0">
                    <CheckCircle2 className="text-white w-4 h-4 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg md:text-xl font-bold mb-1">{feature.title}</h4>
                    <p className="text-white text-xs sm:text-sm group-hover:text-white transition-colors">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section id="founder" className="py-12 md:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#002337] to-[#001f30]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Story & Stats */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 bg-[#005776]/20 border border-[#5CE1E6]/30 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#5CE1E6] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5CE1E6]" />
                {t.founder.tag}
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black italic leading-[1.08] mb-6 md:mb-8 uppercase text-white tracking-tight">
                {t.founder.quote.includes('-') ? (
                  <>
                    {t.founder.quote.split('-')[0].trim()}<br/>
                    <span>{t.founder.quote.split('-')[1].trim()}</span>
                  </>
                ) : (
                  t.founder.quote
                )}
              </h2>

              <div className="space-y-6 text-sm sm:text-base text-white/85 font-light leading-relaxed max-w-xl">
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-heading font-black italic uppercase tracking-wider text-white">
                    <span className="text-[#5CE1E6]">{t.founder.founder1.name}</span> — {t.founder.founder1.role}
                  </h3>
                  <p className="text-white/80 leading-relaxed font-light text-sm sm:text-base">
                    {t.founder.founder1.bio}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="text-base sm:text-lg font-heading font-black italic uppercase tracking-wider text-white">
                    <span className="text-[#5CE1E6]">{t.founder.founder2.name}</span> — {t.founder.founder2.role}
                  </h3>
                  <p className="text-white/80 leading-relaxed font-light text-sm sm:text-base">
                    {t.founder.founder2.bio}
                  </p>
                </div>
              </div>

              <div className="flex justify-start gap-10 sm:gap-14 mt-8 sm:mt-10 pt-8 border-t border-white/10 w-full max-w-xl">
                <div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black italic text-white mb-1.5 font-heading">40-67%</div>
                  <div className="text-[10px] sm:text-xs tracking-widest text-white/70 uppercase max-w-[180px] leading-tight font-semibold">{t.founder.stat1}</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black italic text-white mb-1.5 font-heading">3000+</div>
                  <div className="text-[10px] sm:text-xs tracking-widest text-white/70 uppercase max-w-[180px] leading-tight font-semibold">{t.founder.stat2}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Video Embed & Photo Underneath */}
            <div className="lg:col-span-5 w-full flex flex-col gap-5 sm:gap-6 items-center justify-center">
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-[#001726]">
                <iframe
                  key={lang}
                  src={
                    lang === 'fr'
                      ? "https://desk.bigvu.tv/embed/6a46c5dece88297190dfe38a/6a46c5dece88297190dfe392"
                      : "https://desk.bigvu.tv/embed/6a46c7f0ce88297190e01216/6a46c7f1ce88297190e01225"
                  }
                  title={lang === 'fr' ? "PRO ATHLETE - Rencontrez les fondatrices" : "PRO ATHLETE - Meet the Founders"}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Photo Under Video */}
              <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-[#001726]">
                <img
                  src="https://assets.bigvu.tv/image/6aa8269fbe3f4bc30a49a1ed/asset.jpeg"
                  alt="Elyse Jobin & Léa Couture Fernandez"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Science Grid */}
      <section id="features" className="py-12 md:py-20 lg:py-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-heading font-black italic mb-4 md:mb-6 uppercase tracking-tight">{t.science.title}</h2>
          <p className="text-white text-sm sm:text-base md:text-lg mb-12 md:mb-16 lg:mb-24 max-w-2xl mx-auto">{t.science.subtitle}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: ShieldCheck, ...t.science.prevention },
              { icon: Zap, ...t.science.performance },
              { icon: Dumbbell, ...t.science.sportSpecific }
            ].map((feature, i) => (
              <div key={i} className="bg-[#005776]/10 border border-white/10 p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl text-left flex flex-col items-start gap-4 md:gap-6 hover:bg-[#005776]/20 transition-all cursor-default group">
                <div className="p-3 md:p-4 rounded-xl bg-[#005776]/20 text-white">
                  <feature.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3 font-heading italic tracking-wide uppercase text-white">{feature.title}</h3>
                  <p className="text-white leading-relaxed text-xs sm:text-sm group-hover:text-white transition-colors">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="community" className="py-12 md:py-20 lg:py-32 px-4 bg-[#001f30] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl sm:text-4xl md:text-6xl font-heading font-black italic mb-12 md:mb-16 uppercase tracking-tight">{t.testimonials.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {t.testimonials.list.map((testimonial: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#002337] border border-white/10 p-6 sm:p-8 rounded-2xl md:rounded-3xl hover:border-[#005776] transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start h-full">
                  {testimonial.image ? (
                    <div className="shrink-0">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author} 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-[#005776]/30"
                      />
                    </div>
                  ) : (
                    <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#005776]/20 flex items-center justify-center border-2 border-[#005776]/30">
                        <User size={32} className="text-[#005776]" />
                    </div>
                  )}
                  
                  <div className="flex-1 flex flex-col h-full justify-between">
                    <div>
                      <Quote className="text-[#005776] w-6 h-6 md:w-8 md:h-8 mb-4" />
                      <p className="text-white text-xs sm:text-sm md:text-base leading-relaxed mb-6 italic">"{testimonial.content}"</p>
                    </div>
                    <div>
                      <div className="font-bold text-white mb-1 text-sm sm:text-base">{testimonial.author}</div>
                      <div className="text-[10px] font-bold text-white uppercase tracking-widest">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-4 bg-[#002337] border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block p-3 md:p-4 bg-[#005776]/20 rounded-full mb-6 md:mb-8"
          >
            <Mail className="text-[#005776]" size={28} />
          </motion.div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black italic mb-4 md:mb-6 uppercase">{t.footer.newsletterTitle}</h3>
          <p className="text-white text-sm sm:text-base md:text-lg mb-8 md:mb-10 max-w-lg mx-auto leading-relaxed">
            {t.footer.newsletterDesc}
          </p>

          <form onSubmit={handleNewsletterSubmit} className="relative max-w-md mx-auto group">
            <input 
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder={t.footer.emailPlaceholder}
              required
              className="w-full bg-[#005776]/10 border border-white/20 rounded-xl md:rounded-2xl px-5 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-sm sm:text-base text-white focus:outline-none focus:border-[#005776] transition-all pr-12 sm:pr-14 md:pr-16 placeholder:text-white"
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 bottom-2 aspect-square bg-[#005776] text-white rounded-lg md:rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
          
          <AnimatePresence>
            {isSubscribed && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 md:mt-6 text-[#005776] font-bold text-xs sm:text-sm tracking-widest uppercase"
              >
                {t.footer.success}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </section>
        </>
      )}

      <footer className="py-12 md:py-20 lg:py-32 px-4 border-t border-white/5 bg-[#001f30]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 lg:gap-20">
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <ProAthleteLogo className="w-10 h-10 md:w-12 md:h-12" />
              <span className="font-heading text-2xl md:text-3xl font-black italic uppercase">PRO <span className="text-white">ATHLETE</span></span>
            </div>
            <p className="text-white max-w-sm text-sm sm:text-base md:text-lg leading-relaxed">
              {t.footer.description}
            </p>
          </div>
          <div>
            <h4 className="font-heading text-base md:text-lg font-black italic mb-6 md:mb-8 uppercase tracking-widest text-white">{t.footer.product}</h4>
            <ul className="space-y-3 md:space-y-4 text-white text-xs sm:text-sm">
              <li>
                <button 
                  onClick={() => {
                    setCurrentPage('pricing');
                    setTimeout(() => {
                      const element = document.getElementById('compare-features');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }} 
                  className="hover:text-white transition-colors text-left"
                >
                  {t.footer.features}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setCurrentPage('pricing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-white transition-colors text-left"
                >
                  {t.footer.pricing}
                </button>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.forTeams}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.apiAccess}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-base md:text-lg font-black italic mb-6 md:mb-8 uppercase tracking-widest text-white">{t.footer.company}</h4>
            <ul className="space-y-3 md:space-y-4 text-white text-xs sm:text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.aboutUs}</a></li>
              <li><a href={RESOURCES_URL} className="hover:text-white transition-colors">{t.footer.blog}</a></li>
              <li>
                <button 
                  onClick={() => openContact('footer')}
                  className="hover:text-white transition-colors text-left"
                >
                  {t.footer.contact}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 md:mt-20 pt-8 md:pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-[9px] sm:text-[10px] font-bold tracking-widest text-white uppercase">
          <div>© 2026 PRO ATHLETE INC. {t.footer.rights}</div>
          <div className="flex gap-4 sm:gap-6 md:gap-8">
            <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-white transition-colors text-left uppercase">{t.footer.privacy}</button>
            <a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a>
            <a href="#" className="hover:text-white transition-colors">{t.footer.cookies}</a>
          </div>
        </div>
      </footer>
      <AppointmentModal 
        isOpen={isAppointmentOpen} 
        onClose={() => setIsAppointmentOpen(false)} 
        lang={lang} 
      />
            {isPrivacyOpen && (
        <PrivacyPolicy 
          onClose={() => setIsPrivacyOpen(false)} 
          lang={lang} 
        />
      )}
    </div>
  );
};

export default App;
