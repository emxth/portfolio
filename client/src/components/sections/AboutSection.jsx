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
      <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">About Me</h2>
      <p className="text-muted-foreground max-w-2xl text-lg mb-12">
        I build scalable full-stack apps with strong focus on UX, APIs, and maintainable code.
      </p>

      {experience.length > 0 && (
        <>
          <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Experience
          </h3>
          <div className="space-y-4">
            {experience.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-border rounded-lg p-5 bg-card hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-card-foreground">
                  {e.role} <span className="text-primary">@</span> {e.company}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{e.duration}</p>
                <p className="mt-2 text-sm text-card-foreground/80">{e.description}</p>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </SectionWrapper>
  );
}