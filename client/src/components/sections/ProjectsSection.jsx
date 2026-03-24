import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import SectionWrapper from "../SectionWrapper";
import { motion } from "framer-motion";
import { ExternalLink, Search } from "lucide-react";
// import { ExternalLink, GitHub, Search } from "lucide-react";

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
      <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">Projects</h2>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-card"
            placeholder="Search projects..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select className="px-4 py-2.5 rounded-lg border border-input bg-card" value={tech} onChange={(e) => setTech(e.target.value)}>
          {allTech.map((t) => (
            <option key={t} value={t}>{t === "all" ? "All Tech" : t}</option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group border border-border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-all duration-300"
          >
            {p.image && (
              <img src={`${apiUrl}${p.image}`} alt={p.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
            )}
            <div className="p-5">
              <h3 className="text-lg font-display font-semibold text-card-foreground">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {(p.techStack || []).map((t) => (
                  <span key={t} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">{t}</span>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm">Code</a>}
                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm"><ExternalLink className="h-4 w-4" />Live</a>}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {filtered.length === 0 && <p className="mt-8 text-sm text-muted-foreground">No projects match your search/filter.</p>}
    </SectionWrapper>
  );
}