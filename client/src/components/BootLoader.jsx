import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function BootLoader({ onDone }) {
  const steps = useMemo(
    () => [
      "Initializing runtime…",
      "Loading modules: ui, animations, theme…",
      "Fetching portfolio data…",
      "Optimizing assets…",
      "Finalizing…",
    ],
    []
  );

  const [progress, setProgress] = useState(0);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    let raf = 0;
    let start = performance.now();

    // total boot time (ms) – tune this
    const DURATION = 1700;

    const tick = (t) => {
      const elapsed = t - start;
      const raw = elapsed / DURATION;

      // slightly “technical” easing (fast -> slow -> finish)
      const eased =
        raw < 0.7 ? raw * 1.15 : 0.8 + (raw - 0.7) * 0.67;

      const next = clamp(Math.round(eased * 100), 0, 100);
      setProgress(next);

      // reveal log lines gradually
      const nextLines = clamp(
        1 + Math.floor((next / 100) * steps.length),
        1,
        steps.length
      );
      setLineCount(nextLines);

      if (next >= 100) {
        // allow a tiny pause so user sees 100%
        const to = setTimeout(() => onDone?.(), 350);
        return () => clearTimeout(to);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone, steps.length]);

  return (
    <div className="boot">
      <div className="boot-bg" />

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="boot-card"
      >
        <div className="boot-top">
          <div className="boot-brand">EMXTH.dev</div>
          <div className="boot-status">
            BOOTING <span className="boot-dot">•</span> {progress}%
          </div>
        </div>

        <div className="boot-bar">
          <motion.div
            className="boot-bar-fill"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.18 }}
          />
        </div>

        <div className="boot-meta">
          <span>build: portfolio</span>
          <span>mode: {document.documentElement.classList.contains("dark") ? "dark" : "light"}</span>
          <span>latency: {Math.max(8, 42 - Math.floor(progress / 4))}ms</span>
        </div>

        <div className="boot-terminal" aria-label="Loading log">
          {steps.slice(0, lineCount).map((s, i) => (
            <div key={i} className="boot-line">
              <span className="boot-prompt">{">"}</span>
              <span className="boot-text">{s}</span>
              {i === lineCount - 1 && progress < 100 && (
                <span className="boot-cursor" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}