"use client";

import { Building2, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

// =========================================
// TINT SYSTEM
// =========================================
const TINTS = {
  blue: {
    icon: "text-blue-500",
    bg: "bg-blue-500/10",
    orb: "bg-blue-500",
    border: "hover:border-blue-500/40",
    shadow: "hover:shadow-blue-500/10",
    gradient: "from-blue-500 to-cyan-500",
  },
  amber: {
    icon: "text-amber-500",
    bg: "bg-amber-500/10",
    orb: "bg-amber-500",
    border: "hover:border-amber-500/40",
    shadow: "hover:shadow-amber-500/10",
    gradient: "from-amber-500 to-orange-500",
  },
};

export function GoverningInfo({ about }: { about: any }) {
  // Safe fallbacks if data is missing
  const districtInfo = about?.districtAdministration || "The school is directly supervised by the District Administration of Netrokona, ensuring transparent, high-standard educational management and community alignment.";
  const biamInfo = about?.biamFoundation || "Operating under the prestigious BIAM Foundation, we leverage their extensive educational expertise and national resources to maintain world-class academic excellence.";

  const cards = [
    { 
      icon: Building2, 
      title: "District Administration Netrokona", 
      body: districtInfo, 
      tint: TINTS.blue 
    },
    { 
      icon: ShieldCheck, 
      title: "BIAM Foundation", 
      body: biamInfo, 
      tint: TINTS.amber 
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">
      
      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-sm mb-6"
          >
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--fg)]">Our Governance</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-black font-display tracking-tight leading-[1.1]"
          >
            Guided by <br className="hidden sm:block" />
            <span className="gradient-text">Trusted Institutions.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-[var(--fg-muted)] max-w-2xl mx-auto font-medium"
          >
            Our institution operates under the direct supervision and partnership of the region's most trusted educational and governmental bodies.
          </motion.p>
        </div>

        {/* ================= INFO CARDS GRID ================= */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {cards.map((c, i) => {
            const Icon = c.icon;
            const theme = c.tint;
            
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div 
                  className={`
                    group relative h-full p-8 sm:p-10 rounded-[2.5rem] 
                    bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] 
                    ${theme.border} ${theme.shadow} hover:shadow-2xl hover:-translate-y-1.5
                    transition-all duration-300 flex flex-col overflow-hidden
                  `}
                >
                  {/* Background Glowing Orb */}
                  <div 
                    className={`
                      absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20 blur-3xl 
                      pointer-events-none group-hover:opacity-40 group-hover:scale-125 transition-all duration-500 
                      ${theme.orb}
                    `} 
                  />
                  
                  {/* Subtle Watermark Icon */}
                  <Icon className={`absolute -bottom-8 -right-8 w-40 h-40 opacity-[0.03] ${theme.icon} pointer-events-none rotate-12`} />

                  {/* Icon Bubble */}
                  <div className="relative z-10 mb-8">
                    <div 
                      className={`
                        inline-flex p-4 rounded-2xl ${theme.bg} ${theme.icon} 
                        group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300
                        ring-1 ring-inset ring-white/10 shadow-sm
                      `}
                    >
                      <Icon className="h-8 w-8" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <h3 className="text-2xl sm:text-3xl font-bold text-[var(--fg)] mb-4 leading-tight group-hover:text-[var(--primary)] transition-colors">
                      {c.title}
                    </h3>
                    
                    <p className="text-[var(--fg-muted)] leading-relaxed text-base sm:text-lg mb-8 flex-1">
                      {c.body}
                    </p>

                    {/* Trust Badge Footer */}
                    <div className="pt-6 border-t border-[var(--border)] flex items-center gap-3">
                      <div className={`p-1 rounded-full ${theme.bg} ${theme.icon}`}>
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[var(--fg-muted)]">
                        Officially Recognized
                      </span>
                    </div>
                  </div>

                  {/* Animated Bottom Bar */}
                  <div className="absolute bottom-0 left-0 w-full h-1">
                    <div className={`h-full w-0 group-hover:w-full bg-gradient-to-r ${theme.gradient} transition-all duration-500 rounded-r-full`} />
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}