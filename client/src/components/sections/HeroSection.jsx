import { motion } from "framer-motion";
import { ArrowDown, Braces, Code2, FileText } from "lucide-react";

export default function HeroSection() {
  const profile = {
    name: "Emith Arachchi",
    role: "Full-Stack Software Developer",
    intro:
      "I design and build scalable web applications with clean architecture, beautiful UI, and practical product thinking.",
    image: "/profile-bw.jpg",
  };

  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-24 md:pt-28 pb-14 md:pb-20"
      style={{
        background:
          "linear-gradient(120deg, hsl(var(--hero-gradient-from)), hsl(var(--hero-gradient-to)))",
      }}
    >
      <div className="container grid lg:grid-cols-2 gap-10 items-center">
        {/* LEFT CONTENT */}
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-hero-chip bg-hero-chip text-hero/85 text-xs md:text-sm tracking-wider uppercase backdrop-blur"
          >
            <Code2 className="h-3.5 w-3.5" />
            Welcome to my portfolio
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold text-hero leading-[1.05] tracking-tight"
          >
            Hi, I’m{" "}
            <span className="text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.20)]">
              {profile.name}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-lg md:text-xl text-hero/90 font-medium"
          >
            {"<"}{profile.role} {" />"}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-5 max-w-xl text-hero/85 text-base md:text-lg"
          >
            {profile.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 rounded-2xl glass shadow-soft p-4 md:p-5 text-sm md:text-base text-hero/90"
          >
            <p className="font-mono flex items-center gap-2">
              <Braces className="h-4 w-4" />
              {"{ build: \"fast\", design: \"clean\", mindset: \"product\" }"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={scrollToAbout}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/70 text-slate-900 border border-slate-300/70 hover:bg-white transition cursor-pointer backdrop-blur shadow-soft font-semibold"
            >
              Explore More
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5 animate-bounce" />
            </button>

            <a href="#contact" className="hero-btn-ghost">
              Contact
            </a>

            <a
              href="C:\Users\Public\Documents\portfolio\uploads\cv-randiv.pdf"
              target="_blank"
              rel="noreferrer"
              className="hero-btn-ghost"
            >
              <FileText className="h-4 w-4" />
              View CV
            </a>
          </motion.div>
        </div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="relative z-10 flex justify-center lg:justify-end"
        >
          <div className="relative w-70 sm:w-85 md:w-97.5 lg:w-107.5">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-white/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/25 shadow-2xl">
              <img
                src={profile.image}
                alt="Emith Arachchi"
                className="w-full h-105 md:h-125 object-cover grayscale contrast-[1.05]"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] ring-1 ring-white/20" />
          </div>
        </motion.div>
      </div>

      {/* background glows */}
      <div className="pointer-events-none absolute top-0 -left-30 w-85 h-85 bg-white/20 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 w-65 h-65 bg-sky-200/30 blur-3xl rounded-full" />
    </section>
  );
}