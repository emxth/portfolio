import { useEffect, useState } from "react";
import api from "../api/axios";

export default function About() {
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [skillsRes, expRes] = await Promise.all([api.get("/skills"), api.get("/experience")]);
      setSkills(skillsRes.data.filter((s) => s.visible !== false));
      setExperience(expRes.data.filter((e) => e.visible !== false));
    };
    load();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <section>
        <h1 className="text-3xl font-bold">About Me</h1>
        <p className="mt-3 text-gray-700 dark:text-gray-300">
          I build scalable full-stack apps with strong focus on UX, APIs, and maintainable code.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {skills.map((s) => (
            <div key={s.id} className="border rounded-lg p-3">
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{s.category}</p>
              <p className="text-xs text-gray-500">{s.level}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Experience</h2>
        <div className="space-y-3">
          {experience.map((e) => (
            <div key={e.id} className="border rounded-lg p-4">
              <h3 className="font-semibold">
                {e.role} @ {e.company}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{e.duration}</p>
              <p className="mt-2 text-sm">{e.description}</p>
            </div>
          ))}
          {experience.length === 0 && (
            <p className="text-sm text-gray-500">No experience records found.</p>
          )}
        </div>
      </section>
    </main>
  );
}