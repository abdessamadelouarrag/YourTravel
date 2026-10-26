import { Compass, Heart, Leaf, ArrowUpRight } from "lucide-react";
import { Reveal, Button } from "../components/ui";
export default function About() {
  return (
    <div className="page-shell about-page">
      <section className="container about-intro">
        <Reveal>
          <span className="eyebrow">FOR THE CURIOUS AT HEART</span>
          <h1>
            Life’s a little richer
            <br />
            when you <span className="serif">wander.</span>
          </h1>
          <p>
            We believe the best journeys bring you a little closer to the world
            — and a little closer to yourself.
          </p>
        </Reveal>
        <div className="about-image">
          <img
            src="/images/dolomites-trail.jpg"
            alt="Sunlit mountain peaks and green alpine slopes in the Dolomites"
          />
          <span>A different perspective changes everything.</span>
        </div>
      </section>
      <section id="thoughtful-travel" className="section container about-story">
        <Reveal>
          <span className="eyebrow">OUR PHILOSOPHY</span>
          <h2>
            Less ticking boxes.
            <br />
            More <span className="serif">feeling something.</span>
          </h2>
        </Reveal>
        <div>
          <p>
            Choose Your Travel is a space for thoughtful discovery. For the trip
            you’ve been dreaming of, the place you’ve never heard of, and the
            adventure that turns out a little differently than planned.
          </p>
          <p>
            We bring places, ideas, and simple planning tools together so you
            can spend more time imagining the journey. Every destination in this
            collection is a starting point — the story you make there is
            entirely your own.
          </p>
          <p>
            This is an independent frontend travel concept. Our destination
            collection, ratings, itineraries, and USD budgets are illustrative
            inspiration. There are no bookings or accounts; your saved places
            and plans stay in your browser.
          </p>
        </div>
      </section>
      <section className="container values-grid">
        {[
          {
            icon: Compass,
            title: "Stay curious",
            text: "Take a different turn. Try something new. Ask the extra question. That’s often where the good stories begin.",
          },
          {
            icon: Leaf,
            title: "Tread lightly",
            text: "Choose local when you can. Respect wildlife and traditions. Leave a place as lovely as you found it.",
          },
          {
            icon: Heart,
            title: "Make it yours",
            text: "A great trip doesn’t look the same for everyone. Travel at your own pace, with the things that matter to you.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <Reveal key={title}>
            <Icon size={30} strokeWidth={1.3} />
            <h3>{title}</h3>
            <p>{text}</p>
          </Reveal>
        ))}
      </section>
      <section className="closing-section container">
        <span className="eyebrow">THERE’S A WHOLE WORLD OUT THERE</span>
        <h2>
          Let’s find your <span className="serif">next chapter.</span>
        </h2>
        <Button to="/explore">
          Follow your curiosity
          <ArrowUpRight size={18} />
        </Button>
      </section>
    </div>
  );
}
