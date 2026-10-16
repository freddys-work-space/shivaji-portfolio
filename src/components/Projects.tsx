import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import project1Img from "/rideit.jpg";
import project2Img from "/credticard.jpeg";
import project3Img from "/airbnb.jpg";
const projects = [
  {
    title: "Ride IT Analysis",
    desc: "Developed an end-to-end data pipeline in Python and SQL to profile, clean, and transform ride‑booking, cancellation, driver, and rating datasets. Engineered an executive KPI suite and trend analyses in Tableau and Power BI, enabling leadership to track retention and operation metrics.",
    tools: ["Python", "SQL", "Tableau", "Power BI", "Data Pipelines"],
    impact: "Reduced data preparation time by 30% and enabled a 12% increase in driver retention",
    image: project1Img,
  },
  {
    title: "Credit Card Customer Churn",
    desc: "Built a machine learning predictive churn model in Python leveraging SQL-extracted demographic and usage variables. Segmented high‑risk customers by utilization patterns, income, and age into actionable cohorts with interactive dashboards.",
    tools: ["Python", "SQL", "Power BI", "Tableau", "Predictive ML"],
    impact: "Achieved 85% model accuracy and reduced projected churn by 8% via targeted retention",
    image: project2Img,
  },
  {
    title: "Airbnb Data Analysis",
    desc: "Developed Python and SQL pipelines to analyze Airbnb market listings, identifying key amenity and presentation factors that lifted booking prices. Performed geospatial and seasonal trend analysis with Tableau and interactive Power BI dashboards.",
    tools: ["Python", "SQL", "Tableau", "Power BI", "Matplotlib"],
    impact: "Identified listing factors lifting prices by 15% and boosted property occupancy by 10%",
    image: project3Img,
  },
];

const Projects = () => (
  <section id="projects" className="section-padding">
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-center mb-16"
      >
        Featured Projects
      </motion.h2>

      {/* Vertical alternating list */}
      <div className="flex flex-col gap-24 lg:gap-32">
        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-12 lg:gap-20 items-center`}
          >
            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative group">
              <div className="relative aspect-video overflow-hidden rounded-3xl border border-border/50 shadow-2xl">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* External Link Overlay */}
                <div className="absolute top-6 right-6 z-20 glass-card p-3 rounded-full shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <ExternalLink className="w-5 h-5 text-foreground" />
                </div>
              </div>

              {/* Decorative accent behind the image */}
              <div className="absolute -inset-4 bg-accent/5 -z-10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <div className="inline-block px-4 py-1.5 bg-accent/10 rounded-full text-accent-foreground text-xs font-bold tracking-wider mb-6 w-fit uppercase">
                Project {i + 1}
              </div>

              <h3 className="font-heading font-black text-4xl md:text-5xl text-gradient mb-8 leading-tight uppercase">
                {p.title}
              </h3>

              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                {p.desc}
              </p>

              <div className="flex flex-wrap gap-2.5 mb-8">
                {p.tools.map((t) => (
                  <span key={t} className="bg-primary/5 border border-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full">
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-6 border-t border-border/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">🚀</span>
                  <div>
                    <p className="text-sm font-bold text-foreground">IMPACT &amp; ACHIEVEMENT</p>
                    <p className="text-muted-foreground text-base mt-1 italic">{p.impact}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
