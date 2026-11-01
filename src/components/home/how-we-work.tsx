"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, Award, Shield, Zap, Target, Sparkles, ArrowRight } from "lucide-react";

// =========================================
// PREMIUM TINT SYSTEM (Consistent with other sections)
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
  indigo: {
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    hoverIcon: "group-hover:bg-indigo-500",
    gradient: "from-indigo-500 to-blue-500",
    orb: "bg-indigo-500",
  },
};

export function HowWeWork() {
  const features = [
    {
      title: "Personalized Learning",
      description: "Every student receives tailored attention from our expert faculty to ensure they reach their maximum potential.",
      icon: Users,
      className: "md:col-span-2 lg:col-span-2",
      tint: TINTS.blue,
    },
    {
      title: "Modern Curriculum",
      description: "English Version National Curriculum designed to prepare students for global challenges.",
      icon: BookOpen,
      className: "md:col-span-1 lg:col-span-1",
      tint: TINTS.amber,
    },
    {
      title: "Award-Winning Faculty",
      description: "Learn from highly qualified educators dedicated to academic excellence.",
      icon: Award,
      className: "md:col-span-1 lg:col-span-1",
      tint: TINTS.emerald,
    },
    {
      title: "Safe & Nurturing Environment",
      description: "A secure, inclusive campus equipped with modern facilities, labs, and a vast library to foster holistic growth.",
      icon: Shield,
      className: "md:col-span-2 lg:col-span-2",
      tint: TINTS.purple,
    },
    {
      title: "Continuous Assessment",
      description: "Regular progress tracking and parent-teacher meetings.",
      icon: Target,
      className: "md:col-span-1 lg:col-span-1",
      tint: TINTS.rose,
    },
    {
      title: "Co-Curricular Activities",
      description: "Sports, debates, and clubs for all-round development.",
      icon: Zap,
      className: "md:col-span-2 lg:col-span-2",
      tint: TINTS.indigo,
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">
      
      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-sm mb-6"
          >
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--fg)]">The Oasis Advantage</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.1] mb-6"
          >
            Everything your child <br className="hidden sm:block" />
            needs to <span className="gradient-text">succeed.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--fg-muted)] font-medium leading-relaxed"
          >
            We combine traditional values with modern educational practices to create a learning environment where every student thrives.
          </motion.p>
        </div>

        {/* ================= BENTO GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5 lg:gap-6 auto-rows-[minmax(240px,auto)]">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const theme = feature.tint;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`
                  group relative p-6 sm:p-8 rounded-[2rem] flex flex-col overflow-hidden
                  bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)]
                  hover:border-[var(--primary)]/30 hover:shadow-2xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1
                  transition-all duration-300 ${feature.className}
                `}
              >
                {/* Background Glowing Orb */}
                <div className={`
                  absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-[0.15] blur-2xl pointer-events-none
                  group-hover:scale-150 group-hover:opacity-[0.25] transition-all duration-500 ${theme.orb}
                `} />

                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Icon Bubble */}
                  <div className={`
                    w-14 h-14 rounded-2xl grid place-items-center mb-6 shadow-sm
                    ${theme.iconBg} ${theme.iconColor}
                    group-hover:scale-110 group-hover:-rotate-3 group-hover:text-white transition-all duration-300
                    ${theme.hoverIcon}
                  `}>
                    <Icon className="h-7 w-7" strokeWidth={2} />
                  </div>

                  {/* Text Content */}
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-[var(--fg-muted)] font-medium leading-relaxed text-sm sm:text-base flex-1">
                    {feature.description}
                  </p>
                  
                  {/* Learn More Indicator (Appears on Hover) */}
                  <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[var(--primary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Animated Bottom Accent Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1">
                  <div className={`h-full w-0 group-hover:w-full bg-gradient-to-r ${theme.gradient} transition-all duration-500 rounded-r-full`} />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}