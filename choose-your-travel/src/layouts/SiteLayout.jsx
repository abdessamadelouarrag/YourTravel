import { useOutlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { destinations } from "../data/destinations";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export default function SiteLayout({ favorites }) {
  const { pathname, hash } = useLocation();
  const outlet = useOutlet();
  useEffect(() => {
    const titles = {
      "/": "Go somewhere that stays with you",
      "/explore": "Find your somewhere",
      "/destinations": "Explore destinations",
      "/planner": "Your trip. Your story.",
      "/favorites": "Your little wish list",
      "/about": "For the curious at heart",
      "/contact": "A little conversation",
    };
    const destination = destinations.find(
      (d) => pathname === `/destination/${d.id}`,
    );
    document.title = `${destination ? `${destination.name}, ${destination.country}` : titles[pathname] || "A new perspective"} — Choose Your Travel`;
    if (hash) {
      setTimeout(
        () =>
          document
            .getElementById(hash.slice(1))
            ?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    } else window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar favorites={favorites} />
      <main id="main-content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
