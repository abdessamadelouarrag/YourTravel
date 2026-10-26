import { useState, lazy, Suspense, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css/pagination";
import {
  MapPin,
  Star,
  Heart,
  ArrowUpRight,
  ArrowLeft,
  CalendarDays,
  Wallet,
  Sun,
  Check,
  Plus,
  Images,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { destinations } from "../data/destinations";
import { Button, Reveal, Modal, SectionTitle } from "../components/ui";
import DestinationCard from "../components/DestinationCard";
import NotFound from "./NotFound";
import { galleries } from "../data/galleries";
import Accordion from "../components/Accordion";
import { useTravelContext } from "../hooks/useTravelContext";
const DestinationMap = lazy(() => import("../components/DestinationMap"));
export default function Destination(props) {
  const { plannerUrl } = useTravelContext();
  const { id } = useParams();
  const d = destinations.find((x) => x.id === id);
  const [gallery, setGallery] = useState(false);
  const close = useCallback(() => setGallery(false), []);
  if (!d) return <NotFound />;
  const saved = props.favorites.includes(d.id);
  const related = destinations
    .filter(
      (x) => x.id !== id && (x.type === d.type || x.continent === d.continent),
    )
    .slice(0, 3);
  const galleryItems = galleries[d.id] || [[d.id, d.name]];
  return (
    <div className="page-shell destination-page">
      <section className="detail-hero">
        <img src={d.image} alt={`${d.name}, ${d.country}`} />
        <div className="detail-hero-shade" />
        <div className="container detail-hero-copy">
          <Link className="back-link" to="/explore">
            <ArrowLeft size={17} />
            All destinations
          </Link>
          <span className="eyebrow">{d.tagline}</span>
          <h1>
            {d.name}
            <span>.</span>
          </h1>
          <div>
            <span>
              <MapPin size={17} />
              {d.country}, {d.continent}
            </span>
            <span>
              <Star size={16} fill="currentColor" />
              {d.rating} inspiration rating
            </span>
          </div>
        </div>
        <button className="gallery-button" onClick={() => setGallery(true)}>
          <Images size={17} />
          Show all photos
        </button>
      </section>
      <div className="container detail-layout">
        <div className="detail-main">
          <Reveal>
            <span className="eyebrow">A PLACE THAT STAYS WITH YOU</span>
            <h2>
              Meet your next <span className="serif">great story.</span>
            </h2>
            <p className="detail-description">{d.description}</p>
            <div className="detail-facts">
              <div>
                <CalendarDays />
                <span>
                  Best time to go<strong>{d.season}</strong>
                </span>
              </div>
              <div>
                <Wallet />
                <span>
                  Estimated daily budget
                  <strong>From ${d.price} / person</strong>
                </span>
              </div>
              <div>
                <Sun />
                <span>
                  The feeling<strong>{d.climate} & wonderful</strong>
                </span>
              </div>
            </div>
          </Reveal>
          <Reveal className="detail-section">
            <h2>Don’t leave without…</h2>
            <div className="highlights">
              {d.highlights.map((h, i) => (
                <div key={h}>
                  <span>0{i + 1}</span>
                  <h3>{h}</h3>
                  <Check size={17} />
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="detail-section">
            <span className="eyebrow">MAKE A FEW MEMORIES</span>
            <h2>
              Days well <span className="serif">spent.</span>
            </h2>
            <div className="activities-list">
              {d.activities.map((a, i) => (
                <div key={a.name}>
                  <span className="activity-number">0{i + 1}</span>
                  <div>
                    <h3>{a.name}</h3>
                    <p>
                      {d.interests[i % d.interests.length]} · A little local
                      inspiration
                    </p>
                  </div>
                  <strong>{a.cost ? `$${a.cost}` : "Free"}</strong>
                  <Link
                    to={plannerUrl(d.id, i)}
                    className="icon-button"
                    aria-label={`Add ${a.name} to trip`}
                  >
                    <Plus size={18} />
                  </Link>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="detail-section">
            <h2>A little local perspective.</h2>
            <div className="travel-tip">
              <CompassTip />
              <div>
                <h3>Good to know before you go</h3>
                <p>{d.tip}</p>
              </div>
            </div>
            <Accordion
              items={[
                {
                  title: "What does the daily estimate include?",
                  content:
                    "Our illustrative daily estimates cover accommodation, meals, and local transport per person. Activities and flights are extra. Use the planner to bring your own ideas and budget together.",
                },
                {
                  title: "Can I plan at my own pace?",
                  content:
                    "Absolutely. Start with one to fourteen days, add the experiences you love, and leave a few empty spaces. Your itinerary is editable and saves locally in this browser.",
                },
              ]}
            />
          </Reveal>
          <section className="detail-section">
            <h2>Find your bearings.</h2>
            <Suspense fallback={<div className="skeleton map-skeleton" />}>
              <DestinationMap destination={d} />
            </Suspense>
            <p className="map-note">
              Live map requires an internet connection. Use “Open larger map” if
              tiles are unavailable.
            </p>
          </section>
        </div>
        <aside className="trip-sidebar">
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h3>{d.name} is calling.</h3>
          <p>Give that daydream a little direction.</p>
          <div className="sidebar-price">
            <span>From</span>
            <strong>
              ${d.price}
              <small> / person / day</small>
            </strong>
            <span>Illustrative estimate · Flights excluded</span>
          </div>
          <Button to={plannerUrl(d.id)}>
            Add to my trip
            <Plus size={18} />
          </Button>
          <button
            className={`button outline ${saved ? "saved" : ""}`}
            onClick={() => props.toggleFavorite(d.id)}
          >
            <Heart size={17} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved to your places" : "Save for a little later"}
          </button>
          <div className="sidebar-note">
            <Check size={15} />
            Your pace. Your people. Your kind of trip.
          </div>
        </aside>
      </div>
      <section className="section container">
        <SectionTitle
          eyebrow="KEEP YOUR CURIOSITY GOING"
          title="A few more places to fall for."
          link="Explore everywhere"
          to="/explore"
        />
        <div className="destination-grid">
          {related.map((x) => (
            <DestinationCard key={x.id} destination={x} {...props} />
          ))}
        </div>
      </section>
      {gallery && (
        <Modal title={`A closer look at ${d.name}`} onClose={close}>
          <p className="gallery-disclaimer">
            A few perspectives to spark your curiosity.
          </p>
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            pagination={{ clickable: true }}
            navigation={{ prevEl: ".gallery-prev", nextEl: ".gallery-next" }}
          >
            <div className="gallery-controls">
              <button
                className="icon-button gallery-prev"
                aria-label="Previous image"
              >
                <ChevronLeft />
              </button>
              <button
                className="icon-button gallery-next"
                aria-label="Next image"
              >
                <ChevronRight />
              </button>
            </div>
            {galleryItems.map(([image, caption]) => (
              <SwiperSlide key={image}>
                <img
                  className="gallery-image"
                  src={`/images/${image}.jpg`}
                  alt={caption}
                />
                <p className="gallery-caption">{caption}</p>
              </SwiperSlide>
            ))}
          </Swiper>
        </Modal>
      )}
    </div>
  );
}
function CompassTip() {
  return <MapPin size={25} />;
}
