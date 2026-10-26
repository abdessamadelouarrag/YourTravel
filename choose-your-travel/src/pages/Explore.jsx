import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  MapPin,
  X,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import { destinations, categories } from "../data/destinations";
import { filterDestinations } from "../utils/travel";
import DestinationCard from "../components/DestinationCard";
import { Reveal, Button } from "../components/ui";
import { useTravelContext } from "../hooks/useTravelContext";
export default function Explore(props) {
  const { plannerUrl } = useTravelContext();
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false),
    [view, setView] = useState("grid");
  const filters = {
    query: params.get("q") || "",
    continent: params.get("continent") || "All",
    country: params.get("country") || "All",
    budget: Number(params.get("budget") || 300),
    climate: params.get("climate") || "All",
    activity: params.get("activity") || "All",
    category: params.get("category") || categories[0],
  };
  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === "All" || !value || value === categories[0]) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };
  const items = useMemo(
    () => filterDestinations(destinations, filters),
    [params.toString()],
  );
  const countries = [...new Set(destinations.map((d) => d.country))].sort();
  return (
    <div className="page-shell">
      <div className="explore-header">
        <div className="container">
          <span className="eyebrow">THE WORLD IS A WONDERFUL PLACE</span>
          <h1>
            Find your <span className="serif">somewhere.</span>
          </h1>
          <p>
            A place to get lost. A place to feel found. A place that’s yours.
          </p>
        </div>
      </div>
      <div className="container explore-body">
        {(params.has("date") || params.has("travelers")) && (
          <div className="search-context">
            <span>
              <MapPin size={15} /> Your adventure
              {params.get("date") ? ` · from ${params.get("date")}` : ""}
              {params.get("travelers")
                ? ` · ${params.get("travelers")} travelers`
                : ""}
            </span>
            <Link className="text-link" to={plannerUrl()}>
              Start planning <ArrowUpRight size={15} />
            </Link>
          </div>
        )}
        <form className="explore-toolbar" onSubmit={(e) => e.preventDefault()}>
          <label className="explore-search">
            <Search size={20} />
            <input
              placeholder="Where would you love to go?"
              aria-label="Search destinations"
              value={filters.query}
              onChange={(e) => update("q", e.target.value)}
            />
            {filters.query && (
              <button
                type="button"
                className="icon-button"
                aria-label="Clear search"
                onClick={() => update("q", "")}
              >
                <X size={17} />
              </button>
            )}
          </label>
          <button
            type="button"
            className={`filter-toggle ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
          >
            <SlidersHorizontal size={17} />
            Filters
          </button>
        </form>
        <div className="category-tabs explore-tabs">
          {categories.map((c) => (
            <button
              key={c}
              className={filters.category === c ? "active" : ""}
              onClick={() => update("category", c)}
            >
              {c}
            </button>
          ))}
        </div>
        {showFilters && (
          <div className="filter-panel">
            <label>
              Continent
              <select
                aria-label="Continent"
                value={filters.continent}
                onChange={(e) => update("continent", e.target.value)}
              >
                <option>All</option>
                {["Africa", "Asia", "Europe"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Country
              <select
                aria-label="Country"
                value={filters.country}
                onChange={(e) => update("country", e.target.value)}
              >
                <option>All</option>
                {countries.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Climate
              <select
                aria-label="Climate"
                value={filters.climate}
                onChange={(e) => update("climate", e.target.value)}
              >
                <option>All</option>
                {["Warm", "Cool", "Cold"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              My kind of trip
              <select
                aria-label="My kind of trip"
                value={filters.activity}
                onChange={(e) => update("activity", e.target.value)}
              >
                <option>All</option>
                {[
                  "Adventure",
                  "Nature",
                  "Food",
                  "Culture",
                  "Beach",
                  "Luxury",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label className="budget-range">
              Daily budget: up to ${filters.budget}
              <input
                type="range"
                min="50"
                max="300"
                step="5"
                value={filters.budget}
                onChange={(e) => update("budget", e.target.value)}
              />
            </label>
            <button className="text-link" onClick={() => setParams({})}>
              Reset filters
              <X size={14} />
            </button>
          </div>
        )}
        <div className="results-heading">
          <span>
            <strong>{items.length}</strong> places to spark your curiosity
          </span>
          <div className="view-toggle">
            <button
              className={view === "grid" ? "active" : ""}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={view === "list" ? "active" : ""}
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              <List size={19} />
            </button>
          </div>
        </div>
        {items.length ? (
          <div
            className={`destination-grid ${view === "list" ? "list-view" : ""}`}
          >
            {items.map((d, i) => (
              <Reveal key={d.id} delay={(i % 3) * 0.04}>
                <DestinationCard destination={d} {...props} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <CompassIcon />
            <h2>A little further off the map.</h2>
            <p>
              No places match this combination. Try a wider budget or a
              different filter.
            </p>
            <Button onClick={() => setParams({})}>
              Show all destinations
              <ArrowUpRight size={16} />
            </Button>
          </div>
        )}
        <div className="data-note">
          <MapPin size={15} /> A little inspiration, thoughtfully curated. Daily
          budgets are illustrative estimates per person, excluding flights.
        </div>
      </div>
    </div>
  );
}
function CompassIcon() {
  return <MapPin size={40} strokeWidth={1} />;
}
