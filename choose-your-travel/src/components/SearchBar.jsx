import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CalendarDays, Users, Search, Wallet } from "lucide-react";
export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState(""),
    [date, setDate] = useState(""),
    [travelers, setTravelers] = useState("2"),
    [budget, setBudget] = useState("300");
  function search(e) {
    e.preventDefault();
    const params = new URLSearchParams({ q: query, travelers, budget });
    if (date) params.set("date", date);
    navigate("/explore?" + params);
  }
  return (
    <form className="search-bar" onSubmit={search}>
      <label className="search-field destination-field">
        <MapPin />
        <span>
          <strong>Where to?</strong>
          <input
            aria-label="Destination"
            placeholder="A place on your mind"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </span>
      </label>
      <label className="search-field">
        <CalendarDays />
        <span>
          <strong>When?</strong>
          <input
            type="date"
            aria-label="Travel date"
            min={new Date().toLocaleDateString("en-CA")}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </span>
      </label>
      <label className="search-field">
        <Users />
        <span>
          <strong>Who’s coming?</strong>
          <select
            aria-label="Travelers"
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "traveler" : "travelers"}
              </option>
            ))}
          </select>
        </span>
      </label>
      <label className="search-field budget-field">
        <Wallet />
        <span>
          <strong>Your budget</strong>
          <select
            aria-label="Daily budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="300">A little flexible</option>
            <option value="75">Under $75 / day</option>
            <option value="150">Under $150 / day</option>
            <option value="250">Under $250 / day</option>
          </select>
        </span>
      </label>
      <button className="search-submit" type="submit">
        <Search size={19} />
        <span>Let’s explore</span>
        <ArrowIcon />
      </button>
    </form>
  );
}
function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}
