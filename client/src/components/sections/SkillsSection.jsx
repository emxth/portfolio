import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import SectionWrapper from "../SectionWrapper";
import { motion } from "framer-motion";

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/skills");
        const safe = Array.isArray(data) ? data : [];
        setSkills(safe.filter((s) => s.visible !== false));
      } catch {
        setSkills([]);
      }
    };
    load();
  }, []);

  const grouped = useMemo(() => {
    return skills.reduce((acc, s) => {
      const cat = s.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(s);
      return acc;
    }, {});
  }, [skills]);

  const categories = Object.entries(grouped);

  return (
    <SectionWrapper id="skills" alt>
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold md:text-4xl font-display section-title">
          Skills
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          A quick overview of the tools and technologies I use to ship reliable products.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid gap-5 mt-10 md:grid-cols-2">
          {categories.map(([category, items], groupIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: groupIndex * 0.06 }}
              className="transition category-card shadow-soft"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-medium tracking-wider uppercase text-muted-foreground">
                  {category}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {items.length} {items.length === 1 ? "skill" : "skills"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {items.map((s, i) => (
                  <motion.span
                    key={s.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.02 }}
                    className="badge"
                    title={s.level ? `${s.name} • ${s.level}` : s.name}
                  >
                    <span className="text-sm font-medium">{s.name}</span>
                    {/* {s.level && <span className="badge-muted">• {s.level}</span>} */}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">No skills data available.</p>
      )}
    </SectionWrapper>
  );
}