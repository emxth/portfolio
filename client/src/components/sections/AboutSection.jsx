import { useEffect, useState } from "react";
import api from "../../api/axios";
import SectionWrapper from "../SectionWrapper";
import { motion } from "framer-motion";
import { Briefcase, Mail, Phone } from "lucide-react";

export default function AboutSection() {
  const [experience, setExperience] = useState([]);
  const [profile, setProfile] = useState({
    about: "",
    linkedin: "",
    github: "",
    contactNo: "",
    email: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: expData }, { data: profileData }] = await Promise.all([
          api.get("/experience"),
          api.get("/profile"),
        ]);

        setExperience((expData || []).filter((e) => e.visible !== false));
        setProfile({
          about: profileData?.about || "",
          linkedin: profileData?.linkedin || "",
          github: profileData?.github || "",
          contactNo: profileData?.contactNo || "",
          email: profileData?.email || "",
        });
      } catch {
        setExperience([]);
      }
    };
    load();
  }, []);

  return (
    <SectionWrapper id="about">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl font-display">
          About Me
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          {profile.about ||
            "I build scalable full-stack apps with strong focus on UX, APIs, and maintainable code."}
        </p>

        <div className="flex flex-wrap gap-2 mt-6">
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="link-btn"
            >
              LinkedIn
            </a>
          )}

          {profile.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="link-btn"
            >
              GitHub
            </a>
          )}

          {profile.email && (
            <a href={`mailto:${profile.email}`} className="link-btn">
              <Mail className="w-4 h-4" />
              Email
            </a>
          )}

          {profile.contactNo && (
            <a href={`tel:${profile.contactNo}`} className="link-btn">
              <Phone className="w-4 h-4" />
              {profile.contactNo}
            </a>
          )}
        </div>
      </div>

      {experience.length > 0 && (
        <div className="mt-12">
          <h2 className="flex items-center gap-2 mt-2 mb-8 text-3xl font-bold font-display md:text-4xl">Experience</h2>

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
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h4 className="text-lg font-semibold leading-snug text-card-foreground">
                    {e.role} <span className="text-primary">@</span> {e.company}
                  </h4>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {e.duration}
                  </p>
                </div>

                <p className="mt-3 text-sm md:text-[0.95rem] text-card-foreground/80 leading-relaxed">
                  {e.description}
                </p>

                <div className="w-full h-px mt-4 bg-border/70" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}