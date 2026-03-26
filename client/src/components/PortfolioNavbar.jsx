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
    const onScroll = () => setIsScrolled(window.scrollY > 16);
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

        if (visible[0]) setActiveHref(`#${visible[0].target.id}`);
      },
      { threshold: [0.3, 0.6, 0.9], rootMargin: "-80px 0px -30% 0px" }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);

    // wait mobile menu close animation
    setTimeout(() => {
      const el = document.querySelector(href);
      if (!el) return;

      const headerOffset = 92;
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }, 180);
  };

  return (
    <header className="sticky top-0 z-50 px-2 md:px-4 py-2">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 250, damping: 24 }}
        className={`mx-auto nav-shell transition-all duration-300 ${isScrolled ? "rounded-3xl max-w-6xl" : "rounded-2xl max-w-6xl"
          }`}
      >
        <div className="px-4 py-2 flex items-center justify-center">
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="ml-1">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile */}
          <div className="md:hidden flex items-center justify-between w-full">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="p-2 rounded-xl border border-border bg-card/70 hover:bg-accent transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <div className="flex flex-col gap-2 px-4 py-3 bg-card/70">
                {navItems.map((item) => {
                  const isActive = activeHref === item.href;
                  return (
                    <button
                      key={item.href}
                      onClick={() => scrollTo(item.href)}
                      className={`nav-mobile-link ${isActive ? "nav-mobile-link-active" : ""
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