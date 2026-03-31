import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Footer() {
  const [links, setLinks] = useState({
    github: "https://github.com/emxth",
    linkedin: "https://linkedin.com",
  });

  useEffect(() => {
    let mounted = true;

    const loadProfileLinks = async () => {
      try {
        const { data } = await api.get("/profile");
        if (!mounted) return;
        setLinks({
          github: data?.github || "https://github.com/emxth",
          linkedin: data?.linkedin || "https://linkedin.com",
        });
      } catch {
        // keep fallback links
      }
    };

    loadProfileLinks();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer className="px-4 py-8 border-t border-border bg-card">
      <div className="flex flex-col items-center justify-between max-w-6xl gap-4 mx-auto text-sm md:flex-row text-muted-foreground">
        <p>© {new Date().getFullYear()} emxth.dev. All rights reserved.</p>

        <div className="flex gap-4">
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-primary"
          >
            GitHub
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-primary"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}