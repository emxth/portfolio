import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function PortfolioNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveHref(`#${visible[0].target.id}`);
        }
      },
      { threshold: [0.3, 0.6, 0.9], rootMargin: "-80px 0px -30% 0px" }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 px-2 md:px-4 py-2">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 250, damping: 24 }}
        className={`mx-auto backdrop-blur-md transition-all duration-300 ${
          isScrolled
            ? "rounded-4xl shadow-lg bg-card/90 max-w-6xl"
            : "rounded-none bg-card/70"
        }`}
      >
        <div className="px-4 py-1 flex items-center justify-center">
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground hover:bg-secondary hover:text-foreground hover:underline underline-offset-4"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <ThemeToggle />
          </nav>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2 justify-between w-full">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="p-2 rounded-md hover:bg-secondary transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <div className="flex flex-col px-4 py-2 bg-card">
                {navItems.map((item) => {
                  const isActive = activeHref === item.href;
                  return (
                    <button
                      key={item.href}
                      onClick={() => scrollTo(item.href)}
                      className={`py-2 px-2 rounded-md text-sm font-medium text-left transition ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}