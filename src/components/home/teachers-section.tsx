"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Users, Sparkles, Mail, Phone, BookOpen, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EASE = [0.22, 1, 0.36, 1] as const;

// Safe helper for initials
function getInitials(name: string) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
}

export function TeachersSection({ teachers }: { teachers: any[] }) {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">

      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 right-1/4 w-[520px] h-[520px] bg-[var(--primary)]/[0.06] rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-[420px] h-[420px] bg-amber-500/[0.06] rounded-full blur-[120px] pointer-events-none translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* Radial dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 65% 65% at 50% 50%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 65% at 50% 50%, #000 30%, transparent 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">

        {/* ================= SECTION HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-2xl"
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] shadow-sm shadow-black/[0.02] mb-5">
              <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--fg)]">Meet Our Faculty</span>
            </div>

            {/* 🎯 UPDATED HEADING */}
            <h2 className="text-4xl lg:text-6xl font-black font-display tracking-tight leading-[1.05]">
              Our Expert <br className="hidden sm:block" />
              <span className="gradient-text">Teachers.</span>
            </h2>

            <p className="mt-4 text-base lg:text-lg text-[var(--fg-muted)] font-medium max-w-xl leading-relaxed">
              Learn from passionate educators committed to unlocking every student's full potential.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link href="/teachers">
              <Button
                variant="outline"
                size="lg"
                className="relative rounded-xl font-bold group bg-[var(--card)]/70 backdrop-blur-md border-[var(--border)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] hover:shadow-lg hover:shadow-black/[0.04] hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04] overflow-hidden text-[12px] uppercase tracking-[0.14em]"
              >
                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
                {/* Hover aura */}
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-brand-500/[0.12] rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <span className="relative">View All Faculty</span>
                <ArrowRight
                  className="relative h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  strokeWidth={2.5}
                />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* ================= TEACHERS GRID ================= */}
        {teachers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative py-24 text-center border border-dashed border-[var(--border)] rounded-[3rem] bg-[var(--card)]/40 backdrop-blur-md flex flex-col items-center overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-500/[0.06] rounded-full blur-3xl pointer-events-none" />

            {/* Layered medallion icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 -m-3 bg-brand-500/10 rounded-full blur-2xl" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-brand-500/15 to-transparent ring-1 ring-brand-500/20 grid place-items-center">
                <div className="w-16 h-16 rounded-full bg-[var(--bg-soft)] ring-1 ring-[var(--border)] grid place-items-center">
                  <UserX className="h-8 w-8 text-[var(--fg-muted)] opacity-60" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-2 tracking-tight">No faculty members yet</h3>
            <p className="text-sm text-[var(--fg-muted)] max-w-sm mx-auto font-medium leading-relaxed">
              The administration will add faculty members soon. Please check back later.
            </p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {teachers.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (i % 4) * 0.06, duration: 0.6, ease: EASE }}
                className="relative group"
              >
                {/* Outer hover aura */}
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-brand-500/[0.12] via-transparent to-amber-500/[0.08] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

                {/* Main Link Wrapper */}
                <div className="relative block h-full">
                  <Link href={`/teachers/${t._id}`} className="absolute inset-0 z-0" aria-label={`View ${t.name}'s profile`} />

                  <div className="relative z-10 pointer-events-none rounded-[2rem] overflow-hidden bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] group-hover:border-[var(--primary)]/40 group-hover:shadow-2xl group-hover:shadow-black/[0.06] group-hover:-translate-y-1.5 transition-all duration-500 h-full flex flex-col">

                    {/* Top hairline edge-light */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent z-20 pointer-events-none" />

                    {/* ================= IMAGE SECTION ================= */}
                    <div className="relative aspect-[4/5] bg-[var(--bg-soft)] overflow-hidden">
                      {t.image ? (
                        <Image
                          src={t.image}
                          alt={t.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover group-hover:scale-[1.08] transition-transform duration-[900ms] ease-out"
                        />
                      ) : (
                        <div className="absolute inset-0 gradient-brand grid place-items-center text-white">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
                          <span className="relative text-6xl font-black tracking-tight drop-shadow-lg">
                            {getInitials(t.name)}
                          </span>
                        </div>
                      )}

                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                      {/* Subject Badge */}
                      {t.subject && (
                        <Badge
                          className="absolute top-3 left-3 z-10 bg-white/15 backdrop-blur-xl text-white border border-white/25 shadow-lg shadow-black/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] ring-1 ring-inset ring-white/20 rounded-full"
                        >
                          {t.subject}
                        </Badge>
                      )}

                      {/* Hover Contact Actions */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-auto">
                        {t.email && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = `mailto:${t.email}`;
                            }}
                            className="relative p-2.5 rounded-full bg-white/15 backdrop-blur-xl text-white hover:bg-[var(--primary)] hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20 border border-white/25 ring-1 ring-inset ring-white/20"
                            title="Send Email"
                          >
                            <Mail className="h-4 w-4" strokeWidth={2.5} />
                          </button>
                        )}
                        {t.phone && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = `tel:${t.phone}`;
                            }}
                            className="relative p-2.5 rounded-full bg-white/15 backdrop-blur-xl text-white hover:bg-emerald-500 hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20 border border-white/25 ring-1 ring-inset ring-white/20"
                            title="Call"
                          >
                            <Phone className="h-4 w-4" strokeWidth={2.5} />
                          </button>
                        )}
                        <button className="relative p-2.5 rounded-full bg-white/15 backdrop-blur-xl text-white hover:bg-[var(--primary)] hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20 border border-white/25 ring-1 ring-inset ring-white/20">
                          <BookOpen className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>

                    {/* ================= TEXT CONTENT ================= */}
                    <div className="relative p-5 sm:p-6 text-center flex-1 flex flex-col justify-center bg-gradient-to-b from-[var(--card)]/40 to-[var(--bg-soft)]/10">

                      {/* Inner top sheen */}
                      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent pointer-events-none" />

                      <h3 className="font-bold text-base sm:text-lg text-[var(--fg)] mb-1.5 truncate group-hover:text-[var(--primary)] transition-colors duration-300 tracking-tight leading-tight">
                        {t.name}
                      </h3>
                      <p className="text-[10px] font-black text-[var(--fg-muted)] uppercase tracking-[0.16em] truncate">
                        {t.designation || "Faculty Member"}
                      </p>
                    </div>

                    {/* Animated bottom accent bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1">
                      <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-[var(--primary)] to-amber-400 transition-all duration-700 rounded-r-full shadow-sm" />
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}