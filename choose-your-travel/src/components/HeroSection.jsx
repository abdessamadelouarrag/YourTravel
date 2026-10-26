import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { ArrowDown, ArrowUpRight, ArrowRight, MapPin } from "lucide-react";
import { Button } from "./ui";
export default function HeroSection() {
  const { scrollY } = useScroll();
  const parallax = useTransform(scrollY, [0, 860], [0, 65]);
  const reduced = useReducedMotion();
  return (
    <section className="hero">
      <motion.img
        className="hero-image"
        style={{ y: reduced ? 0 : parallax, scale: reduced ? 1 : 1.15 }}
        src="/images/bali-coast.jpg"
        alt="Turquoise water, palm trees, and dramatic coastal cliffs in Bali, Indonesia"
        fetchPriority="high"
      />
      <div className="hero-shade" />
      <div className="hero-content container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-eyebrow">
            <span /> LESS ORDINARY. MORE YOU.
          </div>
          <h1>
            The world is yours
            <br />
            to{" "}
            <span className="hero-explore">
              explore
              <svg viewBox="0 0 390 24" aria-hidden="true">
                <path d="M5 17Q170-9 381 10M35 22Q182 5 340 16" />
              </svg>
            </span>
            <span className="hero-period">.</span>
          </h1>
          <p>
            Discover extraordinary places.
            <br className="mobile-only" /> Create unforgettable memories.
          </p>
          <div className="hero-buttons">
            <Button to="/explore" variant="light">
              Explore destinations
              <ArrowUpRight size={18} />
            </Button>
            <Link className="hero-secondary" to="/planner">
              Plan my trip <ArrowRight size={17} />
            </Link>
          </div>
        </motion.div>
        <div className="hero-bottom">
          <a className="scroll-hint" href="#discover">
            <span>
              <ArrowDown size={15} />
            </span>{" "}
            A world of possibilities awaits
          </a>
          <Link to="/destination/bali" className="hero-location">
            <MapPin size={17} />
            <span>
              <small>WISH YOU WERE HERE</small>Bali, Indonesia
            </span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
      <div className="hero-side">A NEW PERSPECTIVE IS JUST A JOURNEY AWAY</div>
      <span className="hero-photo-credit">Photography · Unsplash</span>
    </section>
  );
}
