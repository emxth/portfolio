import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState("");
  const [tech, setTech] = useState("all");

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/projects");
      setProjects(data.filter((p) => p.visible !== false));
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

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          className="border rounded-lg p-2 w-full md:w-80"
          placeholder="Search projects..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="border rounded-lg p-2 w-full md:w-56"
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

      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((p) => (
          <article key={p.id} className="border rounded-xl p-4">
            {p.image ? (
              <img
                src={`http://localhost:5000${p.image}`}
                alt={p.title}
                className="w-full h-44 object-cover rounded-lg border mb-3"
              />
            ) : null}
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{p.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {(p.techStack || []).map((t) => (
                <span key={t} className="px-2 py-0.5 border rounded text-xs">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-3 text-sm">
              {p.githubUrl ? (
                <a href={p.githubUrl} target="_blank" rel="noreferrer" className="underline">
                  GitHub
                </a>
              ) : null}
              {p.liveUrl ? (
                <a href={p.liveUrl} target="_blank" rel="noreferrer" className="underline">
                  Live
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-gray-500">No projects match your search/filter.</p>
      )}
    </main>
  );
}