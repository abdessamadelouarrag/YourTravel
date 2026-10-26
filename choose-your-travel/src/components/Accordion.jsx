import { useState, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
export default function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  const id = useId();
  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div className="accordion-item" key={item.title}>
          <h3>
            <button
              aria-expanded={open === i}
              aria-controls={`${id}-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {item.title}
              {open === i ? <Minus size={17} /> : <Plus size={17} />}
            </button>
          </h3>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                id={`${id}-${i}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p>{item.content}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
