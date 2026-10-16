import { motion } from "framer-motion";
import { Mail, Linkedin, MapPin, Send, Phone, Github } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:shivaji87123@gmail.com?subject=Portfolio Contact from ${form.name}&body=${form.message}`;
  };

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-10"
        >
          Get In Touch
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-muted-foreground">
              I'm always open to discussing new Data Analyst opportunities, BI dashboard projects, or predictive analytics pipelines. Let's connect!
            </p>
            <div className="space-y-4">
              <a href="mailto:shivaji87123@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-10 h-10 rounded-xl bg-accent/40 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-accent-foreground" />
                </div>
                shivaji87123@gmail.com
              </a>
              <a href="tel:+353871234567" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-10 h-10 rounded-xl bg-accent/40 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-accent-foreground" />
                </div>
                +353 87 123 4567
              </a>
              <a href="https://www.linkedin.com/login" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-10 h-10 rounded-xl bg-accent/40 flex items-center justify-center">
                  <Linkedin className="w-4 h-4 text-accent-foreground" />
                </div>
                LinkedIn Profile
              </a>
              <a href="https://github.com/login" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-10 h-10 rounded-xl bg-accent/40 flex items-center justify-center">
                  <Github className="w-4 h-4 text-accent-foreground" />
                </div>
                GitHub Profile
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-xl bg-accent/40 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent-foreground" />
                </div>
                Dundalk, IE
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="glass-card rounded-3xl p-6 space-y-4"
          >
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition"
              required
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition resize-none"
              required
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-accent text-accent-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm border border-accent/20"
            >
              <Send className="w-4 h-4" /> Send Message
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
