import { useState, useCallback, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Plus,
  Trash2,
  CalendarDays,
  Users,
  Wallet,
  MapPin,
  Compass,
  Save,
  RotateCcw,
  Sparkles,
  Download,
  Mountain,
  Leaf,
  Utensils,
  Landmark,
  Palmtree,
  Gem,
} from "lucide-react";
import { destinations } from "../data/destinations";
import { tripDays, estimateCost } from "../utils/travel";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Button, Modal, Toast } from "../components/ui";
const initial = {
  destination: "",
  start: "",
  end: "",
  budget: 1500,
  travelers: 2,
  interests: [],
  itinerary: [],
};
const interestIcons = {
  Adventure: Mountain,
  Nature: Leaf,
  Food: Utensils,
  Culture: Landmark,
  Beach: Palmtree,
  Luxury: Gem,
};
export default function Planner() {
  const [params] = useSearchParams();
  const [saved, setSaved, storageError] = useLocalStorage("cyt-trip", null);
  const resumable =
    saved &&
    destinations.some((d) => d.id === saved.destination) &&
    Array.isArray(saved.interests) &&
    Array.isArray(saved.itinerary) &&
    tripDays(saved.start, saved.end) >= 1 &&
    tripDays(saved.start, saved.end) <= 14 &&
    saved.itinerary.length === tripDays(saved.start, saved.end) &&
    saved.itinerary.every(
      (day) =>
        Array.isArray(day.activities) &&
        day.activities.every(
          (a) =>
            typeof a.name === "string" &&
            Number.isFinite(a.cost) &&
            a.cost >= 0,
        ),
    ) &&
    Number(saved.travelers) >= 1 &&
    Number(saved.travelers) <= 8 &&
    Number(saved.budget) >= 50;
  const requestedDate = /^\d{4}-\d{2}-\d{2}$/.test(params.get("date") || "")
    ? params.get("date")
    : "";
  const requestedTravelers = Math.max(
    1,
    Math.min(8, Number(params.get("travelers")) || 2),
  );
  const queryDestination = destinations.find(
    (d) => d.id === params.get("destination"),
  );
  const [plan, setPlan] = useState(() =>
    queryDestination
      ? {
          ...initial,
          start: requestedDate,
          travelers: requestedTravelers,
          destination: queryDestination.id,
          requestedActivity: params.get("activity"),
        }
      : resumable
        ? saved
        : { ...initial, start: requestedDate, travelers: requestedTravelers },
  );
  const [step, setStep] = useState(queryDestination ? 1 : resumable ? 3 : 0),
    [error, setError] = useState(""),
    [toast, setToast] = useState(""),
    [activityDay, setActivityDay] = useState(null),
    [custom, setCustom] = useState({ name: "", cost: 0 });
  const destination = destinations.find((d) => d.id === plan.destination);
  const days = tripDays(plan.start, plan.end);
  const closeModal = useCallback(() => setActivityDay(null), []);
  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(""), 4000);
      return () => clearTimeout(timeout);
    }
  }, [toast]);
  const update = (key, value) => {
    setPlan((p) => ({
      ...p,
      [key]: value,
      ...(key === "destination"
        ? { itinerary: [], requestedActivity: undefined }
        : {}),
    }));
    setError("");
  };
  function validate() {
    if (step === 0 && !destination)
      return "Choose a destination to start your story.";
    if (step === 1) {
      if (!plan.start || !plan.end)
        return "Choose your arrival and departure dates.";
      if (!days) return "Your departure needs to be on or after your arrival.";
      if (days > 14)
        return "Let’s plan up to 14 days at a time. Choose a shorter date range.";
      if (!Number.isFinite(Number(plan.budget)) || Number(plan.budget) < 50)
        return "Add a total budget of at least $50.";
      if (Number(plan.travelers) < 1 || Number(plan.travelers) > 8)
        return "Choose between 1 and 8 travelers.";
    }
    if (step === 2 && !plan.interests.length)
      return "Pick at least one thing you love.";
    return "";
  }
  function generate() {
    const matching = destination.activities.filter((a, i) =>
      plan.interests.includes(
        destination.interests[i % destination.interests.length],
      ),
    );
    const pool = matching.length ? matching : destination.activities;
    const requested = destination.activities[Number(plan.requestedActivity)];
    const itinerary = Array.from({ length: days }, (_, i) => {
      const existing = plan.itinerary[i];
      return (
        existing || {
          day: i + 1,
          activities: [
            {
              ...(i === 0 && requested ? requested : pool[i % pool.length]),
              uid: crypto.randomUUID(),
            },
          ],
        }
      );
    });
    setPlan((p) => ({ ...p, itinerary }));
  }
  function next() {
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    if (step === 2) generate();
    setStep(step + 1);
    window.scrollTo({ top: 100, behavior: "smooth" });
  }
  function save() {
    if (setSaved({ ...plan, savedAt: new Date().toISOString() })) {
      setToast("Your trip is saved in this browser.");
    }
  }
  function addActivity(activity) {
    setPlan((p) => ({
      ...p,
      itinerary: p.itinerary.map((day, i) =>
        i === activityDay
          ? {
              ...day,
              activities: [
                ...day.activities,
                { ...activity, uid: crypto.randomUUID() },
              ],
            }
          : day,
      ),
    }));
    setActivityDay(null);
    setCustom({ name: "", cost: 0 });
  }
  function removeActivity(dayIndex, uid) {
    setPlan((p) => ({
      ...p,
      itinerary: p.itinerary.map((day, i) =>
        i === dayIndex
          ? { ...day, activities: day.activities.filter((a) => a.uid !== uid) }
          : day,
      ),
    }));
  }
  function download() {
    const text = `YOUR ${destination.name.toUpperCase()} STORY\n${plan.start} — ${plan.end} · ${plan.travelers} travelers\nBudget: $${Number(plan.budget).toLocaleString()} · Estimated total: $${cost.toLocaleString()}\n\n${plan.itinerary.map((day) => `DAY ${day.day}\n${day.activities.map((a) => `  • ${a.name} — $${a.cost} / person`).join("\n") || "  A little room for spontaneity."}`).join("\n\n")}\n\nIllustrative USD estimates, including daily living costs and activities. Flights excluded.\nMade with Choose Your Travel.`;
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-${destination.id}-trip.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
  const cost = destination ? estimateCost(plan, destination) : 0;
  return (
    <div className="page-shell planner-page">
      <div className="container">
        <header className="planner-header">
          <div>
            <span className="eyebrow">TURN “ONE DAY” INTO DAY ONE</span>
            <h1>
              Your trip. <span className="serif">Your story.</span>
            </h1>
            <p>A little structure. A lot of room for possibility.</p>
          </div>
          {saved && (
            <span className="saved-plan-label">
              <Check size={15} />A saved adventure lives here
            </span>
          )}
        </header>
        <div className="wizard-progress" aria-label={`Step ${step + 1} of 4`}>
          {[
            "The place",
            "The little details",
            "Your kind of trip",
            "Your adventure",
          ].map((label, i) => (
            <button
              key={label}
              onClick={() => {
                if (i < step) {
                  setStep(i);
                  setError("");
                }
              }}
              disabled={i >= step}
              aria-current={i === step ? "step" : undefined}
              className={i === step ? "current" : i < step ? "complete" : ""}
            >
              <span>{i < step ? <Check size={16} /> : i + 1}</span>
              {label}
              <div />
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <section className="wizard-step">
                <span className="eyebrow">FIRST, THE DAYDREAM</span>
                <h2>
                  Where are we <span className="serif">going?</span>
                </h2>
                <p>Start with somewhere that makes you feel something.</p>
                <div className="planner-destination-grid">
                  {destinations.map((d) => (
                    <button
                      className={plan.destination === d.id ? "selected" : ""}
                      key={d.id}
                      onClick={() => update("destination", d.id)}
                      aria-pressed={plan.destination === d.id}
                    >
                      <img src={d.image} alt="" />
                      <span>
                        <strong>{d.name}</strong>
                        <small>{d.country}</small>
                      </span>
                      <span className="destination-select-check">
                        {plan.destination === d.id ? (
                          <Check size={16} />
                        ) : (
                          <Plus size={16} />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}
            {step === 1 && (
              <section className="wizard-step details-step">
                <div>
                  <span className="eyebrow">
                    MAKE A LITTLE ROOM IN YOUR CALENDAR
                  </span>
                  <h2>
                    The little <span className="serif">details.</span>
                  </h2>
                  <p>When, who, and how much. We’ll work around you.</p>
                  <div className="planner-form">
                    <div className="form-row">
                      <label>
                        Arrival date
                        <input
                          type="date"
                          required
                          value={plan.start}
                          onChange={(e) => update("start", e.target.value)}
                        />
                      </label>
                      <label>
                        Departure date
                        <input
                          type="date"
                          required
                          min={plan.start}
                          value={plan.end}
                          onChange={(e) => update("end", e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        <Users size={15} />
                        Travelers
                        <select
                          aria-label="Travelers"
                          value={plan.travelers}
                          onChange={(e) =>
                            update("travelers", Number(e.target.value))
                          }
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option value={n} key={n}>
                              {n} {n === 1 ? "person" : "people"}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <Wallet size={15} />
                        Total trip budget (USD)
                        <input
                          type="number"
                          min="50"
                          max="1000000"
                          step="50"
                          value={plan.budget}
                          onChange={(e) => update("budget", e.target.value)}
                        />
                      </label>
                    </div>
                    <p className="form-hint">
                      Plan 1–14 days. Budget covers all travelers, excluding
                      flights. Estimates are for inspiration.
                    </p>
                    {days > 0 && days <= 14 && (
                      <div className="duration-note">
                        <CalendarDays size={18} />
                        {days} {days === 1 ? "day" : "days"} of possibility,{" "}
                        {plan.travelers}{" "}
                        {Number(plan.travelers) === 1
                          ? "traveler"
                          : "travelers"}
                        .
                      </div>
                    )}
                  </div>
                </div>
                <div className="selected-destination">
                  <img src={destination?.image} alt={destination?.name} />
                  <span>
                    <MapPin size={14} />
                    {destination?.country}
                    <h3>{destination?.name}</h3>
                    <small>From ${destination?.price} / person / day</small>
                  </span>
                </div>
              </section>
            )}
            {step === 2 && (
              <section className="wizard-step interests-step">
                <span className="eyebrow">MORE OF WHAT YOU LOVE</span>
                <h2>
                  What’s your kind of <span className="serif">wonder?</span>
                </h2>
                <p>Pick a few things that make your heart a little happier.</p>
                <div className="interest-grid">
                  {Object.entries(interestIcons).map(([interest, Icon]) => (
                    <button
                      key={interest}
                      className={
                        plan.interests.includes(interest) ? "selected" : ""
                      }
                      aria-pressed={plan.interests.includes(interest)}
                      onClick={() =>
                        update(
                          "interests",
                          plan.interests.includes(interest)
                            ? plan.interests.filter((x) => x !== interest)
                            : [...plan.interests, interest],
                        )
                      }
                    >
                      <Icon size={32} strokeWidth={1.3} />
                      <strong>{interest}</strong>
                      {plan.interests.includes(interest) && <Check size={16} />}
                    </button>
                  ))}
                </div>
                <div className="duration-note">
                  <Sparkles size={18} />
                  We’ll use these to suggest a starting point. Make every day
                  your own.
                </div>
              </section>
            )}
            {step === 3 && destination && (
              <section className="itinerary-layout">
                <div className="itinerary-main">
                  <span className="eyebrow">
                    A LITTLE PLAN FOR A GREAT ADVENTURE
                  </span>
                  <h2>
                    Your {destination.name}{" "}
                    <span className="serif">story.</span>
                  </h2>
                  <div className="itinerary-meta">
                    <span>
                      <CalendarDays size={15} />
                      {plan.start} — {plan.end}
                    </span>
                    <span>
                      <Users size={15} />
                      {plan.travelers} travelers
                    </span>
                  </div>
                  <div className="itinerary-timeline">
                    {plan.itinerary.map((day, i) => (
                      <div className="itinerary-day" key={day.day}>
                        <div className="day-marker">
                          {String(day.day).padStart(2, "0")}
                        </div>
                        <div className="day-content">
                          <div className="day-title">
                            <h3>
                              Day {day.day}
                              <span>
                                {new Date(
                                  new Date(plan.start + "T12:00:00").getTime() +
                                    i * 86400000,
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </h3>
                            <span>
                              {day.activities.length}{" "}
                              {day.activities.length === 1
                                ? "experience"
                                : "experiences"}
                            </span>
                          </div>
                          {day.activities.length ? (
                            day.activities.map((a) => (
                              <div className="itinerary-activity" key={a.uid}>
                                <Compass size={19} />
                                <div>
                                  <strong>{a.name}</strong>
                                  <span>A little {destination.name} magic</span>
                                </div>
                                <span className="activity-price">
                                  {a.cost ? `$${a.cost}` : "Free"}
                                  <small>/ person</small>
                                </span>
                                <button
                                  className="icon-button remove-activity"
                                  onClick={() => removeActivity(i, a.uid)}
                                  aria-label={`Remove ${a.name}`}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="free-day">
                              A little room for spontaneity. Add something you
                              love.
                            </p>
                          )}
                          <button
                            className="add-activity"
                            onClick={() => setActivityDay(i)}
                          >
                            <Plus size={16} />
                            Add an experience
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <aside className="trip-summary">
                  <img src={destination.image} alt={destination.name} />
                  <div className="summary-content">
                    <span className="eyebrow">YOUR ADVENTURE AT A GLANCE</span>
                    <h3>{destination.name}, here you come.</h3>
                    <div className="summary-line">
                      <span>
                        Daily living · {days} days × {plan.travelers}
                      </span>
                      <strong>
                        $
                        {(
                          destination.price *
                          days *
                          Number(plan.travelers)
                        ).toLocaleString()}
                      </strong>
                    </div>
                    <div className="summary-line">
                      <span>Selected experiences</span>
                      <strong>
                        $
                        {(
                          cost -
                          destination.price * days * Number(plan.travelers)
                        ).toLocaleString()}
                      </strong>
                    </div>
                    <div className="summary-total">
                      <span>Estimated total</span>
                      <strong>${cost.toLocaleString()}</strong>
                    </div>
                    <div
                      className={`budget-status ${cost > Number(plan.budget) ? "over-budget" : ""}`}
                    >
                      {cost <= Number(plan.budget) ? (
                        <Check size={15} />
                      ) : (
                        <Wallet size={15} />
                      )}{" "}
                      {cost <= Number(plan.budget)
                        ? `$${(Number(plan.budget) - cost).toLocaleString()} of your budget to spare`
                        : `$${(cost - Number(plan.budget)).toLocaleString()} above your budget`}
                    </div>
                    <p className="form-hint">
                      Illustrative estimates in USD. Daily living includes
                      accommodation, food & local transport. Activities are
                      added separately. Flights excluded.
                    </p>
                    <Button onClick={save}>
                      <Save size={17} />
                      Save my adventure
                    </Button>
                    <Button variant="outline" onClick={download}>
                      <Download size={16} />
                      Download itinerary
                    </Button>
                    <button
                      className="text-link"
                      onClick={() => {
                        setStep(1);
                        setError("");
                      }}
                    >
                      <RotateCcw size={14} />
                      Adjust the little details
                    </button>
                  </div>
                </aside>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}
        {storageError && (
          <div className="form-error" role="alert">
            Your browser could not save this trip. Download the itinerary to
            keep a copy.
          </div>
        )}
        {step < 3 && (
          <div className="wizard-footer">
            {step > 0 ? (
              <button
                className="text-link"
                onClick={() => {
                  setStep(step - 1);
                  setError("");
                }}
              >
                <ArrowLeft size={16} />A step back
              </button>
            ) : (
              <span className="form-hint">
                No bookings. No pressure. Just a little possibility.
              </span>
            )}
            <Button onClick={next}>
              {step === 2 ? "Create my itinerary" : "Keep going"}
              <ArrowRight size={17} />
            </Button>
          </div>
        )}
      </div>
      {activityDay !== null && (
        <Modal
          title={`A little something for day ${activityDay + 1}`}
          onClose={closeModal}
        >
          <p className="modal-description">
            Choose an experience or add an idea of your own.
          </p>
          <div className="activity-picker">
            {destination.activities.map((a) => (
              <button key={a.name} onClick={() => addActivity(a)}>
                <span>
                  {a.name}
                  <small>
                    {a.cost ? `$${a.cost} / person` : "Free to explore"}
                  </small>
                </span>
                <Plus size={18} />
              </button>
            ))}
          </div>
          <form
            className="custom-activity"
            onSubmit={(e) => {
              e.preventDefault();
              if (custom.name.trim())
                addActivity({
                  name: custom.name.trim(),
                  cost: Number(custom.cost),
                });
            }}
          >
            <h3>Something you have in mind?</h3>
            <label>
              Experience
              <input
                required
                maxLength={120}
                placeholder="A long lunch, a secret beach…"
                value={custom.name}
                onChange={(e) => setCustom({ ...custom, name: e.target.value })}
              />
            </label>
            <label>
              Cost per person (USD)
              <input
                type="number"
                min="0"
                max="100000"
                step="1"
                required
                value={custom.cost}
                onChange={(e) => setCustom({ ...custom, cost: e.target.value })}
              />
            </label>
            <Button type="submit">
              Add my own idea
              <Plus size={16} />
            </Button>
          </form>
        </Modal>
      )}
      {toast && <Toast>{toast}</Toast>}
    </div>
  );
}
