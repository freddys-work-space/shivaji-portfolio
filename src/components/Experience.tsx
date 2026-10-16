import { motion } from "framer-motion";
import { Award } from "lucide-react";
import RevealText from "./RevealText";

const dataLabLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' fill='none'%3E%3Crect width='40' height='40' rx='10' fill='%236366F1'/%3E%3Cpath d='M12 28L18 18L24 23L29 13' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='29' cy='13' r='2' fill='white'/%3E%3Ccircle cx='18' cy='18' r='2' fill='white'/%3E%3Ccircle cx='24' cy='23' r='2' fill='white'/%3E%3Ccircle cx='12' cy='28' r='2' fill='white'/%3E%3C/svg%3E";

const experiences = [
  {
    role: "JUNIOR DATA ANALYST",
    company: "DataLab Private Limited",
    period: "SEP 2025 – Present",
    logo: dataLabLogo,
    points: [
      "Analyze large datasets from relational databases comprising over 2 lakh rows daily to identify trends and support business decisions.",
      "Develop automated ETL pipelines using Python and SQL, reducing manual processing time by 40% while handling 1.5 million records per day.",
      "Visualize key performance indicators through 12 interactive Tableau dashboards accessed by 30+ cross functional users daily.",
      "Collaborate with product managers and engineers to define data requirements, aligning project scope for a team of eight stakeholders.",
      "Monitor data quality metrics, detecting and resolving anomalies to improve reliability of analytical outputs."
    ],
  },
];

const certifications = [
  {
    role: "POWER BI DATA ANALYST ASSOCIATE (PL-300)",
    issuer: "Microsoft Certified",
    period: "PL-300",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  },
  {
    role: "DATA ANALYTICS PROFESSIONAL CERTIFICATE",
    issuer: "Google Certified",
    period: "Google Career Certificate",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
];

const Experience = () => (
  <section id="experience" className="section-padding">
    <div className="max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-center mb-10"
      >
        <RevealText triggerOnView>Experience &amp; Certifications</RevealText>
      </motion.h2>

      <div className="space-y-8">
        {/* Work Experience Card */}
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.role}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="w-full"
          >
            <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden group border border-white/10">
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 bg-white p-2 border border-white/20">
                      <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-xl md:text-2xl text-foreground uppercase tracking-tight">
                        <RevealText triggerOnView delay={200}>{exp.role}</RevealText>
                      </h3>
                      <p className="text-foreground/90 font-bold text-base md:text-lg">
                        <RevealText triggerOnView delay={300}>{exp.company}</RevealText>
                      </p>
                    </div>
                  </div>

                  <RevealText triggerOnView delay={100} className="text-[10px] font-black tracking-[0.2em] uppercase text-accent-foreground bg-accent/40 px-5 py-2.5 rounded-full border border-accent/40 w-fit backdrop-blur-sm">
                    {exp.period}
                  </RevealText>
                </div>

                <div className="h-px w-full bg-border/50 mb-8" />

                <ul className="space-y-5">
                  {exp.points.map((p, idx) => (
                    <li key={idx} className="text-foreground/80 text-base md:text-lg flex items-start gap-4 group">
                      <span className="mt-2.5 w-2 h-2 rounded-full bg-accent group-hover:bg-primary shrink-0 shadow-[0_0_10px_rgba(var(--accent-rgb),0.8)] transition-all" />
                      <span className="font-bold leading-relaxed">
                        <RevealText triggerOnView delay={400 + idx * 50}>{p}</RevealText>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Clean Single Certifications Card without bullet points */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden group border border-white/10">
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Award className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-xl md:text-2xl text-foreground uppercase tracking-tight">
                      <RevealText triggerOnView delay={200}>Certifications</RevealText>
                    </h3>
                    <p className="text-foreground/90 font-bold text-base md:text-lg">
                      <RevealText triggerOnView delay={300}>Microsoft &amp; Google Certified</RevealText>
                    </p>
                  </div>
                </div>

                <RevealText triggerOnView delay={100} className="text-[10px] font-black tracking-[0.2em] uppercase text-accent-foreground bg-accent/40 px-5 py-2.5 rounded-full border border-accent/40 w-fit backdrop-blur-sm">
                  Verified Credentials
                </RevealText>
              </div>

              <div className="h-px w-full bg-border/50 mb-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {certifications.map((cert, cIdx) => (
                  <div
                    key={cert.role}
                    className="p-6 rounded-2xl bg-white/5 dark:bg-white/[0.03] border border-white/10 flex flex-col justify-between gap-5 hover:border-accent/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-2 border border-white/20 shrink-0 shadow-sm">
                        <img src={cert.logo} alt={cert.issuer} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[10px] font-black tracking-wider uppercase text-accent-foreground bg-accent/30 px-3 py-1.5 rounded-full border border-accent/30">
                        {cert.period}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading font-black text-base md:text-lg text-foreground uppercase tracking-tight leading-snug">
                        <RevealText triggerOnView delay={200 + cIdx * 100}>{cert.role}</RevealText>
                      </h4>
                      <p className="text-foreground/80 font-bold text-xs md:text-sm mt-1.5">
                        <RevealText triggerOnView delay={250 + cIdx * 100}>{cert.issuer}</RevealText>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Experience;
