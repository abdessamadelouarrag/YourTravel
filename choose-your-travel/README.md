# Choose Your Travel

A responsive travel discovery and planning frontend built with React, Vite, Tailwind CSS, Motion, Lucide, React Router, Swiper, and React Leaflet.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To build and preview the production bundle:

```sh
npm run build
npm run preview
```

## What works

- Cinematic homepage, sticky navigation, scroll reveals, swipeable collections, and a five-question recommendation quiz.
- Nine destination pages with photo galleries, activities, seasonal guidance, practical tips, and interactive OpenStreetMap maps.
- Search, category, continent, country, budget, climate, and activity filters, with grid/list views and URL-backed filter state.
- Favorites saved in browser local storage.
- A four-step planner for 1–14 days and 1–8 travelers, with interest-based activity suggestions, editable daily timelines, custom experiences, cost estimates, local saving, and text downloads.
- About, contact, favorites, and 404 pages. The contact form prepares a message locally and supports copying; it does not send messages.
- Accessible form labels, visible keyboard focus, modal focus containment, Escape dismissal, skip navigation, and reduced-motion support.

This is a frontend demonstration. Ratings, costs, and generated itineraries are illustrative mock data. There are no real bookings, availability checks, authentication, payment processing, or message delivery. Daily living estimates include accommodation, food, and local transport; selected activities are added separately. Flights are excluded. All prices are in USD.

Favorites use `cyt-favorites` and the saved itinerary uses `cyt-trip` in local storage. Saved data stays in the current browser and origin. Save actions report storage failures, and itineraries can also be downloaded.

## Design system

The visual direction combines expansive destination photography, an editorial type hierarchy, warm paper backgrounds, compact pill filters, quiet borders, and restrained motion.

| Token             | Value                              |
| ----------------- | ---------------------------------- |
| Ocean             | `#123C48`                          |
| Teal              | `#18A999`                          |
| Paper             | `#F8F7F4`                          |
| Sunset            | `#FF936B`                          |
| Ink               | `#182B31`                          |
| Headings          | Manrope, self-hosted variable font |
| Body              | Inter, self-hosted variable font   |
| Editorial accents | Georgia italic                     |
| Content width     | 1240px; fluid on smaller screens   |
| Main breakpoints  | 1150px, 900px, 700px, 360px        |

## Architecture

```text
src/
  components/   Navigation, cards, search, quiz, accordion, map, UI primitives
  data/         Destination records and curated galleries
  hooks/        Browser-local persistence
  layouts/      Shared page shell, document titles, scroll behavior
  pages/        Home, Explore, Destination, Planner, Favorites, About, Contact, 404
  routes/       Lazy-loaded React Router configuration
  styles/       Tailwind import, design tokens, component and responsive styles
  utils/        Pure filtering, scoring, date and budget logic
public/
  images/       Locally hosted destination photography
  fonts/        Locally hosted Inter and Manrope
tests/          Unit and browser integration tests
scripts/        Repeatable asset download and preview check utilities
```

## Verification

```sh
npm test
npx playwright install chromium
# With npm run dev running in another terminal:
npx playwright test
```

Unit tests cover compound filters, recommendation ranking, inclusive date calculations, and multi-traveler cost estimates. Browser tests cover persistence, discovery, validation, activity editing, saving, downloading, galleries, contact preparation, and mobile navigation/overflow.

`node scripts/browser-check.mjs` captures desktop and mobile previews in `artifacts/` while the development server is running.

## Assets and hosting

Travel photos are served locally from Unsplash originals; the asset download scripts retain their source image identifiers. The corrected Lisbon rooftop photograph is by [Steve Matthews](https://unsplash.com/photos/aerial-view-of-terracotta-rooftops-in-a-european-city-wNKrweQSNOk); the Tre Cime trail photograph is by [Luka Verč](https://unsplash.com/photos/a-winding-mountain-path-leads-to-jagged-peaks-XSer9s3A3B4). Photography is provided under the [Unsplash License](https://unsplash.com/license). Inter and Manrope are available under the SIL Open Font License; licenses are included in `public/fonts/`.

The interactive map uses OpenStreetMap tiles and needs network access. Map attribution and a larger-map fallback link are included. Other destination photographs and fonts are local.

The app builds to `dist/`. `.openai/hosting.json` contains the private Sites project identity. Other static hosts must rewrite unknown navigation paths to `index.html` for React Router.
