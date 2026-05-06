import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const MAX_RETRIES = 6;
const BASE_DELAY_MS = 1500;
const PROGRESS_TICK_MS = 120;
const DONE_DELAY_MS = 280;

const STEP_LABELS = [
  "Initializing runtime…",
  "Loading modules: ui, animations, theme…",
  "Fetching portfolio data…",
  "Applying content model…",
  "Finalizing…",
];

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getRetryDelay = (attempt) =>
  BASE_DELAY_MS * Math.pow(1.5, attempt);

async function fetchBootstrapData(signal) {
  // Step 1: Warm up backend
  await fetch("/api/health", { signal }).catch(() => {});

  // Optional small delay (important for Azure cold start)
  await sleep(800);

  const endpoints = ["/profile", "/projects", "/skills", "/experience"];

  // Step 2: Fetch sequentially (NOT parallel)
  const result = {};

  for (const path of endpoints) {
    const res = await fetch(`/api${path}`, { signal });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    result[path.replace("/", "")] = await res.json();
  }

  return result;
}

function getInitialThemeMode() {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function BootLoader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [lineCount, setLineCount] = useState(1);
  const [mode, setMode] = useState(getInitialThemeMode);

  const isMounted = useRef(true);
  const progressRef = useRef(0);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    const syncMode = () => {
      const isDark = root.classList.contains("dark");
      setMode(isDark ? "dark" : "light");
    };

    syncMode();

    const observer = new MutationObserver(syncMode);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    isMounted.current = true;
    let progressTimer;
    let doneTimer;
    let controller;

    const updateProgress = (val) => {
      if (!isMounted.current) return;

      const next = clamp(Math.round(val), 0, 100);
      progressRef.current = next;
      setProgress(next);

      const lines = clamp(
        1 + Math.floor((next / 100) * STEP_LABELS.length),
        1,
        STEP_LABELS.length
      );
      setLineCount(lines);
    };

    const startProgress = (attemptRef) => {
      progressTimer = setInterval(() => {
        if (!isMounted.current) return;

        const cap = clamp(20 + attemptRef.current * 15, 20, 90);
        const current = progressRef.current;
        if (current >= cap) return;

        const delta = current < cap - 20 ? 3 : current < cap - 10 ? 2 : 1;
        updateProgress(current + delta);
      }, PROGRESS_TICK_MS);
    };

    const stopProgress = () => {
      if (progressTimer) clearInterval(progressTimer);
    };

    const run = async () => {
      const attemptRef = { current: 0 };
      startProgress(attemptRef);

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        attemptRef.current = attempt;
        controller = new AbortController();

        try {
          const data = await fetchBootstrapData(controller.signal);

          stopProgress();
          updateProgress(100);

          doneTimer = setTimeout(() => {
            if (isMounted.current) onDone?.(data);
          }, DONE_DELAY_MS);

          return;
        } catch {
          if (!isMounted.current) return;

          if (attempt === MAX_RETRIES - 1) {
            stopProgress();
            updateProgress(100);

            doneTimer = setTimeout(() => {
              if (isMounted.current) {
                onDone?.({
                  profile: null,
                  projects: [],
                  skills: [],
                  experience: [],
                  error: true,
                });
              }
            }, DONE_DELAY_MS);

            return;
          }

          updateProgress(progressRef.current + 5);
          await sleep(getRetryDelay(attempt));
        }
      }
    };

    run();

    return () => {
      isMounted.current = false;
      if (controller) controller.abort();
      if (progressTimer) clearInterval(progressTimer);
      if (doneTimer) clearTimeout(doneTimer);
    };
  }, [onDone]);

  const currentLine = Math.min(lineCount - 1, STEP_LABELS.length - 1);
  const latency = clamp(80 - progress, 12, 80);

  return (
    <div className={`boot ${mode === "dark" ? "boot--dark" : "boot--light"}`}>
      <div className="boot-bg" />

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
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
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <div className="boot-meta">
          <span>build: portfolio</span>
          <span>mode: {mode}</span>
          <span>latency: {latency}ms</span>
        </div>

        <div className="boot-terminal">
          {STEP_LABELS.slice(0, lineCount).map((s, i) => (
            <div key={`${s}-${i}`} className="boot-line">
              <span className="boot-prompt">{">"}</span>
              <span className="boot-text">{s}</span>
              {i === currentLine && progress < 100 && <span className="boot-cursor" />}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}