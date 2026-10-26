import { Heart, ArrowUpRight } from "lucide-react";
import { destinations } from "../data/destinations";
import DestinationCard from "../components/DestinationCard";
import { Button, Reveal } from "../components/ui";
export default function Favorites(props) {
  const items = destinations.filter((d) => props.favorites.includes(d.id));
  return (
    <div className="page-shell">
      <div className="explore-header">
        <div className="container">
          <span className="eyebrow">KEEP THE GOOD STUFF CLOSE</span>
          <h1>
            Your little <span className="serif">wish list.</span>
          </h1>
          <p>All the places that made you pause. One day starts here.</p>
        </div>
      </div>
      <section className="container favorites-content">
        {items.length ? (
          <>
            <p className="results-heading">
              {items.length} {items.length === 1 ? "place" : "places"} you’d
              love to be
            </p>
            <div className="destination-grid">
              {items.map((d) => (
                <Reveal key={d.id}>
                  <DestinationCard destination={d} {...props} />
                </Reveal>
              ))}
            </div>
            <p className="data-note">
              Your favorites are saved in this browser. A little inspiration,
              always close.
            </p>
          </>
        ) : (
          <div className="empty-state">
            <Heart size={44} strokeWidth={1} />
            <h2>A little room for possibility.</h2>
            <p>
              Tap the heart on a destination you love.
              <br />
              We’ll keep it here for your next daydream.
            </p>
            <Button to="/explore">
              Find a place to fall for
              <ArrowUpRight size={17} />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
