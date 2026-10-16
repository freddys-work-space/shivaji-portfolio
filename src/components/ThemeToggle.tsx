import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
    
    // Ensure localStorage is set if not already present
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "dark");
    }
  }, []);

  const toggle = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", !dark ? "dark" : "light");
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="glass-card p-2.5 rounded-full cursor-pointer"
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
    </motion.button>
  );
};

export default ThemeToggle;
