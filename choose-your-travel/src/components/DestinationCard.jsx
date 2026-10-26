import { Link } from "react-router-dom";
import { Heart, MapPin, Star, ArrowUpRight } from "lucide-react";
import { useTravelContext } from "../hooks/useTravelContext";
export default function DestinationCard({
  destination: d,
  favorites,
  toggleFavorite,
  editorial = false,
}) {
  const saved = favorites.includes(d.id);
  const { destinationUrl } = useTravelContext();
  const detailUrl = destinationUrl(d.id);
  return (
    <article
      className={`destination-card ${editorial ? "editorial-card" : ""}`}
    >
      <div className="card-image">
        <Link to={detailUrl} tabIndex={-1} aria-hidden="true">
          <img
            src={d.image}
            alt={`${d.name}, ${d.country}`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/hero.jpg";
            }}
          />
        </Link>
        <span className="card-category">
          {d.type === "Mountains"
            ? "Into the wild"
            : d.type === "Beach"
              ? "Island time"
              : d.type === "Culture"
                ? "Culture calling"
                : "A little adventure"}
        </span>
        <button
          className={`favorite-button ${saved ? "saved" : ""}`}
          aria-label={`${saved ? "Remove" : "Save"} ${d.name} ${saved ? "from" : "to"} favorites`}
          aria-pressed={saved}
          onClick={() => toggleFavorite(d.id)}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
        {editorial && (
          <div className="editorial-label">
            <span>
              <MapPin size={13} />
              {d.country}
            </span>
            <Link to={detailUrl}>
              <h3>{d.name}</h3>
              <ArrowUpRight />
            </Link>
          </div>
        )}
      </div>
      {!editorial && (
        <div className="card-content">
          <div className="card-title">
            <Link to={detailUrl}>
              <h3>{d.name}</h3>
            </Link>
            <span className="rating">
              <Star size={13} fill="currentColor" />
              {d.rating}
            </span>
          </div>
          <div className="card-location">
            <MapPin size={13} />
            {d.country}
          </div>
          <div className="card-bottom">
            <p>
              From <strong>${d.price}</strong>
              <span> / person / day</span>
            </p>
            <Link
              className="card-arrow"
              to={detailUrl}
              aria-label={`Explore ${d.name}`}
            >
              <ArrowUpRight size={19} />
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}
