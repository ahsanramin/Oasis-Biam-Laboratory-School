"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, GraduationCap, Award, TrendingUp, BookOpen, Sparkles } from "lucide-react";

// =========================================
// 1. PREMIUM TINT SYSTEM
// =========================================
const TINTS = {
  blue: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    hoverIcon: "group-hover:bg-blue-500",
    gradient: "from-blue-500 to-cyan-500",
    orb: "bg-blue-500",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    hoverIcon: "group-hover:bg-amber-500",
    gradient: "from-amber-500 to-orange-500",
    orb: "bg-amber-500",
  },
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    hoverIcon: "group-hover:bg-emerald-500",
    gradient: "from-emerald-500 to-teal-500",
    orb: "bg-emerald-500",
  },
  purple: {
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    hoverIcon: "group-hover:bg-purple-500",
    gradient: "from-purple-500 to-pink-500",
    orb: "bg-purple-500",
  },
  rose: {
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
    hoverIcon: "group-hover:bg-rose-500",
    gradient: "from-rose-500 to-red-500",
    orb: "bg-rose-500",
  },
};

// =========================================
// 2. ANIMATED COUNTER COMPONENT
// =========================================
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!inView) return;
    let raf: number; 
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 2000);
      // Cubic ease-out for a smooth finish
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

// =========================================
// 3. MAIN COMPONENT
// =========================================
export function Stats() {
  const items = [
    { label: "Total Students", value: 1250, suffix: "+", icon: Users, tint: TINTS.blue },
    { label: "Expert Teachers", value: 45, suffix: "+", icon: GraduationCap, tint: TINTS.amber },
    { label: "Years of Excellence", value: 21, suffix: "+", icon: Award, tint: TINTS.emerald },
    { label: "Awards Won", value: 150, suffix: "+", icon: TrendingUp, tint: TINTS.purple },
    { label: "Library Books", value: 5000, suffix: "+", icon: BookOpen, tint: TINTS.rose },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)] border-y border-[var(--border)]">
      
      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 z-10">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-sm mb-6"
          >
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--fg)]">By The Numbers</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.1] mb-6"
          >
            Trusted by the <span className="gradient-text">Community.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--fg-muted)] max-w-2xl mx-auto font-medium"
          >
            Over two decades of delivering academic excellence, shaping leaders, and building a legacy of trust in Netrokona.
          </motion.p>
        </div>

        {/* ================= STATS GRID ================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {items.map((s, i) => {
            const Icon = s.icon;
            const theme = s.tint;
            
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.08, duration: 0.5 }}
                // The last item on a 2-col mobile grid should span full width
                className={`${i === 4 ? "col-span-2 md:col-span-1" : ""}`}
              >
                <div 
                  className={`
                    group relative h-full p-6 rounded-[2rem] flex flex-col items-start overflow-hidden
                    bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)]
                    hover:border-[var(--primary)]/30 hover:shadow-2xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1.5
                    transition-all duration-300
                  `}
                >
                  {/* Background Glowing Orb */}
                  <div className={`
                    absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-[0.15] blur-2xl pointer-events-none
                    group-hover:scale-150 group-hover:opacity-[0.25] transition-all duration-500 ${theme.orb}
                  `} />

                  {/* Icon Bubble */}
                  <div className={`
                    relative z-10 mb-5 inline-flex p-3.5 rounded-2xl transition-all duration-300
                    ${theme.iconBg} ${theme.iconColor} ${theme.hoverIcon} 
                    group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 shadow-sm
                  `}>
                    <Icon className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                  
                  {/* Number */}
                  <p className="relative z-10 text-4xl lg:text-5xl font-black text-[var(--fg)] mb-1 tracking-tight group-hover:text-[var(--primary)] transition-colors">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  
                  {/* Label */}
                  <p className="relative z-10 text-[10px] sm:text-xs font-black text-[var(--fg-muted)] uppercase tracking-[0.15em] leading-tight mt-auto">
                    {s.label}
                  </p>

                  {/* Animated Bottom Accent Bar */}
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