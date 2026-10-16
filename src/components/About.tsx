import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
const KEY_PREFIX_LENGTH = 3;

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  highlightClass?: string; // Tailwind classes for the colored pill
}

// ─── Word — renders with scroll-reveal opacity ────────────────────────────────
// If highlightClass is provided, the word gets a solid colored pill background.
const Word = ({ children, progress, range, highlightClass }: WordProps) => {
  const shouldReduceMotion = useReducedMotion();
  const opacity = useTransform(
    progress,
    range,
    shouldReduceMotion ? [1, 1] : [0, 1]
  );

  if (highlightClass) {
    return (
      <span className="relative mr-1 inline-block">
        {/* Ghost placeholder — same width, invisible */}
        {!shouldReduceMotion && (
          <span className={`invisible rounded-[6px] px-[6px] font-bold ${highlightClass}`}>
            {children}
          </span>
        )}
        {/* Animated highlighted pill */}
        <motion.span
          className={`absolute inset-0 rounded-[6px] px-[6px] font-bold flex items-center justify-center ${highlightClass}`}
          style={{ opacity }}
        >
          {children}
        </motion.span>
      </span>
    );
  }

  return (
    <span className="relative mr-[0.3em] inline-block">
      {!shouldReduceMotion && (
        <span className="text-foreground/10 font-bold">{children}</span>
      )}
      <motion.span
        className="absolute inset-0 text-foreground font-bold"
        style={{ opacity }}
      >
        {children}
      </motion.span>
    </span>
  );
};

// ─── ScrollRevealParagraph ────────────────────────────────────────────────────
interface ScrollRevealParagraphProps {
  paragraph: string;
  className?: string;
  highlights?: Record<string, string>; // word → Tailwind pill classes
}

// Strip leading/trailing punctuation to match the bare keyword
const cleanWord = (w: string) => w.replace(/^[^a-zA-Z0-9.]+|[^a-zA-Z0-9.]+$/g, "");

const ScrollRevealParagraph = ({
  paragraph,
  className = "",
  highlights,
}: ScrollRevealParagraphProps) => {
  const container = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"],
  });
  const words = paragraph.split(" ");
  return (
    <p className={`text-lg leading-relaxed ${className}`} ref={container}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end   = start + 1 / words.length;
        const hl    = highlights?.[cleanWord(word)];
        return (
          <Word
            key={`word-${i}-${word.slice(0, KEY_PREFIX_LENGTH)}`}
            progress={scrollYProgress}
            range={[start, end]}
            highlightClass={hl}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

// ─── Content ──────────────────────────────────────────────────────────────────
const SUMMARY =
  "Aspiring Data Analyst with a strong foundation in Python, SQL, Excel, Tableau, and Power BI. Enjoys working with data to uncover patterns, solve problems, and find meaningful insights. Has developed projects focused on ride-sharing optimization and customer churn analysis, applying data cleaning, visualization, and statistical techniques to real-world problems. Eager to use analytical skills to help businesses make better, data-driven decisions while continuing to grow in the field of data analytics.";

const SKILLS = [
  {
    label: "Programming & Tools",
    detail: "Python, Excel, Tableau, Power BI, SQL, Matplotlib.",
  },
  {
    label: "Data Management & Engineering",
    detail: "Data Extraction, Data Cleaning, Data Manipulation, Data Aggregation, Data Transformation, Data Profiling, Relational Database Optimization, PostgreSQL.",
  },
  {
    label: "Statistical & Machine Learning Techniques",
    detail: "Classification, Clustering Techniques, Regression Analysis, Statistical Modeling, Hypothesis Testing, Exploratory Data Analysis (EDA).",
  },
  {
    label: "Data Visualization & Dashboarding",
    detail: "Tableau, Power BI, Matplotlib, Dashboard Design, Interactive Dashboards, Data Visualization, Insight Presentation, KPI Metrics, Trend Analysis.",
  },
  {
    label: "Business Analytics & Domain Techniques",
    detail: "Marketing Analytics, Customer Segmentation, Churn Analysis, Seasonal Analysis, Geospatial Analysis, Sentiment Analysis.",
  },
  {
    label: "Certifications",
    detail: "Power BI Data Analyst Associate (PL-300) | Microsoft, Data Analytics Professional Certificate | Google.",
  },
];

// ─── Highlight maps ───────────────────────────────────────────────────────────
// Solid colored pills — key = bare word (no punctuation), value = Tailwind classes
const SUMMARY_HIGHLIGHTS: Record<string, string> = {
  "Python":      "bg-blue-500   text-white",
  "SQL":         "bg-orange-500 text-white",
  "Excel":       "bg-emerald-600 text-white",
  "Tableau":     "bg-indigo-500 text-white",
  "Power":       "bg-amber-500  text-white",
  "BI":          "bg-amber-500  text-white",
  "patterns":    "bg-violet-500 text-white",
  "insights":    "bg-cyan-500   text-white",
  "data-driven": "bg-indigo-600 text-white",
  "churn":       "bg-rose-500   text-white",
};

const SKILL_HIGHLIGHTS: Record<string, string> = {
  "Python":      "bg-blue-500   text-white",
  "SQL":         "bg-orange-500 text-white",
  "Excel":       "bg-emerald-600 text-white",
  "Tableau":     "bg-indigo-500 text-white",
  "Power":       "bg-amber-500  text-white",
  "BI":          "bg-amber-500  text-white",
  "PostgreSQL":  "bg-blue-600   text-white",
  "Matplotlib":  "bg-teal-500   text-white",
  "EDA":         "bg-purple-500 text-white",
  "KPI":         "bg-pink-500   text-white",
  "Microsoft":   "bg-sky-500    text-white",
  "Google":      "bg-red-500    text-white",
};

// ─── About section ────────────────────────────────────────────────────────────
const About = () => (
  <section id="about" className="section-padding">
    <div className="max-w-4xl mx-auto space-y-10">

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-center"
      >
        About Me
      </motion.h2>

      {/* Professional Summary */}
      <div className="space-y-5">
        <motion.h3
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground"
        >
          Professional Summary
        </motion.h3>

        <ScrollRevealParagraph
          paragraph={SUMMARY}
          highlights={SUMMARY_HIGHLIGHTS}
          className="text-foreground/90"
        />
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-px bg-border origin-left"
      />

      {/* Technical Skills */}
      <div className="space-y-6">
        <motion.h3
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground"
        >
          Technical Skills
        </motion.h3>

        <div className="space-y-6">
          {SKILLS.map((skill, i) => (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <ScrollRevealParagraph
                paragraph={`${skill.label}: ${skill.detail}`}
                highlights={SKILL_HIGHLIGHTS}
                className="text-base text-foreground/85"
              />
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  </section>
);

export default About;
