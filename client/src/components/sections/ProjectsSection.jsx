import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import SectionWrapper from "../SectionWrapper";
import { motion } from "framer-motion";
import { ExternalLink, GitCompareArrows, Search, Image as ImageIcon, ChevronDown } from "lucide-react";

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState("");
  const [tech, setTech] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/projects");
        setProjects((data || []).filter((p) => p.visible !== false));
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

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
    return `${apiUrl}${imgPath}`;
  };

  return (
    <SectionWrapper id="projects">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold md:text-4xl font-display section-title">Projects</h2>
      </div>

      <div className="flex flex-col items-stretch gap-3 mt-8 md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute w-4 h-4 -translate-y-1/2 right-4 top-1/2 text-muted-foreground" />
          <input
            className="input pl-11"
            placeholder="Search projects by name, tech, or description..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="relative md:w-56">
          <select
            className="appearance-none select pr-11 text-muted-foreground"
            value={tech}
            onChange={(e) => setTech(e.target.value)}
          >
            {allTech.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All Tech" : t}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-3 top-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-2">
        {filtered.map((p, i) => {
          const imageUrl = getImageUrl(p.image);

          return (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="project-card"
            >
              <div className="project-media">
                {imageUrl ? (
                  <a href={imageUrl} target="_blank" rel="noreferrer" title="Open image">
                    <img src={imageUrl} alt={p.title} loading="lazy" />
                  </a>
                ) : (
                  <div className="flex items-center justify-center w-full h-full gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="w-4 h-4" />
                    No preview image
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold leading-snug font-display text-card-foreground">{p.title}</h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

                {(p.techStack || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(p.techStack || []).map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-5">
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noreferrer" className="link-btn">
                      <GitCompareArrows className="w-4 h-4" />
                      Code
                    </a>
                  )}

                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noreferrer" className="link-btn">
                      <ExternalLink className="w-4 h-4" />
                      Live
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">No projects match your search/filter.</p>
      )}
    </SectionWrapper>
  );
}