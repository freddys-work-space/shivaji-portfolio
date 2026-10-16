import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [activePath, setActivePath] = useState("#about");

  const isActiveLink = (path: string) => {
    return activePath === path;
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
    setActivePath(href);
    setOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-6 md:py-8 pointer-events-none"
    >
      <div className="max-w-10xl mx-auto flex items-center justify-center pointer-events-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex bg-black/10 dark:bg-white/10 backdrop-blur-xl items-center rounded-2xl border border-white/5 dark:border-black/5 shadow-2xl overflow-hidden p-0">
          {/* Logo Block */}
          <a
            href="#"
            onClick={(e) => scrollToSection(e, "#about")}
            className={cn(
              "h-12 flex items-center justify-center bg-black px-6 text-sm text-white transition-all duration-300 dark:bg-white dark:text-black font-black tracking-tight",
              "rounded-l-2xl",
              isActiveLink(links[0].href) && "rounded-r-2xl mr-2"
            )}
          >
            SC.
          </a>

          {/* Navigation Blocks */}
          <div className="flex items-center">
            {links.map((link, index) => {
              const isActive = isActiveLink(link.href);
              const prevIsActive = index > 0 ? isActiveLink(links[index - 1].href) : false;
              const nextIsActive = index < links.length - 1 ? isActiveLink(links[index + 1].href) : false;

              const logoIsPreceding = index === 0;
              const resumeIsFollowing = index === links.length - 1;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={cn(
                    "h-12 flex items-center justify-center bg-black px-6 text-sm text-white transition-all duration-300 dark:bg-white dark:text-black whitespace-nowrap relative",
                    isActive
                      ? "mx-2 rounded-2xl font-bold bg-primary text-primary-foreground shadow-xl scale-110 z-20"
                      : cn(
                        "hover:bg-white/10 dark:hover:bg-black/5",
                        (prevIsActive || (logoIsPreceding && isActiveLink(links[0].href))) && "rounded-l-2xl ml-2",
                        (nextIsActive || (resumeIsFollowing && isActiveLink(links[links.length - 1].href))) && "rounded-r-2xl mr-2"
                      )
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Resume Block */}
          <a
            href="/Shivaji_Charavarthe_M_Resume.pdf"
            download="Shivaji_Charavarthe_M_Resume.pdf"
            className={cn(
              "h-12 flex items-center justify-center bg-black px-6 text-sm text-white transition-all duration-300 dark:bg-white dark:text-black font-bold",
              isActiveLink(links[links.length - 1].href) && "rounded-l-2xl ml-2",
              "border-l border-white/5 dark:border-black/5"
            )}
          >
            Resume
          </a>

          {/* Theme Toggle Block */}
          <div className="h-12 w-16 flex items-center justify-center bg-black dark:bg-white transition-all duration-300 rounded-r-2xl border-l border-white/10 dark:border-black/10">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden w-full items-center justify-between bg-black/10 dark:bg-white/10 backdrop-blur-xl rounded-2xl border border-white/5 dark:border-black/5 shadow-2xl px-4 py-2">
          <a
            href="#"
            onClick={(e) => scrollToSection(e, "#about")}
            className="h-10 flex items-center justify-center bg-black px-4 text-sm text-white dark:bg-white dark:text-black font-black tracking-tight rounded-xl shadow-lg"
          >
            NE.
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="text-foreground bg-background/80 p-2 rounded-xl backdrop-blur-md border border-border shadow-md hover:scale-105 active:scale-95 transition-all"
              aria-label="Toggle navigation menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm md:hidden z-[-1] pointer-events-auto"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="md:hidden mt-4 mx-4 bg-card/90 backdrop-blur-2xl border border-border rounded-3xl p-6 flex flex-col gap-2 shadow-2xl pointer-events-auto"
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={cn(
                    "flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-200",
                    isActiveLink(link.href)
                      ? "bg-primary text-primary-foreground font-bold shadow-lg"
                      : "hover:bg-primary/10 text-foreground/80 font-medium"
                  )}
                >
                  {link.label}
                  {isActiveLink(link.href) && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                </a>
              ))}
              <div className="h-px bg-border my-2" />
              <a
                href="/Shivaji_Charavarthe.pdf"
                download="SHIVAJI_RESUME.pdf"
                className="flex items-center justify-between px-4 py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold shadow-xl mt-2"
              >
                Download Resume
                <Download className="w-4 h-4" />
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
