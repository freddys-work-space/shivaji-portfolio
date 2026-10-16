"use client";

/**
 * InversionCircleScrollAnimation
 *
 * Scroll-driven animation merged from:
 *   +page.svelte                  → hero circle animation
 *   ContentSection.svelte         → scroll-reveal section
 *   Button.svelte                 → CTA button
 *
 * How it works:
 *   The wrapper div is the scroll container (overflow-y:scroll, height:100vh) or in-page track.
 *   Inside it lives a 250vh-300vh scroll track. The hero section is sticky inside
 *   that track, so it stays pinned while the track scrolls past.
 *
 *   Phase 1 (scroll 0→viewH):
 *     A black circle rises from below the screen to dead-centre.
 *     Easing: Power4 InOut (slow → fast → slow).
 *
 *   Phase 2 (scroll viewH→2×viewH):
 *     The circle expands from 380px diameter until it fills the screen.
 *     Easing: ease-in² (accelerates as it grows).
 *
 *   A CSS clip-path mirrors the circle position exactly, revealing
 *   white text inside the black circle → colour inversion effect.
 *
 *   Below the hero a ContentSection fades in (black→white background)
 *   when 35% of it enters the viewport.
 */

import React, { useEffect, useRef, useState } from "react";
import { UploadCloud, Target, Video, Share2, ArrowRight } from "lucide-react";

// ─── constants ────────────────────────────────────────────────────────────────
const BALL_SIZE = 380; // px — fixed diameter during Phase 1 travel

interface StepItem {
  step: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DEFAULT_STEPS: StepItem[] = [
  {
    step: "01",
    title: "Upload & Parse",
    desc: "Drag-and-drop your current PDF resume. Our neural parser automatically extracts and structures your data.",
    icon: UploadCloud,
  },
  {
    step: "02",
    title: "Target a Job",
    desc: "Paste the job description of your dream role. The engine matches requirements and highlights missing keywords.",
    icon: Target,
  },
  {
    step: "03",
    title: "Record Intro",
    desc: "Draft your speech script with AI assistance. Record your pitch on screen with our built-in video teleprompter.",
    icon: Video,
  },
  {
    step: "04",
    title: "Publish & Apply",
    desc: "Generate an ATS-compliant PDF and share a direct link with recruiters to view your video introduction.",
    icon: Share2,
  },
];

// ─── root export ──────────────────────────────────────────────────────────────
export default function InversionCircleScrollAnimation({
  standalone = false,
  title = "4 Steps to Get Hired.",
  subtitle = "Scroll to reveal the simplified workflow.",
  steps = DEFAULT_STEPS,
  ctaText = "Get started",
  ctaLink = "#pricing",
}: {
  standalone?: boolean;
  title?: string;
  subtitle?: string;
  steps?: StepItem[];
  ctaText?: string;
  ctaLink?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Styles />
      <div
        ref={containerRef}
        className={standalone ? "icsa-wrap" : "icsa-page-track relative w-full bg-white"}
      >
        <HeroSection
          containerRef={containerRef}
          standalone={standalone}
          title={title}
          subtitle={subtitle}
        />
        <ContentSection
          containerRef={containerRef}
          steps={steps}
          ctaText={ctaText}
          ctaLink={ctaLink}
        />
      </div>
    </>
  );
}

// ─── HeroSection ──────────────────────────────────────────────────────────────
type ContainerRef = React.RefObject<HTMLDivElement | null>;

function HeroSection({
  containerRef,
  standalone,
  title,
  subtitle,
}: {
  containerRef: ContainerRef;
  standalone: boolean;
  title: string;
  subtitle: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [viewH, setViewH] = useState(600);
  const [viewW, setViewW] = useState(800);

  useEffect(() => {
    const el = standalone ? containerRef.current : trackRef.current;
    if (!el) return;

    const measure = () => {
      setViewH(window.innerHeight || 600);
      setViewW(window.innerWidth || 800);
    };
    measure();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(document.body);
    }

    const onScroll = () => {
      if (standalone && containerRef.current) {
        setScrollY(containerRef.current.scrollTop);
      } else if (trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        const dist = Math.max(0, -rect.top);
        setScrollY(dist);
      }
    };

    if (standalone && containerRef.current) {
      containerRef.current.addEventListener("scroll", onScroll, { passive: true });
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", measure, { passive: true });
    }

    onScroll();

    return () => {
      if (ro) ro.disconnect();
      if (standalone && containerRef.current) {
        containerRef.current.removeEventListener("scroll", onScroll);
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", measure);
      }
    };
  }, [containerRef, standalone]);

  // phase progress 0 → 1
  const p1 = clamp(scrollY / (viewH || 1));
  const p2 = clamp((scrollY - (viewH || 1)) / (viewH || 1));

  // Power4 InOut
  const p1e = p1 < 0.5 ? 8 * p1 ** 4 : 1 - (-2 * p1 + 2) ** 4 / 2;
  // ease-in²
  const p2e = p2 * p2;

  // geometry
  const yOff = (1 - p1e) * (viewH / 2 + BALL_SIZE / 2);
  const coverSize = Math.max(viewW, viewH) * 2.8;
  const ballSize = BALL_SIZE + p2e * (coverSize - BALL_SIZE);
  const clipX = viewW / 2;
  const clipY = viewH / 2 + yOff;
  const clipR = ballSize / 2;

  return (
    <div ref={trackRef} className="icsa-track">
      <section className="icsa-hero">
        {/* expanding black circle */}
        <div
          className="icsa-ball"
          style={{
            width: ballSize,
            height: ballSize,
            transform: `translate(-50%, calc(-50% + ${yOff}px))`,
          }}
        />

        {/* black text — always visible */}
        <div className="icsa-layer icsa-dark">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {/* white text — clipped to the circle (inversion) */}
        <div
          className="icsa-layer icsa-light"
          style={{ clipPath: `circle(${clipR}px at ${clipX}px ${clipY}px)` }}
        >
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </section>
    </div>
  );
}

// ─── ContentSection ───────────────────────────────────────────────────────────
function ContentSection({
  containerRef,
  steps,
  ctaText,
  ctaLink,
}: {
  containerRef: ContainerRef;
  steps: StepItem[];
  ctaText: string;
  ctaLink: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setOn(true);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [containerRef]);

  return (
    <section ref={ref} id="how-it-works" className={`icsa-cs${on ? " on" : ""}`}>
      <div className="icsa-inner">
        {/* 4 Steps Cards Grid */}
        <div className="icsa-cards-grid">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="icsa-card">
                <span className="icsa-card-num">{s.step}</span>
                <div className="icsa-card-icon-wrap">
                  <Icon className="w-5 h-5 text-[#0A192F]" />
                </div>
                <div className="icsa-card-content">
                  <span className="icsa-card-badge">Step {s.step}</span>
                  <h3 className="icsa-card-title">{s.title}</h3>
                  <p className="icsa-card-desc">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <CTAButton text={ctaText} link={ctaLink} />
      </div>
    </section>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
function CTAButton({ text, link }: { text: string; link: string }) {
  return (
    <a href={link} className="icsa-btn inline-flex items-center gap-2 no-underline">
      <span>{text}</span>
      <ArrowRight className="w-4 h-4" />
    </a>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────────
const clamp = (v: number) => Math.min(1, Math.max(0, v));

// ─── styles ───────────────────────────────────────────────────────────────────
function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

      .icsa-wrap *, .icsa-wrap *::before, .icsa-wrap *::after,
      .icsa-page-track *, .icsa-page-track *::before, .icsa-page-track *::after {
        box-sizing: border-box;
      }

      .icsa-wrap {
        width: 100%; height: 100vh;
        overflow-y: scroll; overflow-x: clip;
        font-family: Inter, sans-serif;
        background: #fff;
      }

      .icsa-page-track {
        position: relative;
        width: 100%;
        font-family: Inter, sans-serif;
      }

      /* 250vh scroll room; hero sticks inside */
      .icsa-track { height: 260vh; position: relative; }

      /* pinned hero */
      .icsa-hero {
        position: sticky; top: 0;
        height: 100vh; overflow: hidden;
      }

      /* ball */
      .icsa-ball {
        position: absolute; top: 50%; left: 50%;
        border-radius: 50%; background: #0A0A0E;
        will-change: transform, width, height;
      }

      /* text layers */
      .icsa-layer {
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        text-align: center; padding: 0 2rem;
        pointer-events: none;
      }
      .icsa-dark  { color: #0A192F; z-index: 2; }
      .icsa-light { color: #fff; z-index: 3; will-change: clip-path; }

      .icsa-layer h1 {
        font-size: clamp(2.5rem, 6.5vw, 5.5rem);
        font-weight: 900; letter-spacing: -0.03em; line-height: 1.05;
        text-transform: uppercase;
      }
      .icsa-layer p {
        font-size: clamp(1rem, 2vw, 1.35rem);
        font-weight: 500; margin-top: 1.25rem; opacity: .8;
      }

      /* ── content section ── */
      .icsa-cs {
        min-height: 100vh;
        display: flex; align-items: center; justify-content: center;
        padding: 6rem 1.5rem;
        background: #0A0A0E; color: #fff;
        transition: background 1.8s cubic-bezier(.25,0,.1,1),
                    color      1.8s cubic-bezier(.25,0,.1,1);
      }
      .icsa-cs.on { background: #f8fafc; color: #0f172a; }

      .icsa-inner {
        max-width: 1200px; width: 100%; text-align: center;
        display: flex; flex-direction: column;
        align-items: center; gap: 1.5rem;
      }

      .icsa-inner > * {
        opacity: 0; transform: translateY(24px);
        transition: opacity .7s ease, transform .7s ease;
      }
      .icsa-cs.on .icsa-inner > * { opacity: 1; transform: translateY(0); }

      .icsa-cs.on .icsa-label      { transition-delay: .10s; }
      .icsa-cs.on h2               { transition-delay: .20s; }
      .icsa-cs.on p                { transition-delay: .30s; }
      .icsa-cs.on .icsa-cards-grid { transition-delay: .40s; }
      .icsa-cs.on .icsa-btn        { transition-delay: .55s; }

      .icsa-label {
        font-size: .75rem; font-weight: 700;
        letter-spacing: .22em; text-transform: uppercase;
        color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe;
        padding: 6px 18px; rounded-full: 9999px; border-radius: 9999px;
      }
      .icsa-inner h2 {
        font-size: clamp(2.25rem, 5vw, 3.8rem);
        font-weight: 900; letter-spacing: -.03em; line-height: 1.1;
        text-transform: uppercase;
      }
      .icsa-inner p {
        font-size: clamp(0.95rem, 1.8vw, 1.15rem);
        line-height: 1.6; opacity: .75; max-width: 620px;
      }

      /* 4 Cards Grid */
      .icsa-cards-grid {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: 1.5rem;
        width: 100%;
        margin-top: 1.5rem;
      }

      @media (min-width: 768px) {
        .icsa-cards-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (min-width: 1024px) {
        .icsa-cards-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }

      .icsa-card {
        position: relative;
        background: #ffffff;
        border: 1px solid rgba(226, 232, 240, 0.9);
        border-radius: 24px;
        padding: 2.25rem 1.5rem 1.75rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
        overflow: visible;
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      }

      .icsa-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 40px rgba(37, 99, 235, 0.12);
        border-color: #93c5fd;
      }

      .icsa-card-num {
        position: absolute;
        right: 0.75rem;
        top: -0.5rem;
        font-size: 5.5rem;
        font-weight: 900;
        line-height: 1;
        color: #f1f5f9;
        pointer-events: none;
        user-select: none;
      }

      .icsa-card-icon-wrap {
        position: absolute;
        top: -1.25rem;
        left: 1.5rem;
        width: 3rem;
        height: 3rem;
        border-radius: 14px;
        background: #FFBF52;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 20px rgba(255, 191, 82, 0.35);
        z-index: 10;
        transition: transform 0.3s ease;
      }

      .icsa-card:hover .icsa-card-icon-wrap {
        transform: scale(1.1);
      }

      .icsa-card-content {
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        width: 100%;
        margin-top: 0.5rem;
      }

      .icsa-card-badge {
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: #2563eb;
        background: #eff6ff;
        border: 1px solid #dbeafe;
        padding: 3px 10px;
        border-radius: 9999px;
        align-self: flex-start;
      }

      .icsa-card-title {
        font-size: 1.15rem;
        font-weight: 800;
        color: #0f172a;
        text-transform: uppercase;
        letter-spacing: 0.02em;
      }

      .icsa-card-desc {
        font-size: 0.85rem;
        font-weight: 500;
        color: #475569;
        line-height: 1.55;
      }

      /* button */
      .icsa-btn {
        background: #0A192F;
        color: #fff;
        padding: 12px 32px;
        border-radius: 9999px;
        border: none;
        cursor: pointer;
        font-family: Inter, sans-serif;
        font-size: 0.95rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        box-shadow: 0 10px 25px rgba(10, 25, 47, 0.2);
        transition: opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
        margin-top: 1rem;
      }
      .icsa-btn:hover {
        background: #2563eb;
        transform: translateY(-2px);
      }
      .icsa-btn:active {
        transform: translateY(0);
      }
    `}</style>
  );
}
