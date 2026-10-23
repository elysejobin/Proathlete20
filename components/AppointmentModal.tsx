
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Calendar, User, Mail, Building2, MessageSquare, ArrowRight } from 'lucide-react';
import { translations } from '../translations';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'fr';
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, lang }) => {
  const t = translations[lang].appointment;
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    role: '',
    customRole: '',
    org: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          role: formState.role === t.form.roleOptions.other ? formState.customRole : formState.role,
          org: formState.org,
          message: formState.message,
        }),
      });
      if (!response.ok) throw new Error('Failed to send');
      setIsSuccess(true);
      (window as any).gtag?.('event', 'generate_lead', { form: 'contact' });
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again or email info@proathlete.ca directly.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const resetForm = () => {
    setFormState({ name: '', email: '', role: '', customRole: '', org: '', message: '' });
    setIsSuccess(false);
    onClose();
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormState({ ...formState, role: e.target.value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#002337]/95 backdrop-blur-xl"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-20"
          >
            <X size={32} />
          </button>

          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 overflow-y-auto max-h-[90vh] lg:max-h-none hide-scrollbar">
            
            {/* Left Column: Value Prop */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col justify-center text-white"
            >
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="text-[#005776] w-6 h-6" />
                <span className="font-heading font-black italic tracking-widest text-sm uppercase text-[#005776]">{t.tag}</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-heading font-black italic mb-6 leading-tight uppercase">
                {t.title}
              </h2>
              <p className="text-xl text-white/70 mb-12 max-w-lg leading-relaxed">
                {t.subtitle}
              </p>

              <div className="space-y-8">
                {t.benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-[#005776]/20 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#005776] transition-colors">
                      <CheckCircle2 size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{benefit.title}</h3>
                      <p className="text-white/60 text-sm">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-white/60 text-sm mb-3 uppercase tracking-widest font-bold">Direct Contact</p>
                <a href="mailto:info@proathlete.ca" className="text-3xl md:text-4xl font-heading font-black italic text-white hover:text-[#005776] transition-colors flex items-center gap-4 group">
                  <Mail size={32} className="text-[#005776] group-hover:scale-110 transition-transform" />
                  info@proathlete.ca
                </a>
              </div>
            </motion.div>

            {/* Right Column: Form */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 text-[#002337] relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleSubmit}
                    className="space-y-6 relative z-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-50 ml-1">{t.form.name}</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#002337]/30" size={18} />
                          <input 
                            required
                            type="text"
                            value={formState.name}
                            onChange={(e) => setFormState({...formState, name: e.target.value})}
                            className="w-full bg-[#002337]/5 border border-[#002337]/10 rounded-xl py-4 pl-12 pr-4 font-medium focus:outline-none focus:border-[#005776] transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-50 ml-1">{t.form.email}</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#002337]/30" size={18} />
                          <input 
                            required
                            type="email"
                            value={formState.email}
                            onChange={(e) => setFormState({...formState, email: e.target.value})}
                            className="w-full bg-[#002337]/5 border border-[#002337]/10 rounded-xl py-4 pl-12 pr-4 font-medium focus:outline-none focus:border-[#005776] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-50 ml-1">{t.form.role}</label>
                        <div className="relative">
                          <select 
                            required
                            value={formState.role}
                            onChange={handleRoleChange}
                            className="w-full bg-[#002337]/5 border border-[#002337]/10 rounded-xl py-4 px-4 font-medium focus:outline-none focus:border-[#005776] transition-all appearance-none"
                          >
                            <option value="" disabled>{t.form.rolePlaceholder}</option>
                            {Object.entries(t.form.roleOptions).map(([key, label]) => (
                              <option key={key} value={label}>{label}</option>
                            ))}
                          </select>
                        </div>
                        {formState.role === t.form.roleOptions.other && (
                           <motion.div
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             className="mt-2"
                           >
                              <input 
                                type="text"
                                required
                                placeholder={t.form.otherRoleLabel}
                                value={formState.customRole}
                                onChange={(e) => setFormState({...formState, customRole: e.target.value})}
                                className="w-full bg-[#002337]/5 border border-[#002337]/10 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-[#005776] transition-all"
                              />
                           </motion.div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-50 ml-1">{t.form.org}</label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#002337]/30" size={18} />
                          <input 
                            required
                            type="text"
                            value={formState.org}
                            onChange={(e) => setFormState({...formState, org: e.target.value})}
                            className="w-full bg-[#002337]/5 border border-[#002337]/10 rounded-xl py-4 pl-12 pr-4 font-medium focus:outline-none focus:border-[#005776] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-50 ml-1">{t.form.message}</label>
                      <textarea 
                        rows={4}
                        value={formState.message}
                        onChange={(e) => setFormState({...formState, message: e.target.value})}
                        className="w-full bg-[#002337]/5 border border-[#002337]/10 rounded-xl py-4 px-4 font-medium focus:outline-none focus:border-[#005776] transition-all resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#005776] text-white font-bold py-5 rounded-xl hover:bg-[#002337] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 group"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {t.form.submit} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                  >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={48} className="text-green-600" />
                    </div>
                    <h3 className="text-3xl font-heading font-black italic uppercase mb-4">{t.success.title}</h3>
                    <p className="text-[#002337]/60 text-lg mb-8 max-w-md">
                      {t.success.subtitle}
                    </p>
                    <button 
                      onClick={resetForm}
                      className="bg-[#002337]/5 text-[#002337] font-bold px-8 py-3 rounded-full hover:bg-[#002337]/10 transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentModal;
