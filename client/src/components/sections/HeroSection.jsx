import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function HeroSection() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      setProfile({
          name: "emxth",
          intro: "Full-stack developer building clean, dynamic web apps.",
        });    };
    load();
  }, []);

  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, hsl(var(--hero-gradient-from)), hsl(var(--hero-gradient-to)))`,
      }}
    >
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-primary-foreground/80 text-sm uppercase tracking-widest mb-4 font-medium">
          Welcome to my portfolio
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground leading-tight">
          {profile?.name || "Portfolio"}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-xl mx-auto">
          {profile?.intro || "Loading..."}
        </motion.p>
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} onClick={scrollToAbout}
          className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-colors font-medium cursor-pointer">
          Explore <ArrowDown className="h-4 w-4 animate-bounce" />
        </motion.button>
      </div>
      <div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />
      <div className="absolute bottom-20 -right-32 w-80 h-80 rounded-full bg-primary-foreground/5 blur-3xl" />
    </section>
  );
}