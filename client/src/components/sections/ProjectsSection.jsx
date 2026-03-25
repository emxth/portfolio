import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import SectionWrapper from "../SectionWrapper";
import { motion } from "framer-motion";
import { ExternalLink, GitCompareArrows, Search } from "lucide-react";

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState("");
  const [tech, setTech] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/projects");
        setProjects(data.filter((p) => p.visible !== false));
      } catch {
        setProjects([]);
      }
    };
    load();
  }, []);

  const allTech = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => (p.techStack || []).forEach((t) => set.add(t)));
    return ["all", ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const text = `${p.title} ${p.description} ${(p.techStack || []).join(" ")}`.toLowerCase();
      const matchQuery = text.includes(q.toLowerCase());
      const matchTech = tech === "all" || (p.techStack || []).includes(tech);
      return matchQuery && matchTech;
    });
  }, [projects, q, tech]);

  const apiUrl = import.meta.env.VITE_API_ORIGIN || "http://localhost:5000";

  return (
    <SectionWrapper id="projects">
      <div className="max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-display font-bold section-title">
          Projects
        </h2>
        <p className="mt-3 text-muted-foreground text-lg">
          Selected work covering full-stack apps, UI/UX, APIs, and production-ready architecture.
        </p>
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="input pl-11"
            placeholder="Search projects by name, tech, or description..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="md:w-56">
          <select
            className="select"
            value={tech}
            onChange={(e) => setTech(e.target.value)}
          >
            {allTech.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All Tech" : t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {filtered.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="project-card"
          >
            <div className="project-media">
              {p.image ? (
                <img src={`${apiUrl}${p.image}`} alt={p.title} loading="lazy" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                  No preview image
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-display font-semibold text-card-foreground leading-snug">
                  {p.title}
                </h3>
              </div>

              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {p.description}
              </p>

              {(p.techStack || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {(p.techStack || []).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link-btn"
                  >
                    <GitCompareArrows className="h-4 w-4" />
                    Code
                  </a>
                )}

                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link-btn"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          No projects match your search/filter.
        </p>
      )}
    </SectionWrapper>
  );
}