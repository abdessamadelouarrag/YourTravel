import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Palmtree,
  Mountain,
  Sparkles,
  Compass,
  Wallet,
  Gem,
  Sun,
  Snowflake,
  User,
  Users,
  Heart,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { destinations } from "../data/destinations";
import { recommend } from "../utils/travel";
const questions = [
  {
    key: "landscape",
    title: "Where does your mind wander?",
    options: [
      ["Beach", "To the ocean", Palmtree],
      ["Mountains", "Into the mountains", Mountain],
    ],
  },
  {
    key: "pace",
    title: "What feels like your kind of day?",
    options: [
      ["Nature", "Slow down & take it in", Sparkles],
      ["Adventure", "Chase a little adventure", Compass],
    ],
  },
  {
    key: "budget",
    title: "How do you like to travel?",
    options: [
      ["Budget", "More moments, less spending", Wallet],
      ["Luxury", "A little extra indulgence", Gem],
    ],
  },
  {
    key: "weather",
    title: "What’s your perfect forecast?",
    options: [
      ["Warm", "Sunshine on my skin", Sun],
      ["Cool", "Crisp air & cozy layers", Snowflake],
      ["Cold", "A little winter magic", Snowflake],
    ],
  },
  {
    key: "company",
    title: "Who’s along for the ride?",
    options: [
      ["Solo", "Just me", User],
      ["Couple", "My favorite person", Heart],
      ["Friends", "My people", Users],
      ["Family", "The whole family", Users],
    ],
  },
];
export default function EscapeQuiz() {
  const [started, setStarted] = useState(false),
    [step, setStep] = useState(0),
    [answers, setAnswers] = useState({});
  const done = step === questions.length;
  function reset() {
    setStep(0);
    setAnswers({});
    setStarted(false);
  }
  return (
    <div className={`escape-quiz ${started ? "quiz-started" : ""}`}>
      <div className="escape-photo">
        <img
          src="/images/escape.jpg"
          alt="Sunlight filtering through a tranquil green forest"
          loading="lazy"
        />
        <span className="escape-photo-note">
          SOMEWHERE OUT THERE,
          <br />
          THERE’S A PLACE FOR YOU.
        </span>
        <span className="escape-compass">
          <Compass size={51} strokeWidth={1} />
        </span>
      </div>
      <div className="escape-copy">
        <span className="eyebrow">
          <Sparkles size={13} /> A LITTLE YOU. A WHOLE WORLD OF POSSIBILITIES.
        </span>
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2>
                Find your
                <br />
                perfect <span className="serif">escape.</span>
              </h2>
              <p>
                Are you a sunrise chaser or a slow morning person?
                <br />
                Let’s find the places that feel like you.
              </p>
              <button className="button" onClick={() => setStarted(true)}>
                Find my escape
                <ArrowUpRightIcon />
              </button>
              <span className="quiz-duration">
                5 little questions. Endless possibilities.
              </span>
            </motion.div>
          ) : done ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="quiz-title">
                These feel like <span className="serif">you.</span>
              </h2>
              <p>A few places that match your kind of adventure.</p>
              <div className="quiz-results">
                {recommend(destinations, answers).map((d) => (
                  <Link key={d.id} to={`/destination/${d.id}`}>
                    <img src={d.image} alt={d.name} />
                    <span>
                      <strong>{d.name}</strong>
                      <small>
                        {d.country} · from ${d.price}/day
                      </small>
                    </span>
                    <ArrowRight size={17} />
                  </Link>
                ))}
              </div>
              <button className="text-link quiz-reset" onClick={reset}>
                <RotateCcw size={14} />
                Try a different feeling
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
            >
              <div className="quiz-progress">
                <span>0{step + 1} / 05</span>
                <div>
                  {questions.map((q, i) => (
                    <span key={q.key} className={i <= step ? "filled" : ""} />
                  ))}
                </div>
              </div>
              <h2 className="quiz-title">{questions[step].title}</h2>
              <div className="quiz-options">
                {questions[step].options.map(([value, label, Icon]) => (
                  <button
                    key={value}
                    onClick={() => {
                      setAnswers({ ...answers, [questions[step].key]: value });
                      setStep(step + 1);
                    }}
                  >
                    <Icon size={20} />
                    {label}
                    <ArrowRight size={16} />
                  </button>
                ))}
              </div>
              <button
                className="text-link quiz-reset"
                onClick={() => (step === 0 ? reset() : setStep(step - 1))}
              >
                <ArrowLeft size={14} />
                Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
function ArrowUpRightIcon() {
  return <span aria-hidden="true">↗</span>;
}
