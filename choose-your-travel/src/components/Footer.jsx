import { Link } from "react-router-dom";
import { ArrowUpRight, Instagram, Compass } from "lucide-react";
import { Brand } from "./Navbar";
export default function Footer() {
  return (
    <footer>
      <div className="container footer-top">
        <div className="footer-brand">
          <Brand />
          <p>
            For the places you haven’t been.
            <br />
            And the person you’ll become.
          </p>
          <span className="footer-note">
            <Compass size={15} /> A little curiosity goes a long way.
          </span>
        </div>
        <div>
          <h4>Find your way</h4>
          <Link to="/explore">Explore destinations</Link>
          <Link to="/planner">Plan your trip</Link>
          <Link to="/favorites">Your saved places</Link>
        </div>
        <div>
          <h4>A little about us</h4>
          <Link to="/about">Our philosophy</Link>
          <Link to="/contact">
            Get in touch <ArrowUpRight size={13} />
          </Link>
          <Link to="/about#thoughtful-travel">Travel thoughtfully</Link>
        </div>
        <div className="footer-signoff">
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <p>
            Starts with
            <br />a little <em>wander.</em>
          </p>
          <Link
            className="circle-link"
            to="/explore"
            aria-label="Find your next adventure"
          >
            <ArrowUpRight />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Choose Your Travel. Made for the curious.
        </span>
        <span>Independent travel inspiration · Illustrative prices in USD</span>
        <Link to="/contact">
          Say hello <ArrowUpRight size={12} />
        </Link>
      </div>
    </footer>
  );
}
