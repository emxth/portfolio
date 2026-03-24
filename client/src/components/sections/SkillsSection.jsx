import { useEffect, useState } from "react";
import api from "../../api/axios";
import SectionWrapper from "../SectionWrapper";
import { motion } from "framer-motion";

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/skills");
        setSkills(data.filter((s) => s.visible !== false));
      } catch {
        setSkills([]);
      }
    };
    load();
  }, []);

  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <SectionWrapper id="skills" alt>
      <h2 className="text-3xl md:text-4xl font-display font-bold mb-10">Skills</h2>

      {Object.keys(grouped).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3 font-medium">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((s, i) => (
                  <motion.span
                    key={s.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="px-4 py-2 rounded-full border border-border bg-card text-sm font-medium text-card-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {s.name}
                    {s.level && <span className="ml-1 text-muted-foreground text-xs">• {s.level}</span>}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No skills data available.</p>
      )}
    </SectionWrapper>
  );
}