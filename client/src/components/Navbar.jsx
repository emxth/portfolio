import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const navLinkClass = ({ isActive }) =>
  `nav-link ${isActive ? "nav-link-active" : ""}`;

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="nav-shell rounded-2xl px-4 py-2 flex items-center justify-between">
          <Link to="/" className="nav-brand text-base md:text-lg">
            emxth.dev
          </Link>

          <nav className="flex items-center gap-1.5">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/projects" className={navLinkClass}>
              Projects
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>

            <div className="ml-1">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}