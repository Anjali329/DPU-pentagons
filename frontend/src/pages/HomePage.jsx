import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Upload, BarChart3, Shield,
  Users, BookOpen, Brain, ArrowRight,
  Fingerprint, ChevronRight
} from 'lucide-react'
import { HeroGeometric } from '../components/ui/shape-landing-hero'
import { Header } from '../components/ui/header-2'

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
   ───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
}

/* ─────────────────────────────────────────────
   HERO SECTION
   ───────────────────────────────────────────── */
function HeroSection() {
  return (
    <HeroGeometric
      badge="Forensics Built for Academics"
      title1="Detect Academic"
      title2="Dishonesty Instantly"
      description="Use AI to uncover plagiarism, writing inconsistencies, and citation anomalies in academic papers."
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-2 w-full">
        <Link
          to="/upload"
          className="
            inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full
            text-[15px] font-semibold text-white no-underline
            shadow-[0_4px_14px_0_rgba(99,102,241,0.39)]
            transition-all duration-200
            hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5
            active:scale-[0.97]
          "
          style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
        >
          Upload Paper
          <ArrowRight className="w-4 h-4" />
        </Link>

        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center gap-2 text-[15px] font-medium text-slate-500 hover:text-indigo-600 transition-colors no-underline"
        >
          How it Works
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </HeroGeometric>
  )
}

/* ─────────────────────────────────────────────
   HOW IT WORKS
   ───────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Paper',
      description: 'Drop your academic paper in PDF or DOCX format. Keep it simple and secure.',
      step: '01',
    },
    {
      icon: Brain,
      title: 'Analyze Content',
      description: 'AI runs stylometric analysis and checks citations without manual effort.',
      step: '02',
    },
    {
      icon: BarChart3,
      title: 'Review Insights',
      description: 'Read the detailed forensic report with mapped anomalies and source matches.',
      step: '03',
    },
  ]

  return (
    <section
      id="how-it-works"
      className="w-full py-24 md:py-28 bg-white border-y border-slate-100"
    >
      <div className="w-full max-w-[1080px] mx-auto px-6 md:px-8">

        {/* Section Header */}
        <motion.div
          className="w-full flex flex-col items-center text-center mb-16 md:mb-20"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-bold tracking-tight text-slate-900">
            Simple, Transparent Process
          </h2>
          <p className="text-slate-400 text-[15px] mt-4 max-w-md">
            Three easy steps from paper upload to full forensic insight.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {steps.map(({ icon: Icon, title, description, step }, i) => (
            <motion.div
              key={title}
              variants={fadeUp}
              custom={i}
              className="flex flex-col items-center text-center w-full"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#f8fafc] border border-slate-100 flex items-center justify-center mb-5 shadow-sm flex-shrink-0">
                <Icon className="w-6 h-6 text-slate-700" />
              </div>
              <span className="text-[11px] font-bold text-slate-300 tracking-[0.2em] uppercase mb-2">
                {step}
              </span>
              <h3 className="text-[17px] font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-[14px] text-slate-500 leading-[1.7] max-w-[260px] mx-auto">
                {description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   FEATURES
   ───────────────────────────────────────────── */
function Features() {
  const features = [
    {
      icon: Fingerprint,
      title: 'Stylometric Analysis',
      description: 'Detect writing style changes across sections using linguistic fingerprinting.',
      accent: true
    },
    {
      icon: Users,
      title: 'Multi-Author Detection',
      description: 'Identify contributions from multiple writers through statistical sentence analysis.',
      accent: false
    },
    {
      icon: BookOpen,
      title: 'Citation Tracking',
      description: 'Verify references against major academic databases automatically.',
      accent: false
    },
    {
      icon: Shield,
      title: 'AI Risk Scoring',
      description: 'Receive a comprehensive integrity score based on forensic dimensions.',
      accent: true
    },
  ]

  return (
    <section
      id="features"
      className="w-full py-24 md:py-28 bg-[#f8fafc] border-b border-slate-100"
    >
      <div className="w-full max-w-[1080px] mx-auto px-6 md:px-8">

        {/* Section Header */}
        <motion.div
          className="w-full flex flex-col items-center text-center mb-16 md:mb-20"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-bold tracking-tight text-slate-900">
            Powerful Forensic Tools
          </h2>
          <p className="text-slate-400 text-[15px] mt-4 max-w-md">
            A complete suite of AI-powered analysis capabilities at your fingertips.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {features.map(({ icon: Icon, title, description, accent }, i) => (
            <motion.div key={title} variants={fadeUp} custom={i} className="w-full">
              <div className="
                w-full bg-white rounded-2xl border border-slate-200
                p-8 md:p-10 h-full
                flex flex-col items-center text-center
                transition-all duration-300
                hover:shadow-lg hover:-translate-y-1 hover:border-slate-300
              ">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-5 flex-shrink-0
                  ${accent ? 'bg-indigo-50 border border-indigo-100/50' : 'bg-slate-50 border border-slate-100'}
                `}>
                  <Icon className={`w-5 h-5 ${accent ? 'text-indigo-600' : 'text-slate-600'}`} />
                </div>
                <h3 className="text-[17px] font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-[14px] text-slate-500 leading-[1.7] max-w-[320px] mx-auto">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   CTA SECTION
   ───────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="w-full py-24 md:py-32 bg-white border-t border-slate-100">
      <div className="w-full max-w-[1080px] mx-auto px-6 md:px-8">
        <motion.div
          className="w-full flex flex-col items-center text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-bold tracking-tight text-slate-900 mb-5 max-w-[560px]">
            Start analyzing your paper today
          </h2>
          <p className="text-[16px] md:text-[18px] text-slate-500 leading-[1.6] mb-10 max-w-[480px]">
            Get instant insights with AI-powered forensic analysis.
          </p>
          <Link
            to="/upload"
            className="
              inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full
              text-[15px] font-semibold text-white no-underline
              shadow-[0_4px_14px_0_rgba(99,102,241,0.3)]
              transition-all duration-200
              hover:shadow-lg hover:-translate-y-0.5
              active:scale-[0.97]
            "
            style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
          >
            Get Started Now
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="w-full py-10 md:py-12 bg-[#f8fafc] border-t border-slate-200">
      <div className="w-full max-w-[1080px] mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-[16px] font-bold text-slate-900 tracking-tight">
            Forens<span className="text-indigo-600">IQ</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-8">
          <a href="#how-it-works" className="text-[14px] text-slate-500 hover:text-slate-800 transition-colors no-underline">
            How It Works
          </a>
          <a href="#features" className="text-[14px] text-slate-500 hover:text-slate-800 transition-colors no-underline">
            Features
          </a>
          <a href="#" className="text-[14px] text-slate-500 hover:text-slate-800 transition-colors no-underline">
            Contact
          </a>
        </div>

        {/* Copyright */}
        <p className="text-[13px] text-slate-400 flex-shrink-0">
          © {new Date().getFullYear()} ForensIQ
        </p>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────
   HOMEPAGE
   ───────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f8fafc]">
      <Header />
      <HeroSection />
      <HowItWorks />
      <Features />
      <CTASection />
      <Footer />
    </div>
  )
}