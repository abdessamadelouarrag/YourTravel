import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Compass, ArrowUpRight, Menu, X, Heart } from "lucide-react";
export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Choose Your Travel home">
      <span className="brand-mark">
        <Compass size={29} strokeWidth={1.6} />
      </span>
      <span>
        choose
        <span className="brand-bottom">
          your travel<span className="brand-dot">.</span>
        </span>
      </span>
    </Link>
  );
}
export default function Navbar({ favorites }) {
  const [scrolled, setScrolled] = useState(false),
    [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const transparent = pathname === "/" && !scrolled;
  return (
    <header
      className={`navbar ${transparent ? "transparent" : ""} ${open ? "menu-is-open" : ""}`}
    >
      <div className="nav-inner">
        <Brand />
        <nav
          className={open ? "nav-links open" : "nav-links"}
          aria-label="Main navigation"
        >
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/destinations">Destinations</NavLink>
          <NavLink to="/planner">Trip Planner</NavLink>
          <NavLink to="/favorites">
            Favorites{" "}
            {favorites.length > 0 && (
              <span className="nav-count">{favorites.length}</span>
            )}
          </NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <div className="nav-actions">
          <Link
            className="nav-heart"
            to="/favorites"
            aria-label="Your favorites"
          >
            <Heart size={19} />
          </Link>
          <Link className="nav-cta" to="/planner">
            Plan a trip
            <ArrowUpRight size={16} />
          </Link>
          <button
            className="menu-toggle icon-button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
