import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, Mail, Sparkles, Download } from "lucide-react";
import ParticleButton from "./ui/particle-button";
import { useEffect, useRef } from "react";
import profileImg from "/chshivaji.png";
import { cn } from "@/lib/utils";
import ScrambleHover from "./ui/ScrambleHover";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
  borderRadius = 16,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  borderRadius?: number;
}) {
  return (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
        rotate,
      }}
      className={cn("absolute", className)}
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        className="relative"
        style={{
          width,
          height,
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[1px]",
            "ring-1 ring-white/[0.03] dark:ring-white/[0.02]",
            "shadow-[0_2px_16px_-2px_rgba(255,255,255,0.04)]",
            "after:absolute after:inset-0",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_70%)]",
            "after:rounded-[inherit]"
          )}
          style={{ borderRadius }}
        />
      </motion.div>
    </motion.div>
  );
}

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 100, damping: 30, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const imgX = useTransform(smoothX, [0, 1], [-15, 15]);
  const imgY = useTransform(smoothY, [0, 1], [-15, 15]);
  const floatX = useTransform(smoothX, [0, 1], [20, -20]);
  const floatY = useTransform(smoothY, [0, 1], [15, -15]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 sm:px-6 pt-16 pb-8 bg-white dark:bg-[#030303]"
    >
      {/* Ambient background blurs */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] via-transparent to-rose-500/[0.02] blur-3xl dark:from-indigo-500/[0.05] dark:via-transparent dark:to-rose-500/[0.05] pointer-events-none" />

      {/* Elegant Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Tall rectangle - top left */}
        <ElegantShape
          borderRadius={24}
          className="top-[-10%] left-[-15%]"
          delay={0.3}
          gradient="from-indigo-500/[0.25] dark:from-indigo-500/[0.35]"
          height={500}
          rotate={-8}
          width={300}
        />

        {/* Wide rectangle - bottom right */}
        <ElegantShape
          borderRadius={20}
          className="right-[-20%] bottom-[-5%]"
          delay={0.5}
          gradient="from-rose-500/[0.25] dark:from-rose-500/[0.35]"
          height={200}
          rotate={15}
          width={600}
        />

        {/* Square - middle left */}
        <ElegantShape
          borderRadius={32}
          className="top-[40%] left-[-5%]"
          delay={0.4}
          gradient="from-violet-500/[0.25] dark:from-violet-500/[0.35]"
          height={300}
          rotate={24}
          width={300}
        />

        {/* Small rectangle - top right */}
        <ElegantShape
          borderRadius={12}
          className="top-[5%] right-[10%]"
          delay={0.6}
          gradient="from-amber-500/[0.25] dark:from-amber-500/[0.35]"
          height={100}
          rotate={-20}
          width={250}
        />

        {/* Medium rectangle - center right */}
        <ElegantShape
          borderRadius={16}
          className="top-[45%] right-[-10%]"
          delay={0.7}
          gradient="from-emerald-500/[0.25] dark:from-emerald-500/[0.35]"
          height={150}
          rotate={35}
          width={400}
        />

        {/* Small square - bottom left */}
        <ElegantShape
          borderRadius={28}
          className="bottom-[10%] left-[20%]"
          delay={0.2}
          gradient="from-blue-500/[0.25] dark:from-blue-500/[0.35]"
          height={200}
          rotate={-25}
          width={200}
        />

        {/* Tiny rectangle - top center */}
        <ElegantShape
          borderRadius={10}
          className="top-[15%] left-[40%]"
          delay={0.8}
          gradient="from-purple-500/[0.25] dark:from-purple-500/[0.35]"
          height={80}
          rotate={45}
          width={150}
        />

        {/* Wide rectangle - middle */}
        <ElegantShape
          borderRadius={18}
          className="top-[60%] left-[25%]"
          delay={0.9}
          gradient="from-teal-500/[0.25] dark:from-teal-500/[0.35]"
          height={120}
          rotate={-12}
          width={450}
        />
      </div>

      {/* Fade overlay top/bottom */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/80 dark:from-[#030303] dark:via-transparent dark:to-[#030303]/80 -z-0" />

      <div className="max-w-7xl w-full mx-auto">
        {/* Top line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-3 mb-6 md:mb-8"
        >
          <span className="glass-card px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Available for Opportunities
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">Junior Data Analyst · DataLab · Dundalk, IE</span>
        </motion.div>

        {/* Main editorial layout */}
        <div className="relative grid grid-cols-1 md:grid-cols-12 items-center gap-6 md:gap-0">
          {/* Giant name typography */}
          <div className="md:col-span-7 relative z-10">
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-primary font-bold text-sm md:text-base tracking-[0.2em] uppercase mb-4"
            >
              Junior Data Analyst
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.5,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className="font-heading font-black leading-[0.85] tracking-tighter"
            >
              <span className="block text-[clamp(2.5rem,10vw,6rem)] bg-gradient-to-b from-black to-black/80 dark:from-white dark:to-white/80 bg-clip-text text-transparent italic">
                <ScrambleHover>SHIVAJI</ScrambleHover>
              </span>
              <span className="block text-[clamp(2.5rem,10vw,6rem)] bg-gradient-to-r from-indigo-300 via-foreground/90 to-rose-300 bg-clip-text text-transparent">
                <ScrambleHover>CHARAVARTHE</ScrambleHover>
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-6 md:mt-8 max-w-md"
            >
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                Junior Data Analyst at DataLab with a strong foundation in <span className="text-foreground font-medium">Python, SQL, Excel, Tableau, and Power BI</span>. Enjoys uncovering data patterns, building automated ETL pipelines, and delivering executive insights.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  href="#projects"
                  className="bg-accent text-accent-foreground px-6 py-3.5 rounded-full text-sm font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-all shadow-sm cursor-pointer"
                >
                  View Work <ArrowUpRight className="w-4 h-4" />
                </motion.a>
                <ParticleButton
                  asChild
                  className="bg-primary text-primary-foreground px-6 py-3.5 rounded-full text-sm font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-all shadow-sm cursor-pointer"
                >
                  <a
                    href="/Shivaji_Charavarthe_M_Resume.pdf"
                    download="Shivaji_Charavarthe_M_Resume.pdf"
                  >
                    <Download className="w-4 h-4" /> Download Resume
                  </a>
                </ParticleButton>
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  href="#contact"
                  className="glass-card-strong px-6 py-3.5 rounded-full text-sm font-semibold inline-flex items-center gap-2 text-foreground border border-accent/20 cursor-pointer"
                >
                  <Mail className="w-4 h-4" /> Get in Touch
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Right side — Image + floating elements */}
          <div className="md:col-span-5 relative flex justify-center md:justify-end">
            {/* Image with parallax */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ x: imgX, y: imgY }}
              className="relative"
            >
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/30 rounded-[32px] blur-2xl scale-110 -z-10" />

              <div className="glass-card-strong rounded-[32px] p-1 relative">
                <img
                  src={profileImg}
                  alt="SHIVAJI CHARAVARTHE M"
                  className="w-56 h-64 md:w-72 md:h-80 object-cover rounded-[28px]"
                />
              </div>

              {/* Floating stat badges with parallax */}
              <motion.div
                style={{ x: floatX, y: floatY }}
                className="absolute -top-4 -left-6 md:-left-12 glass-card-strong rounded-2xl px-4 py-3 z-20"
              >
                <p className="text-xl md:text-2xl font-bold text-foreground">PL-300</p>
                <p className="text-[10px] text-muted-foreground">Certified Power BI</p>
              </motion.div>

              <motion.div
                style={{ x: useTransform(smoothX, [0, 1], [-12, 12]), y: useTransform(smoothY, [0, 1], [-18, 18]) }}
                className="absolute -bottom-3 -left-4 md:-left-10 glass-card-strong rounded-2xl px-4 py-3 z-20"
              >
                <p className="text-2xl font-bold text-foreground">85%</p>
                <p className="text-[10px] text-muted-foreground">Predictive Accuracy</p>
              </motion.div>

              <motion.div
                style={{ x: useTransform(smoothX, [0, 1], [15, -15]), y: useTransform(smoothY, [0, 1], [10, -10]) }}
                className="absolute -top-2 -right-4 md:-right-8 glass-card-strong rounded-full p-3 z-20"
              >
                <Sparkles className="w-5 h-5 text-accent" />
              </motion.div>

              <motion.div
                style={{ x: useTransform(smoothX, [0, 1], [18, -18]), y: useTransform(smoothY, [0, 1], [-8, 8]) }}
                className="absolute -bottom-5 -right-3 md:-right-10 glass-card-strong rounded-2xl px-4 py-3 z-20"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    <span className="w-4 h-4 rounded-full bg-primary/60 border border-background" />
                    <span className="w-4 h-4 rounded-full bg-accent/60 border border-background" />
                    <span className="w-4 h-4 rounded-full bg-secondary border border-background" />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium">Python · SQL · Power BI · Tableau · Excel · PostgreSQL</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom marquee-style tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12 md:mt-16 flex flex-wrap gap-3 justify-center md:justify-start"
        >
          {["Python", "SQL", "Tableau", "Power BI", "Excel", "PostgreSQL", "Matplotlib", "EDA", "Machine Learning", "PL-300 Certified"].map((tag) => (
            <span
              key={tag}
              className="text-xs text-muted-foreground border border-border rounded-full px-3.5 py-1.5 hover:bg-card/60 transition-colors"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
