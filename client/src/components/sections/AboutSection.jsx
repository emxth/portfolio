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
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
          About Me
        </h2>
        <p className="text-muted-foreground text-lg mt-3">
          {profile.about ||
            "I build scalable full-stack apps with strong focus on UX, APIs, and maintainable code."}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
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
              <Mail className="h-4 w-4" />
              Email
            </a>
          )}

          {profile.contactNo && (
            <a href={`tel:${profile.contactNo}`} className="link-btn">
              <Phone className="h-4 w-4" />
              {profile.contactNo}
            </a>
          )}
        </div>
      </div>

      {experience.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border">
              <Briefcase className="h-5 w-5 text-primary" />
            </span>
            Experience
          </h3>

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
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <h4 className="font-semibold text-card-foreground text-lg leading-snug">
                    {e.role} <span className="text-primary">@</span> {e.company}
                  </h4>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {e.duration}
                  </p>
                </div>

                <p className="mt-3 text-sm md:text-[0.95rem] text-card-foreground/80 leading-relaxed">
                  {e.description}
                </p>

                <div className="mt-4 h-px w-full bg-border/70" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}