import { useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Compass,
  Route,
  Heart,
  Palmtree,
  Mountain,
  Landmark,
  Sparkles,
  Globe2,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import SearchBar from "../components/SearchBar";
import DestinationCard from "../components/DestinationCard";
import { Button, Reveal, SectionTitle } from "../components/ui";
import { destinations, categories } from "../data/destinations";
import { filterDestinations } from "../utils/travel";
import EscapeQuiz from "../components/EscapeQuiz";
export default function Home(props) {
  const [category, setCategory] = useState(categories[0]);
  const icons = [Globe2, Palmtree, Mountain, Landmark, Compass];
  const items = filterDestinations(destinations, { category });
  return (
    <>
      <HeroSection />
      <div className="search-container container">
        <SearchBar />
      </div>
      <section className="intro-strip container">
        <div>
          <span className="tiny-sun">✳</span>
          <span>Good trips start with a little curiosity.</span>
        </div>
        <span>Find your place in the world.</span>
        <span className="intro-coordinates">
          8°24′34.2″S &nbsp; 115°11′20.0″E
        </span>
      </section>
      <section id="discover" className="section container discover">
        <Reveal>
          <SectionTitle
            eyebrow="WHERE WILL CURIOSITY TAKE YOU?"
            title={
              <>
                Somewhere extraordinary.
                <br />
                <span className="muted-heading">Something just for you.</span>
              </>
            }
            description="Big adventures, quiet escapes, and everything in between."
            link="Explore all destinations"
            to="/explore"
          />
        </Reveal>
        <div
          className="category-tabs"
          role="group"
          aria-label="Destination categories"
        >
          {categories.map((c, i) => {
            const Icon = icons[i];
            return (
              <button
                key={c}
                className={category === c ? "active" : ""}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
              >
                <Icon size={17} />
                {c}
              </button>
            );
          })}
        </div>
        <div className="home-destination-grid">
          {items.slice(0, 4).map((d, i) => (
            <Reveal key={d.id} delay={i * 0.06}>
              <DestinationCard destination={d} {...props} />
            </Reveal>
          ))}
        </div>
        <div className="under-grid">
          <span>
            <span className="teal-dot" /> Thoughtfully picked. Endlessly
            inspiring.
          </span>
          <Link
            className="text-link"
            to={"/explore?category=" + encodeURIComponent(category)}
          >
            Find your next adventure <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="escape-section container">
        <EscapeQuiz {...props} />
      </section>
      <section className="section container experience-section">
        <Reveal>
          <SectionTitle
            eyebrow="FOLLOW YOUR FEELING"
            title={<>A different kind of getaway.</>}
            description="Don’t just pick a place. Choose how you want to feel."
          />
          <div className="experience-grid">
            {[
              {
                title: "Closer to nature",
                sub: "A little less noise. A little more wonder.",
                image: "dolomites-trail",
                query: "Nature",
                label: "Breathe it all in",
              },
              {
                title: "Lost in the right direction",
                sub: "New streets. New flavors. New perspectives.",
                image: "kyoto",
                query: "Culture",
                label: "Follow your curiosity",
              },
              {
                title: "On island time",
                sub: "Saltwater days and nowhere to rush.",
                image: "maldives",
                query: "Beach",
                label: "Find your slower pace",
              },
            ].map((x, i) => (
              <Link
                key={x.title}
                to={"/explore?activity=" + x.query}
                className={`experience-card experience-${i}`}
              >
                <img
                  src={`/images/${x.image}.jpg`}
                  alt={x.title}
                  loading="lazy"
                />
                <span className="experience-number">
                  0{i + 1} / THE WAY YOU WANDER
                </span>
                <div>
                  <span>{x.label}</span>
                  <h3>{x.title}</h3>
                  <p>{x.sub}</p>
                  <span className="experience-arrow">
                    <ArrowUpRight size={21} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>
      <section className="planning-section">
        <div className="container planning-layout">
          <Reveal className="planning-copy">
            <span className="eyebrow">
              A LITTLE PLAN. A LOT OF POSSIBILITY.
            </span>
            <h2>
              Your next great story
              <br />
              starts <span className="serif">right here.</span>
            </h2>
            <p>
              Turn “one day” into day one. Bring your ideas together in a trip
              that’s as unique as you are.
            </p>
            <div className="planning-features">
              {[
                {
                  icon: MapPin,
                  title: "Your places, your pace",
                  text: "Choose the places that speak to you.",
                },
                {
                  icon: Route,
                  title: "Make every day your own",
                  text: "Build an itinerary with room for spontaneity.",
                },
                {
                  icon: Heart,
                  title: "Keep the good stuff close",
                  text: "Save your plans. Pick up where you left off.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title}>
                  <span>
                    <Icon size={20} />
                  </span>
                  <div>
                    <h4>{title}</h4>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button to="/planner">
              Let’s plan something great
              <ArrowUpRight size={17} />
            </Button>
            <small>No sign-up. Just possibilities.</small>
          </Reveal>
          <Reveal className="planner-preview">
            <div className="preview-photo">
              <img
                src="/images/bali.jpg"
                alt="Lush Balinese landscape"
                loading="lazy"
              />
              <div className="preview-photo-label">
                <span>YOUR NEXT CHAPTER</span>
                <h3>A week in Bali</h3>
                <span>
                  <MapPin size={13} />
                  Indonesia &nbsp;·&nbsp; 7 days of possibility
                </span>
              </div>
              <span className="preview-badge">
                <Sparkles size={13} />
                Made for you
              </span>
            </div>
            <div className="preview-itinerary">
              <div className="preview-itinerary-heading">
                <strong>A little look at day one</strong>
                <span>01 / 07</span>
              </div>
              {[
                {
                  time: "08:00",
                  title: "Chase the morning light",
                  description: "Tegallalang rice terraces",
                },
                {
                  time: "12:30",
                  title: "A taste of somewhere new",
                  description: "A Balinese cooking class",
                },
                {
                  time: "17:00",
                  title: "Let the day slow down",
                  description: "Sunset at Uluwatu",
                },
              ].map((x) => (
                <div className="preview-event" key={x.time}>
                  <span>{x.time}</span>
                  <div>
                    <strong>{x.title}</strong>
                    <p>{x.description}</p>
                  </div>
                  <Check size={14} />
                </div>
              ))}
            </div>
            <div className="preview-sticker">
              <Compass size={26} />
              <span>
                Less planning.
                <br />
                <strong>More living.</strong>
              </span>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section container inspiration">
        <Reveal>
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE NEXT PLACE ON YOUR LIST</span>
              <h2>Worth a little daydream.</h2>
            </div>
            <div className="carousel-controls">
              <button
                className="icon-button inspiration-prev"
                aria-label="Previous destinations"
              >
                <ChevronLeft />
              </button>
              <button
                className="icon-button inspiration-next"
                aria-label="Next destinations"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <Swiper
            modules={[Navigation, A11y]}
            navigation={{
              prevEl: ".inspiration-prev",
              nextEl: ".inspiration-next",
            }}
            spaceBetween={22}
            slidesPerView={1.2}
            breakpoints={{
              600: { slidesPerView: 2.2 },
              1000: { slidesPerView: 3 },
            }}
          >
            {destinations.slice(4).map((d) => (
              <SwiperSlide key={d.id}>
                <DestinationCard destination={d} editorial {...props} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Reveal>
      </section>
      <section className="closing-section container">
        <Reveal>
          <span className="eyebrow">THE BEST THINGS AREN’T THINGS.</span>
          <h2>
            They’re the places.
            <br />
            The people. <span className="serif">The feeling.</span>
          </h2>
          <p>Go somewhere that stays with you.</p>
          <Button to="/explore">
            Find your somewhere
            <ArrowUpRight size={18} />
          </Button>
          <span className="closing-doodle">↗</span>
        </Reveal>
      </section>
    </>
  );
}
