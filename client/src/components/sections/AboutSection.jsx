import { useEffect, useState } from "react";
import api from "../../api/axios";
import SectionWrapper from "../SectionWrapper";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export default function AboutSection() {
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/experience");
        setExperience(data.filter((e) => e.visible !== false));
      } catch {
        setExperience([]);
      }
    };
    load();
  }, []);

  return (
    <SectionWrapper id="about">
      <div className="max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
          About Me
        </h2>
        <p className="text-muted-foreground text-lg mt-3">
          I build scalable full-stack apps with strong focus on UX, APIs, and maintainable code.
        </p>
      </div>

      {experience.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border">
              <Briefcase className="h-5 w-5 text-primary" />
            </span>
            Experience
          </h3>

          <div className="space-y-4">
            {experience.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover:-translate-y-0.5 hover:shadow-2xl transition will-change-transform"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <h4 className="font-semibold text-card-foreground text-lg leading-snug">
                    {e.role} <span className="text-primary">@</span> {e.company}
                  </h4>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {e.duration}
                  </p>
                </div>

                <p className="mt-3 text-sm md:text-[0.95rem] text-card-foreground/80 leading-relaxed">
                  {e.description}
                </p>

                <div className="mt-4 h-px w-full bg-border/70" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}