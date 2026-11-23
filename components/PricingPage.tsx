import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Mail, ChevronDown, HelpCircle, ArrowRight, Star, Shield } from 'lucide-react';
import { Sport } from '../types';

interface PricingPageProps {
  lang: 'en' | 'fr';
  activeSport: Sport;
  onContactClick: () => void;
  onBackToHome: () => void;
  // 'pricing' = plans + FAQ (/pricing/), 'features' = detailed feature comparison (/features/)
  section?: 'pricing' | 'features';
  onPricingClick?: () => void;
  onFeaturesClick?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ 
  lang, 
  activeSport, 
  onContactClick,
  onBackToHome,
  section = 'pricing',
  onPricingClick,
  onFeaturesClick
}) => {
  const isFeatures = section === 'features';
  // Text for the Features page and the links between the two pages
  const pageText = lang === 'fr'
    ? {
        crumb: 'FONCTIONNALITÉS',
        badge: 'FONCTIONNALITÉS',
        title: 'Tout ce qui est inclus dans chaque forfait.',
        subtitle: "Comparez ce qu'offre chaque forfait PRO ATHLETE, de la version gratuite aux organisations sportives : échauffements, programmes de force et de prévention, récupération, suivi et accompagnement.",
        toFeatures: 'Comparer toutes les fonctionnalités',
        toPricing: 'Voir les tarifs',
      }
    : {
        crumb: 'FEATURES',
        badge: 'FEATURES',
        title: 'Everything included in each plan.',
        subtitle: 'Compare what each PRO ATHLETE plan offers, from the free version to sports organizations: warm-ups, strength and prevention programs, recovery, tracking and support.',
        toFeatures: 'Compare all features',
        toPricing: 'See pricing',
      };
  const [isYearly, setIsYearly] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Dynamic sport labels
  const sportName = activeSport === 'BASKETBALL' ? 'basketball' : activeSport === 'SOCCER' ? 'soccer' : 'all';
  const sportLabel = activeSport === 'BASKETBALL' 
    ? (lang === 'en' ? 'Basketball' : 'Basketball')
    : activeSport === 'SOCCER'
    ? (lang === 'en' ? 'Soccer' : 'Football')
    : (lang === 'en' ? 'All Sports' : 'Tous les sports');

  // FAQ Toggle Helper
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Multi-lingual content
  const t = {
    en: {
      breadcrumbs: {
        home: "HOME",
        pricing: "PRICING"
      },
      badge: "PRICING PLANS",
      mostPopular: "MOST POPULAR",
      title: "Find the plan that fits your game.",
      subtitle: "Whether you're an athlete, coach, or organization, PRO ATHLETE provides evidence-based training, injury prevention, and performance solutions designed to help athletes stay healthy and perform at their best.",
      toggle: {
        monthly: "Monthly Billing",
        yearly: "Annual Billing",
        save: "Save over 35%"
      },
      pricingNotes: "Price in CAD",
      tiers: [
        {
          id: "free",
          category: "FREE",
          name: "FREE",
          tagline: "Get started with PRO ATHLETE. Discover the foundations of injury prevention, recovery, and athletic performance.",
          perfectFor: "Perfect for: Athletes and coaches of all sports looking to explore the platform and access essential resources.",
          price: "$0",
          priceSub: isYearly ? "/year" : "/month",
          priceUnder: "Get Started Free",
          features: [
            "Neuromuscular warm-up programs",
            "Injury-specific prevention programs",
            "Joint health and mobility programs",
            "Recovery and mobility routines",
            "Educational performance resources"
          ],
          button: "Get Started Free",
          highlight: false
        },
        {
          id: "athlete",
          category: "INDIVIDUAL ATHLETE",
          name: "INDIVIDUAL ATHLETE",
          tagline: "Train smarter. Perform longer. Personalized programs designed to help you improve performance, build strength, and reduce injury risk.",
          perfectFor: `Perfect for: ${activeSport === 'ALL' ? 'Basketball or soccer' : sportLabel} Athletes committed to maximizing their potential and staying available for their sport.`,
          price: isYearly ? "$149.99" : "$19.99",
          priceSub: isYearly ? "/year" : "/month",
          priceUnder: isYearly ? "Save over 35% compared to monthly billing." : "Billed Monthly",
          features: [
            "Personalized sport-specific training programs",
            "Strength and power development programs",
            "Injury prevention and prehab programs",
            "Mobility and recovery plans tailored to your needs",
            "Performance tracking and progress insights",
            "Ongoing program recommendations"
          ],
          button: "Start Training",
          highlight: true
        },
        {
          id: "coach",
          category: "INDIVIDUAL COACH",
          name: "INDIVIDUAL COACH",
          tagline: "Coach with confidence. Access ready-to-use injury prevention and performance resources designed to help you build safer, more resilient athletes throughout the season.",
          perfectFor: `Perfect for: ${activeSport === 'ALL' ? 'Basketball or soccer' : sportLabel} Coaches who want to integrate evidence-based injury prevention and performance strategies into their programs.`,
          price: isYearly ? "$149.99" : "$19.99",
          priceSub: isYearly ? "/year" : "/month",
          priceUnder: isYearly ? "Save over 35% compared to monthly billing." : "Billed Monthly",
          features: [
            "Team warm-up programs with neuromuscular training",
            "Injury prevention programming",
            "Mobility and recovery resources",
            "Bodyweight training programs",
            "Sport-specific prehab programs",
            "Ready-to-implement programming for your team"
          ],
          extraNote: "Weight-room strength programs not included.",
          button: "Get Started",
          highlight: false
        },
        {
          id: "organization",
          category: isYearly ? "SPORTS ORGANIZATION ★ BEST VALUE FOR TEAMS" : "SPORTS ORGANIZATION",
          name: "SPORTS ORGANIZATION",
          tagline: "Build stronger, healthier programs at scale. Provide every athlete and coach in your organization with a complete performance and injury prevention ecosystem.",
          perfectFor: "Perfect for: Schools, clubs, academies, and sports organizations looking to create healthier, more resilient athletes.",
          price: "Custom Pricing",
          priceSub: "",
          priceUnder: "The complete PRO ATHLETE experience.",
          features: [
            "Personalized programs for every athlete",
            "Organization-wide injury prevention system",
            "Sport-specific warm-up programs with neuromuscular training",
            "Strength, prehab, mobility, and recovery programs",
            "Coach and athlete dashboards",
            "Athlete progress tracking and reporting",
            "Multi-team management and oversight",
            "Dedicated onboarding and support"
          ],
          button: "Contact Sales",
          highlight: false
        }
      ],
      compare: {
        title: "COMPARE FEATURES IN DETAIL",
        subtitle: "CHOOSE THE RIGHT PLAN FOR YOUR SPORTING GOALS",
        headers: ["Core Features Included", "Free", "Individual Athlete", "Individual Coach", "Sports Organization"],
        rows: [
          { name: "Neuromuscular Warmups", values: ["Essential", "Personalized", "Team-wide", "Organization-wide"] },
          { name: "Injury Prevention Programs", values: ["Essential", "Personalized", "Team-wide", "Organization-wide"] },
          { name: "Joint Health & Mobility", values: ["Check", "Check", "Check", "Check"] },
          { name: "Sport-specific Training", values: ["-", "Check", "Check", "Check"] },
          { name: "Performance Tracking & Insights", values: ["-", "Check", "-", "Full Analytics"] },
          { name: "Team Management", values: ["-", "-", "-", "Multi-team & oversight"] }
        ]
      },
      faq: {
        badge: "FAQ",
        title: "FREQUENTLY ASKED QUESTIONS",
        questions: [
          {
            q: "HOW DO THE PAID PLANS WORK?",
            a: "All paid plans are designed to elevate your training and injury prevention. Start with our Free tier, or upgrade to Individual Athlete, Coach, or Sports Organization for advanced tailored programming. Cancel or modify anytime."
          },
          {
            q: "CAN I SWITCH PLANS OR CHANGE SPORTS LATER?",
            a: "Absolutely! You can upgrade, downgrade, or switch your sport (Basketball to Soccer or vice-versa) at any time. Prorated adjustments will be automatically handled."
          },
          {
            q: "ARE THERE DISCOUNTS FOR SCHOOLS OR LARGER CLUBS?",
            a: "Yes! Our Sports Organization plan is highly customizable and offers scalable pricing for clubs, schools, academies, and entire athletic departments. Contact our team to request a personalized proposal."
          }
        ]
      }
    },
    fr: {
      breadcrumbs: {
        home: "ACCUEIL",
        pricing: "TARIFS"
      },
      badge: "PLANS TARIFAIRES",
      mostPopular: "LE PLUS POPULAIRE",
      title: "Trouvez le forfait qui correspond à vos objectifs.",
      subtitle: "Que vous soyez athlète, entraîneur ou organisation sportive, PRO ATHLETE vous offre des solutions fondées sur les données probantes pour améliorer la performance, prévenir les blessures et favoriser le développement à long terme des athlètes.",
      toggle: {
        monthly: "Facturation Mensuelle",
        yearly: "Facturation Annuelle",
        save: "Économisez plus de 35%"
      },
      pricingNotes: "Prix en CAD",
      tiers: [
        {
          id: "free",
          category: "GRATUIT",
          name: "GRATUIT",
          tagline: "Découvrez PRO ATHLETE. Accédez aux bases de la prévention des blessures, de la récupération et de la performance sportive.",
          perfectFor: "Idéal pour : Les athlètes et entraîneurs de tous sports qui souhaitent découvrir la plateforme et accéder à des ressources essentielles.",
          price: "0 $",
          priceSub: isYearly ? "/année" : "/mois",
          priceUnder: "Commencer gratuitement",
          features: [
            "Programmes d'échauffement avec exercices neuromusculaires",
            "Programmes de prévention des blessures",
            "Programmes de mobilité et de santé articulaire",
            "Exercices de récupération et de mobilité",
            "Ressources éducatives sur la performance sportive"
          ],
          button: "Commencer gratuitement",
          highlight: false
        },
        {
          id: "athlete",
          category: "ATHLÈTE INDIVIDUEL",
          name: "ATHLÈTE INDIVIDUEL",
          tagline: "Entraînez-vous intelligemment. Performez plus longtemps. Des programmes personnalisés conçus pour améliorer vos performances, développer votre force et réduire votre risque de blessure.",
          perfectFor: `Idéal pour : Les athlètes de ${activeSport === 'ALL' ? 'basketball ou soccer' : activeSport === 'SOCCER' ? 'soccer' : 'basketball'} qui souhaitent atteindre leur plein potentiel tout en demeurant en santé.`,
          price: isYearly ? "149,99 $" : "19,99 $",
          priceSub: isYearly ? "/année" : "/mois",
          priceUnder: isYearly ? "Économisez plus de 35 % par rapport à la facturation mensuelle." : "Facturé mensuellement",
          features: [
            "Programmes d'entraînement personnalisés selon votre sport",
            "Programmes de développement de la force et de la puissance",
            "Programmes de prévention des blessures et de prévention (prehab)",
            "Plans de mobilité et de récupération adaptés à vos besoins",
            "Suivi de performance et progression",
            "Recommandations de programmes en continu"
          ],
          button: "Commencer maintenant",
          highlight: true
        },
        {
          id: "coach",
          category: "ENTRAÎNEUR INDIVIDUEL",
          name: "ENTRAÎNEUR INDIVIDUEL",
          tagline: "Entraînez avec confiance. Accédez à des ressources prêtes à utiliser en prévention des blessures et en développement de la performance afin d'aider vos athlètes à demeurer forts, résilients et prêts à performer.",
          perfectFor: `Idéal pour : Les entraîneurs de ${activeSport === 'ALL' ? 'basketball ou soccer' : activeSport === 'SOCCER' ? 'soccer' : 'basketball'} qui souhaitent intégrer des stratégies fondées sur les données probantes dans leur programme.`,
          price: isYearly ? "149,99 $" : "19,99 $",
          priceSub: isYearly ? "/année" : "/mois",
          priceUnder: isYearly ? "Économisez plus de 35 % par rapport à la facturation mensuelle." : "Facturé mensuellement",
          features: [
            "Programmes d'échauffement avec exercices neuromusculaires",
            "Programmes de prévention des blessures",
            "Ressources de mobilité et de récupération",
            "Programmes d'entraînement au poids du corps",
            "Programmes de prévention (prehab) spécifiques au sport",
            "Outils et programmes prêts à implanter auprès de votre équipe"
          ],
          extraNote: "Les programmes de musculation avec charges ne sont pas inclus.",
          button: "Commencer maintenant",
          highlight: false
        },
        {
          id: "organization",
          category: "ORGANISATION SPORTIVE ★ MEILLEURE VALEUR POUR LES ÉQUIPES",
          name: "ORGANISATION SPORTIVE",
          tagline: "Développez des programmes plus forts et plus durables. Offrez à vos athlètes et entraîneurs un écosystème complet de performance et de prévention des blessures.",
          perfectFor: "Idéal pour : Les écoles, clubs, académies et organisations sportives qui souhaitent favoriser le développement à long terme de leurs athlètes.",
          price: "Tarification sur mesure",
          priceSub: "",
          priceUnder: "L'expérience PRO ATHLETE complète.",
          features: [
            "Programmes personnalisés pour chaque athlète",
            "Système de prévention des blessures à l'échelle de l'organisation",
            "Programmes d'échauffement spécifiques au sport avec exercices neuromusculaires",
            "Programmes de force, prehab, mobilité et récupération",
            "Tableaux de bord pour entraîneurs et athlètes",
            "Suivi de progression et rapports de performance",
            "Gestion de plusieurs équipes",
            "Accompagnement et soutien à l'implantation"
          ],
          button: "Nous contacter",
          highlight: false
        }
      ],
      compare: {
        title: "COMPAREZ LES FONCTIONNALITÉS EN DÉTAIL",
        subtitle: "CHOISISSEZ LE PLAN ADAPTÉ À VOS OBJECTIFS SPORTIFS",
        headers: ["Fonctionnalités incluses", "Gratuit", "Athlète Individuel", "Entraîneur Individuel", "Organisation Sportive"],
        rows: [
          { name: "Échauffements neuromusculaires", values: ["De base", "Personnalisé", "Équipe complète", "À l'échelle du club"] },
          { name: "Prévention des blessures", values: ["Essentiel", "Personnalisé", "Équipe complète", "À l'échelle du club"] },
          { name: "Mobilité & santé articulaire", values: ["Check", "Check", "Check", "Check"] },
          { name: "Entraînement spécifique au sport", values: ["-", "Check", "Check", "Check"] },
          { name: "Suivi & rapports de performance", values: ["-", "Check", "-", "Analyses complètes"] },
          { name: "Gestion d'équipe", values: ["-", "-", "-", "Multi-équipes & supervision"] }
        ]
      },
      faq: {
        badge: "FAQ",
        title: "QUESTIONS FRÉQUEMMENT POSÉES",
        questions: [
          {
            q: "COMMENT FONCTIONNENT LES FORFAITS PAYANTS ?",
            a: "Tous les forfaits payants sont conçus pour élever votre entraînement et prévenir les blessures. Vous pouvez commencer avec le forfait Gratuit pour découvrir les bases, ou passer aux forfaits Athlète Individuel, Entraîneur ou Organisation Sportive. Annulez ou modifiez à tout moment."
          },
          {
            q: "PUIS-JE CHANGER DE PLAN OU DE SPORT PLUS TARD ?",
            a: "Absolument ! Vous pouvez changer de formule, basculer d'un sport à l'autre (Basketball ou Football) ou modifier la périodicité de facturation. Tout paiement sera ajusté au prorata."
          },
          {
            q: "Y A-T-IL DES TARIFS POUR LES ÉCOLES OU LES ASSOCIATIONS ?",
            a: "Oui ! Notre forfait Organisation Sportive est hautement personnalisable et propose des tarifs dégressifs adaptés aux écoles, clubs, académies et associations. Contactez notre équipe pour obtenir une proposition sur mesure."
          }
        ]
      }
    }
  };

  const curr = t[lang];

  return (
    <div className="min-h-screen bg-[#001724] text-white pt-24 pb-20 relative overflow-hidden font-sans select-none">
      {/* Background abstract grids & radial glows mimicking exact high fidelity page */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#002b42]/30 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-[20%] left-[5%] w-[500px] h-[500px] bg-[#005776]/10 blur-[180px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[50%] right-[5%] w-[600px] h-[600px] bg-[#5CE1E6]/5 blur-[200px] rounded-full pointer-events-none -z-10" />

      {/* Breadcrumb line */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-[#5CE1E6]">
          <button onClick={onBackToHome} className="hover:text-white transition-colors">
            {curr.breadcrumbs.home}
          </button>
          <span className="text-white/20">/</span>
          <span className="text-white/80">{isFeatures ? pageText.crumb : curr.breadcrumbs.pricing}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 bg-[#005776]/10 border border-[#005776]/30 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-[#5CE1E6] mb-6"
          >
            <Shield size={10} className="text-[#5CE1E6]" />
            {isFeatures ? pageText.badge : curr.badge}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-heading font-black italic tracking-tight uppercase leading-[0.95] mb-6 text-white"
          >
            {isFeatures ? pageText.title : curr.title}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-sm md:text-base leading-relaxed"
          >
            {isFeatures ? pageText.subtitle : curr.subtitle}
          </motion.p>

          {/* Monthly / Yearly Toggle */}
          {!isFeatures && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <div className="bg-[#002337] border border-white/10 p-1 rounded-full flex items-center">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                  !isYearly ? 'bg-[#5CE1E6] text-[#002337]' : 'text-white/60 hover:text-white'
                }`}
              >
                {curr.toggle.monthly}
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                  isYearly ? 'bg-[#5CE1E6] text-[#002337]' : 'text-white/60 hover:text-white'
                }`}
              >
                {curr.toggle.yearly}
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-white/60">
              <span className="bg-[#005776] text-[#5CE1E6] px-2 py-0.5 rounded text-[9px] font-black">
                {curr.toggle.save}
              </span>
              <span className="text-white/30">|</span>
              <span>{curr.pricingNotes}</span>
            </div>
          </motion.div>
          )}
        </div>

        {/* Pricing Tiers Grid */}
        {!isFeatures && (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-10 md:mb-12">
          {curr.tiers.map((tier, idx) => {
            const isHighlighted = tier.id === 'athlete';
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative flex flex-col justify-between bg-[#001f30] border rounded-2xl md:rounded-3xl p-6 md:p-8 transition-all hover:translate-y-[-4px] ${
                  isHighlighted 
                    ? 'border-[#5CE1E6] shadow-xl shadow-[#5CE1E6]/10' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Visual glow on the popular premium tier */}
                {isHighlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#5CE1E6] text-[#002337] text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-md shadow-[#5CE1E6]/25">
                    <Star size={10} fill="currentColor" />
                    {curr.mostPopular}
                  </div>
                )}

                {/* Accent thin separator line like the magenta line in the original design blueprint */}
                {(idx === 0 || idx === 1 || idx === 2) && (
                  <div className="absolute top-10 bottom-10 -right-3 hidden lg:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                )}

                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Category */}
                    <span className="text-[9px] font-black tracking-[0.25em] text-[#5CE1E6] uppercase block mb-2">
                      {tier.category}
                    </span>

                    {/* Tier Title */}
                    <h3 className="text-xl md:text-2xl font-heading font-black tracking-tight uppercase mb-3 text-white">
                      {tier.name}
                    </h3>

                    {/* Description tagline */}
                    <p className="text-xs text-white/50 leading-relaxed font-light min-h-[50px] mb-4">
                      {tier.tagline}
                    </p>

                    {/* Perfect For */}
                    {tier.perfectFor && (
                      <p className="text-[11px] text-white/85 bg-white/[0.03] border border-white/5 rounded-xl p-3 mb-6 leading-relaxed">
                        {tier.perfectFor}
                      </p>
                    )}

                    {/* Pricing block */}
                    <div className="mb-6 border-b border-white/5 pb-6">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl md:text-5xl font-heading font-black italic text-white tracking-tight">
                          {tier.price}
                        </span>
                        {tier.priceSub && (
                          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                            {tier.priceSub}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-black tracking-wider text-[#5CE1E6] uppercase block mt-1">
                        {tier.priceUnder}
                      </span>
                    </div>

                    {/* Button trigger modal or action */}
                    <button
                      onClick={onContactClick}
                      className={`w-full py-3.5 rounded-xl text-center text-[10px] font-black uppercase tracking-widest transition-all duration-300 mb-8 ${
                        isHighlighted
                          ? 'bg-[#5CE1E6] text-[#002337] hover:bg-white hover:text-[#002337] shadow-lg shadow-[#5CE1E6]/10'
                          : 'bg-transparent border border-white/20 text-white hover:bg-white hover:text-[#001724]'
                      }`}
                    >
                      {tier.button}
                    </button>

                    {/* Feature lists */}
                    <div className="space-y-4">
                      {tier.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs">
                          <Check className="w-4 h-4 text-[#5CE1E6] shrink-0 mt-0.5" />
                          <span className="text-white/80 font-light leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extra Note */}
                  {tier.extraNote && (
                    <div className="mt-6 pt-3 border-t border-white/5 text-[11px] text-white/50 italic font-light leading-relaxed">
                      {tier.extraNote}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {onFeaturesClick && (
          <div className="flex justify-center mb-24 md:mb-32">
            <button type="button" onClick={onFeaturesClick} className="inline-flex items-center gap-2 border border-white/20 hover:border-[#5CE1E6] hover:text-[#5CE1E6] text-white px-6 py-3 rounded-full font-bold uppercase tracking-[0.15em] text-xs transition-colors">
              {pageText.toFeatures} <ArrowRight size={14} />
            </button>
          </div>
        )}
        </>
        )}

        {/* Compare Features in Detail section (Features page) */}
        {isFeatures && (
        <>
        <div id="compare-features" className="mb-12 md:mb-16 overflow-x-auto scroll-mt-28">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-heading font-black italic tracking-tight uppercase text-white mb-2">
              {curr.compare.title}
            </h3>
            <span className="text-[10px] font-black tracking-[0.2em] text-[#5CE1E6] uppercase">
              {curr.compare.subtitle}
            </span>
          </div>

          <table className="w-full min-w-[700px] text-left border-collapse border border-white/5">
            <thead>
              <tr className="bg-[#001f30] border-b border-white/10">
                {curr.compare.headers.map((hdr, hIdx) => (
                  <th 
                    key={hIdx} 
                    className={`p-4 md:p-5 text-[10px] font-black tracking-widest uppercase ${
                      hIdx === 0 ? 'text-white' : hIdx === 2 ? 'text-[#5CE1E6]' : 'text-white/60'
                    }`}
                  >
                    {hdr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {curr.compare.rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 md:p-5 text-xs text-white font-semibold">
                    {row.name}
                  </td>
                  {row.values.map((val, vIdx) => {
                    const isCheck = val === 'Check';
                    return (
                      <td key={vIdx} className="p-4 md:p-5 text-xs text-white/70">
                        {isCheck ? (
                          <Check className="w-4 h-4 text-[#5CE1E6]" />
                        ) : val === '-' ? (
                          <span className="text-white/20">-</span>
                        ) : (
                          <span className={vIdx === 1 ? 'text-[#5CE1E6] font-bold' : ''}>{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {onPricingClick && (
          <div className="flex justify-center mb-8">
            <button type="button" onClick={onPricingClick} className="inline-flex items-center gap-2 bg-[#005776] hover:bg-[#006b91] text-white px-6 py-3 rounded-full font-bold uppercase tracking-[0.15em] text-xs transition-colors">
              {pageText.toPricing} <ArrowRight size={14} />
            </button>
          </div>
        )}
        </>
        )}

        {/* FAQ Accordion block (Pricing page) */}
        {!isFeatures && (
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 bg-[#005776]/10 border border-[#005776]/30 px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase text-[#5CE1E6] mb-4">
              <HelpCircle size={10} className="text-[#5CE1E6]" />
              {curr.faq.badge}
            </div>
            <h3 className="text-2xl md:text-3xl font-heading font-black italic tracking-tight uppercase text-white">
              {curr.faq.title}
            </h3>
          </div>

          <div className="space-y-4">
            {curr.faq.questions.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div 
                  key={index} 
                  className="border border-white/10 rounded-xl overflow-hidden bg-[#001f30] transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
                  >
                    <span className="text-[10px] md:text-xs font-black tracking-widest text-white uppercase pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`text-[#5CE1E6] transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-5 pt-0 text-xs md:text-sm text-white/70 leading-relaxed border-t border-white/5 font-light">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
        )}

      </div>
    </div>
  );
};
