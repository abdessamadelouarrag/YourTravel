import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, X, Check } from "lucide-react";
export function Button({
  children,
  to,
  variant = "",
  className = "",
  ...props
}) {
  const classes = `button ${variant} ${className}`;
  return to ? (
    <Link to={to} className={classes} {...props}>
      {children}
    </Link>
  ) : (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
export function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-35px" }}
      transition={{ duration: 0.65, delay, ease: [0.2, 0.65, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function SectionTitle({ eyebrow, title, description, link, to }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {link && (
        <Link className="text-link" to={to}>
          {link}
          <ArrowUpRight size={17} />
        </Link>
      )}
    </div>
  );
}
export function Modal({ title, children, onClose }) {
  const ref = useRef();
  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.focus();
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handle = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const els = ref.current.querySelectorAll(
          'button,a,input,select,textarea,[tabindex="0"]',
        );
        const first = els[0],
          last = els[els.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", handle);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal"
        initial={{ y: 30, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {children}
      </motion.section>
    </motion.div>
  );
}
export function Toast({ children }) {
  return (
    <div role="status" className="toast">
      <Check size={18} />
      {children}
    </div>
  );
}
export function LoadingSkeleton() {
  return (
    <div
      className="container skeleton-grid"
      aria-label="Loading destinations"
      role="status"
    >
      {[1, 2, 3].map((n) => (
        <div key={n} className="skeleton" />
      ))}
    </div>
  );
}
