import { motion } from "framer-motion";
import { GraduationCap, Calendar, Star } from "lucide-react";
import RevealText from "./RevealText";

const education = [
  {
    degree: "Master Of Computer Applications",
    school: "Dundalk Institute of Technology | Dundalk City",
    icon: GraduationCap,
    video: "/selfigraduates.mp4",
    period: "Sep 2024 – May 2026",
    cgpa: "First Class Honours",
    label: "Post Graduation"
  },
  {
    degree: "Bachelor Of Technology",
    school: "CBIT | Hyderabad",
    icon: GraduationCap,
    video: "/Education_People.mp4",
    period: "Jun 2019 – Aug 2023",
    cgpa: "7.34",
    label: "Under Graduation"
  },
];

const Education = () => {
  return (
    <section id="education" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-10"
        >
          <RevealText triggerOnView>Education</RevealText>
        </motion.h2>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {education.map((e, i) => (
            <motion.div
              key={e.degree}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card rounded-3xl p-6 relative overflow-hidden group min-h-[260px] flex flex-col justify-end border border-white/10"
            >
              {/* Background Video */}
              <div className="absolute inset-0 z-0">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover filter blur-[2px] opacity-40 transform scale-110 group-hover:scale-100 transition-transform duration-1000"
                >
                  <source src={e.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-white/20 shadow-lg shrink-0">
                      <GraduationCap className="w-6 h-6 text-[#030303]" />
                    </div>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent-foreground/90">{e.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#FFD700]/10 px-3 py-1.5 rounded-full border border-[#FFD700]/20 backdrop-blur-md">
                    <Star className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
                    <span className="text-xs font-bold text-[#FFD700]">CGPA {e.cgpa}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground text-2xl md:text-3xl leading-tight">
                    <RevealText triggerOnView delay={200}>{e.degree}</RevealText>
                  </h3>
                  <p className="text-muted-foreground text-base font-semibold">
                    <RevealText triggerOnView delay={300}>{e.school}</RevealText>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground/80 mt-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-bold tracking-wide">{e.period}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
