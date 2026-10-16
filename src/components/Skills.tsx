import { motion } from "framer-motion";
import RevealText from "./RevealText";

const categories = [
  {
    title: "Programming & Tools",
    skills: ["Python", "SQL", "Excel", "Tableau", "Power BI", "Matplotlib"],
  },
  {
    title: "Data Management & Engineering",
    skills: ["Data Extraction", "Data Cleaning", "Data Transformation", "Data Profiling", "PostgreSQL", "Database Optimization"],
  },
  {
    title: "Statistical & Machine Learning",
    skills: ["Classification", "Clustering", "Regression Analysis", "Statistical Modeling", "Hypothesis Testing", "EDA"],
  },
  {
    title: "Visualization & Dashboards",
    skills: ["Tableau", "Power BI", "Matplotlib", "Dashboard Design", "Interactive Dashboards", "KPI Metrics", "Trend Analysis"],
  },
  {
    title: "Business Analytics & Domains",
    skills: ["Marketing Analytics", "Customer Segmentation", "Churn Analysis", "Seasonal Analysis", "Geospatial Analysis", "Sentiment Analysis"],
  },
  {
    title: "Certifications & Credentials",
    skills: ["PL-300 Power BI Associate", "Google Data Analytics", "ETL Pipelines", "Git & GitHub Workflows"],
  },
];

// ─── Logos — colorful, matching actual data analyst skill set ─────────────
const logos = [
  {
    name: "Python",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    glow: "rgba(55,118,171,0.22)",
  },
  {
    name: "PostgreSQL",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    glow: "rgba(51,103,145,0.22)",
  },
  {
    name: "Pandas",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
    glow: "rgba(21,19,74,0.22)",
  },
  {
    name: "NumPy",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
    glow: "rgba(77,171,207,0.22)",
  },
  {
    name: "Matplotlib",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg",
    glow: "rgba(18,134,166,0.22)",
  },
  {
    name: "Jupyter",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
    glow: "rgba(243,118,38,0.22)",
  },
  {
    name: "SQLite",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
    glow: "rgba(0,59,85,0.22)",
  },
  {
    name: "R",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg",
    glow: "rgba(39,109,195,0.22)",
  },
  {
    name: "Git",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    glow: "rgba(240,80,50,0.22)",
  },
  {
    name: "GitHub",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    glow: "rgba(200,200,200,0.15)",
  },
  {
    name: "Linux",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    glow: "rgba(254,204,0,0.22)",
  },
  {
    name: "VS Code",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    glow: "rgba(0,122,204,0.22)",
  },
];

const Skills = () => (
  <section id="skills" className="section-padding overflow-hidden">

    {/* Heading — stays centered in container */}
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-center mb-10"
      >
        Skills &amp; Expertise
      </motion.h2>
    </div>

    {/* ── Full-width Marquee ───────────────────────────────────────────── */}
    <div className="relative mb-12 py-6 w-screen left-1/2 -translate-x-1/2">
      {/* Soft edge masks */}
      <div className="absolute inset-y-0 left-0 w-36 md:w-56 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-36 md:w-56 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="flex overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          className="flex flex-nowrap gap-16 items-center flex-shrink-0"
        >
          {[...logos, ...logos].map((logo, index) => (
            <motion.div
              key={`${logo.name}-${index}`}
              whileHover={{ scale: 1.18, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center gap-3 flex-shrink-0 cursor-default"
            >
              <img
                src={logo.url}
                alt={logo.name}
                className="h-12 w-12 md:h-14 md:w-14 object-contain drop-shadow-lg"
                loading="lazy"
              />
              <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/70">
                {logo.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>

    {/* Category cards — back in container */}
    <div className="max-w-6xl mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-3xl p-6"
          >
            <h3 className="font-heading font-semibold mb-4 text-foreground">{cat.title}</h3>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-accent/40 text-accent-foreground text-xs font-semibold px-4 py-1.5 rounded-full border border-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
