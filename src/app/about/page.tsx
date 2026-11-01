"use client";

import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  ShieldCheck,
  GraduationCap,
  MapPin,
  Target,
  Eye,
  Heart,
  Sparkles,
  Quote,
  ArrowRight,
  BookOpen,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  const facts = [
    { icon: GraduationCap, label: "Established", value: "2003", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: MapPin, label: "Location", value: "Netrokona", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: Building2, label: "Curriculum", value: "English Version", color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: ShieldCheck, label: "Governed by", value: "Govt + BIAM", color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <>
      <PageHeader
        title="Our Story & Legacy"
        subtitle="Nurturing excellence and shaping the future of Netrokona since 2003."
        breadcrumbs={[{ label: "About Us" }]}
      />

      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-32 space-y-32 overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* ================= STORY SECTION ================= */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="brand" className="mb-6 px-4 py-1.5 text-sm rounded-full shadow-sm shadow-brand-500/20">
              <Sparkles className="h-3.5 w-3.5 mr-2" /> The Beginning
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black font-display leading-[1.1] mb-8">
              A Legacy of <br />
              <span className="gradient-text">Excellence.</span>
            </h2>
            <div className="space-y-6 text-[var(--fg-muted)] text-lg leading-relaxed font-medium">
              <p>
                Oasis BIAM Laboratory School was established in 2003 with a singular vision: to bring world-class English-medium education to the heart of Netrokona.
              </p>
              <p>
                Guided by the District Administration Netrokona and the BIAM Foundation, we have grown from a modest campus to a thriving educational hub, serving over <strong className="text-[var(--fg)]">1,200 students</strong> from Play to Class VII.
              </p>
              <p>
                Our commitment to the English Version National Curriculum ensures our students are globally competitive while staying rooted in Bangladeshi values.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <Link href="/admissions">
                <Button size="lg" className="gradient-brand shadow-glow rounded-xl">
                  Join Our Community <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Bento Grid of Facts */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6 relative">
            {/* Decorative background blur */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent blur-2xl -z-10" />
            
            {facts.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="p-6 lg:p-8 h-full rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-md hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-2xl ${f.bg} grid place-items-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <f.icon className={`h-6 w-6 ${f.color}`} />
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--fg-muted)] mb-2">
                    {f.label}
                  </p>
                  <p className="text-xl lg:text-2xl font-black text-[var(--fg)]">
                    {f.value}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= QUOTE SECTION ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <Quote className="absolute -top-10 left-1/2 -translate-x-1/2 h-24 w-24 text-[var(--primary)]/10 -z-10" />
          <h3 className="text-2xl lg:text-4xl font-bold leading-snug text-[var(--fg)] italic">
            "Education is not just about filling a bucket, but lighting a fire. We are committed to igniting the curiosity and potential within every single child."
          </h3>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="w-12 h-1 bg-gradient-to-r from-transparent to-[var(--primary)] rounded-full" />
            <p className="font-bold uppercase tracking-widest text-sm text-[var(--fg-muted)]">The Oasis BIAM Philosophy</p>
            <div className="w-12 h-1 bg-gradient-to-l from-transparent to-[var(--primary)] rounded-full" />
          </div>
        </motion.div>

        {/* ================= CORE VALUES (Bento Box) ================= */}
        <div>
          <div className="text-center mb-16">
            <Badge variant="brand" className="mb-4 px-4 py-1.5 text-sm rounded-full shadow-sm shadow-brand-500/20">
              What Drives Us
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black font-display">
              Our Core <span className="gradient-text">Values</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 auto-rows-[minmax(220px,auto)]">
            
            {/* Mission Card (Spans 2 columns) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] p-8 lg:p-10 hover:border-blue-500/30 transition-colors group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 grid place-items-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-[var(--fg-muted)] text-lg leading-relaxed max-w-xl">
                To provide a transformative education that empowers students to become lifelong learners, critical thinkers, and responsible global citizens who contribute meaningfully to society.
              </p>
            </motion.div>

            {/* Vision Card (Spans 1 column) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] p-8 lg:p-10 hover:border-amber-500/30 transition-colors group"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 grid place-items-center mb-6 text-amber-500 group-hover:scale-110 transition-transform">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-[var(--fg-muted)] leading-relaxed">
                To be the premier educational institution in Netrokona, recognized globally for academic excellence and character development.
              </p>
            </motion.div>

            {/* Values Card (Spans all 3 columns) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-3 relative overflow-hidden rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] p-8 lg:p-10 hover:border-rose-500/30 transition-colors group flex flex-col md:flex-row items-start md:items-center gap-8"
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors" />
              
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 grid place-items-center shrink-0 text-rose-500 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <Heart className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Our Values</h3>
                <div className="flex flex-wrap gap-3 mt-4">
                  {["Integrity", "Respect", "Compassion", "Excellence", "Community", "Innovation"].map((val, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-[var(--bg-soft)] border border-[var(--border)] text-sm font-bold text-[var(--fg-muted)] hover:text-rose-500 hover:border-rose-500/30 transition-colors cursor-default">
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </section>
    </>
  );
}