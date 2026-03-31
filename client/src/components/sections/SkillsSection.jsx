import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import SectionWrapper from "../SectionWrapper";
import { motion } from "framer-motion";

const SKILL_ICON_MAP = {
  javascript: "javascript",
  typescript: "typescript",
  react: "react",
  "node.js": "nodejs",
  node: "nodejs",
  express: "express",
  "express.js": "express",
  mongodb: "mongodb",
  mysql: "mysql",
  tailwind: "tailwindcss",
  "tailwind css": "tailwindcss",
  docker: "docker",
  git: "git",
  github: "github",
  java: "java",
  python: "python",
  "next.js": "nextjs",
  nextjs: "nextjs",
  csharp: "csharp",
  "c#": "csharp",
  dotnet: "dotnetcore",
  ".net": "dotnetcore",
};

function normalizeSkillName(name = "") {
  return String(name).trim().toLowerCase();
}

function skillToDeviconSlug(skill) {
  // priority 1: explicit icon from backend JSON
  const explicit = normalizeSkillName(skill?.icon || "");
  if (explicit) return explicit;

  // priority 2: map by skill name
  const n = normalizeSkillName(skill?.name || "");
  if (SKILL_ICON_MAP[n]) return SKILL_ICON_MAP[n];

  const simplified = n
    .replace(/\+/g, "plus")
    .replace(/#/g, "sharp")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "");

  return SKILL_ICON_MAP[simplified] || null;
}

function deviconUrl(slug) {
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
}

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomOuterPosition(rand) {
  const safe = { left: 12, right: 85, top: 8, bottom: 90 };
  const region = Math.floor(rand() * 4);
  const r = (min, max) => min + rand() * (max - min);

  if (region === 0) return { left: r(2, 98), top: r(2, safe.top - 2) };
  if (region === 1) return { left: r(2, 98), top: r(safe.bottom + 2, 96) };
  if (region === 2) return { left: r(2, safe.left - 2), top: r(safe.top, safe.bottom) };
  return { left: r(safe.right + 2, 98), top: r(safe.top, safe.bottom) };
}

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);
  const SEED = 20260331;

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

  const decorSlugs = useMemo(() => {
    const seen = new Set();
    const slugs = [];

    for (const s of skills) {
      const slug = skillToDeviconSlug(s);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      slugs.push(slug);
    }

    return slugs.slice(0, 14);
  }, [skills]);

  const decorLayout = useMemo(() => {
    const rand = mulberry32(SEED);
    return decorSlugs.map((slug) => {
      const { left, top } = randomOuterPosition(rand);
      const size = Math.round(34 + rand() * 22);
      const delay = rand() * 1.2;
      const duration = 4.8 + rand() * 3.2;
      return { slug, left, top, size, delay, duration };
    });
  }, [decorSlugs]);

  return (
    <SectionWrapper id="skills" alt className="relative">
      {decorLayout.length > 0 && (
        <div className="skill-decor">
          <div className="skill-decor-safe" />
          {decorLayout.map((it) => (
            <motion.img
              key={it.slug}
              src={deviconUrl(it.slug)}
              alt=""
              className="skill-decor-icon"
              style={{
                left: `${it.left}%`,
                top: `${it.top}%`,
                width: it.size,
                height: it.size,
                animation: `floaty2 ${it.duration}s ease-in-out ${it.delay}s infinite`,
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-3xl">
        <h2 className="text-3xl font-bold md:text-4xl font-display section-title">Skills</h2>
        <p className="mt-3 text-lg text-muted-foreground">
          A quick overview of the tools and technologies I use to ship reliable products.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="relative grid gap-5 mt-10 md:grid-cols-2">
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