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

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutPage() {
  const facts = [
    { icon: GraduationCap, label: "Established",  value: "2003",            color: "text-blue-500",    bg: "bg-blue-500/10",    ring: "ring-blue-500/20",    glow: "from-blue-500/25" },
    { icon: MapPin,        label: "Location",      value: "Netrokona",        color: "text-emerald-500", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20", glow: "from-emerald-500/25" },
    { icon: Building2,     label: "Curriculum",    value: "English Version",  color: "text-purple-500",  bg: "bg-purple-500/10",  ring: "ring-purple-500/20",  glow: "from-purple-500/25" },
    { icon: ShieldCheck,   label: "Governed by",   value: "Govt + BIAM",      color: "text-amber-500",   bg: "bg-amber-500/10",   ring: "ring-amber-500/20",   glow: "from-amber-500/25" },
  ];

  return (
    <>
      <PageHeader
        title="Our Story & Legacy"
        subtitle="Nurturing excellence and shaping the future of Netrokona since 2003."
        breadcrumbs={[{ label: "About Us" }]}
      />

      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-32 space-y-32 overflow-hidden">

        {/* ===== Ambient background layers ===== */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <div className="absolute top-0 -left-24 w-[600px] h-[600px] bg-brand-500/[0.06] rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-24 w-[700px] h-[700px] bg-blue-500/[0.05] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/[0.025] rounded-full blur-3xl" />
        </div>

        {/* ================= STORY SECTION ================= */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Badge
              variant="brand"
              className="mb-6 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] rounded-full shadow-lg shadow-brand-500/20 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 mr-2" /> The Beginning
            </Badge>

            <h2 className="text-4xl lg:text-[56px] font-black font-display leading-[1.05] tracking-tight mb-8">
              A Legacy of <br />
              <span className="gradient-text">Excellence.</span>
            </h2>

            <div className="relative pl-6">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/60 via-brand-500/20 to-transparent" />
              <div className="space-y-6 text-[var(--fg-muted)] text-lg leading-relaxed font-medium">
                <p>
                  Oasis BIAM Laboratory School was established in 2003 with a singular vision: to bring world-class English-medium education to the heart of Netrokona.
                </p>
                <p>
                  Guided by the District Administration Netrokona and the BIAM Foundation, we have grown from a modest campus to a thriving educational hub, serving over{" "}
                  <strong className="text-[var(--fg)] font-bold">1,200 students</strong> from Play to Class VII.
                </p>
                <p>
                  Our commitment to the English Version National Curriculum ensures our students are globally competitive while staying rooted in Bangladeshi values.
                </p>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-4">
              <Link href="/admissions">
                <Button size="lg" className="gradient-brand shadow-glow rounded-xl group/btn">
                  Join Our Community
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Bento Grid of Facts */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-blue-500/10 blur-2xl -z-10 rounded-full" />

            {facts.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
                className="relative group h-full"
              >
                {/* Hover glow behind card */}
                <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-br ${f.glow} via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10`} />

                <Card className="relative p-6 lg:p-8 h-full rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md hover:border-[var(--fg)]/10 hover:shadow-2xl hover:shadow-black/[0.04] transition-all duration-500 overflow-hidden">
                  {/* Subtle corner sheen */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-bl from-[var(--fg)]/[0.05] to-transparent rounded-full blur-2xl pointer-events-none" />

                  <div className={`relative w-14 h-14 rounded-2xl ${f.bg} ring-1 ${f.ring} grid place-items-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500`}>
                    <f.icon className={`h-6 w-6 ${f.color}`} strokeWidth={2.5} />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--fg-muted)] mb-2.5">
                    {f.label}
                  </p>
                  <p className="text-2xl lg:text-[28px] font-black text-[var(--fg)] tracking-tight leading-none">
                    {f.value}
                  </p>

                  {/* Animated underline accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/50 transition-all duration-500" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= QUOTE SECTION ================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative max-w-4xl mx-auto text-center"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-500/[0.06] via-transparent to-transparent blur-2xl rounded-full" />

          <Quote className="absolute -top-10 left-1/2 -translate-x-1/2 h-24 w-24 text-[var(--primary)]/10 -z-10" />

          <h3 className="text-2xl lg:text-4xl font-bold leading-snug text-[var(--fg)] italic text-balance">
            "Education is not just about filling a bucket, but lighting a fire. We are committed to igniting the curiosity and potential within every single child."
          </h3>

          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-brand-500/80" />
            <p className="font-bold uppercase tracking-[0.25em] text-[11px] text-[var(--fg-muted)]">
              The Oasis BIAM Philosophy
            </p>
            <div className="w-16 h-px bg-gradient-to-l from-transparent via-brand-500/60 to-brand-500/80" />
          </div>
        </motion.div>

        {/* ================= CORE VALUES (Bento Box) ================= */}
        <div>
          <div className="text-center mb-16">
            <Badge
              variant="brand"
              className="mb-4 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] rounded-full shadow-lg shadow-brand-500/20 backdrop-blur-md"
            >
              What Drives Us
            </Badge>
            <h2 className="text-4xl lg:text-[56px] font-black font-display tracking-tight">
              Our Core <span className="gradient-text">Values</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 auto-rows-[minmax(220px,auto)]">

            {/* Mission Card — spans 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
              className="md:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-[var(--card)]/60 backdrop-blur-md border border-[var(--border)] p-8 lg:p-12 hover:border-blue-500/30 transition-colors duration-500 group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.06] rounded-full blur-3xl group-hover:bg-blue-500/[0.12] transition-colors duration-500" />
              <div className="absolute -bottom-10 -right-2 text-[160px] font-black leading-none text-blue-500/[0.045] select-none pointer-events-none tracking-tighter">
                01
              </div>

              <div className="relative w-16 h-16 rounded-2xl bg-blue-500/10 ring-1 ring-blue-500/20 grid place-items-center mb-8 text-blue-500 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <Target className="h-8 w-8" strokeWidth={2.5} />
              </div>
              <h3 className="relative text-3xl font-bold mb-4 tracking-tight">Our Mission</h3>
              <p className="relative text-[var(--fg-muted)] text-lg leading-relaxed max-w-xl">
                To provide a transformative education that empowers students to become lifelong learners, critical thinkers, and responsible global citizens who contribute meaningfully to society.
              </p>
            </motion.div>

            {/* Vision Card — spans 1 column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="relative overflow-hidden rounded-[2.5rem] bg-[var(--card)]/60 backdrop-blur-md border border-[var(--border)] p-8 lg:p-10 hover:border-amber-500/30 transition-colors duration-500 group"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/[0.06] rounded-full blur-3xl group-hover:bg-amber-500/[0.12] transition-colors duration-500" />
              <div className="absolute -bottom-8 -right-2 text-[120px] font-black leading-none text-amber-500/[0.045] select-none pointer-events-none tracking-tighter">
                02
              </div>

              <div className="relative w-16 h-16 rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20 grid place-items-center mb-8 text-amber-500 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <Eye className="h-8 w-8" strokeWidth={2.5} />
              </div>
              <h3 className="relative text-2xl font-bold mb-4 tracking-tight">Our Vision</h3>
              <p className="relative text-[var(--fg-muted)] leading-relaxed">
                To be the premier educational institution in Netrokona, recognized globally for academic excellence and character development.
              </p>
            </motion.div>

            {/* Values Card — spans all 3 columns */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="md:col-span-3 relative overflow-hidden rounded-[2.5rem] bg-[var(--card)]/60 backdrop-blur-md border border-[var(--border)] p-8 lg:p-12 hover:border-rose-500/30 transition-colors duration-500 group flex flex-col md:flex-row items-start md:items-center gap-8"
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/[0.06] rounded-full blur-3xl group-hover:bg-rose-500/[0.12] transition-colors duration-500" />

              <div className="relative w-20 h-20 rounded-2xl bg-rose-500/10 ring-1 ring-rose-500/20 grid place-items-center shrink-0 text-rose-500 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                <Heart className="h-10 w-10" strokeWidth={2.5} />
              </div>

              <div className="flex-1 relative">
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Our Values</h3>
                <div className="flex flex-wrap gap-3 mt-5">
                  {["Integrity", "Respect", "Compassion", "Excellence", "Community", "Innovation"].map((val, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-xl bg-[var(--bg-soft)] border border-[var(--border)] text-sm font-bold text-[var(--fg-muted)] hover:text-rose-500 hover:border-rose-500/40 hover:bg-rose-500/5 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                    >
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