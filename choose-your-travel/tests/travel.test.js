import test from "node:test";
import assert from "node:assert/strict";
import { destinations } from "../src/data/destinations.js";
import { galleries } from "../src/data/galleries.js";
import { existsSync } from "node:fs";
import {
  filterDestinations,
  recommend,
  tripDays,
  estimateCost,
} from "../src/utils/travel.js";
test("filters combine location, daily budget, climate and interests", () => {
  const results = filterDestinations(destinations, {
    continent: "Asia",
    budget: 100,
    climate: "Warm",
    activity: "Beach",
  });
  assert.deepEqual(
    results.map((d) => d.id),
    ["bali"],
  );
  assert.equal(
    filterDestinations(destinations, { query: "nonexistent" }).length,
    0,
  );
  assert.deepEqual(
    filterDestinations(destinations, { query: "morocco" }).map((d) => d.id),
    ["marrakech"],
  );
});
test("recommendations rank an affordable warm beach escape first", () => {
  const results = recommend(destinations, {
    landscape: "Beach",
    pace: "Nature",
    budget: "Budget",
    weather: "Warm",
    company: "Solo",
  });
  assert.equal(results[0].id, "bali");
  assert.equal(new Set(results.map((d) => d.id)).size, 3);
});
test("itinerary dates count arrival and departure and reject reversed dates", () => {
  assert.equal(tripDays("2026-12-01", "2026-12-03"), 3);
  assert.equal(tripDays("2026-12-01", "2026-12-01"), 1);
  assert.equal(tripDays("2026-12-03", "2026-12-01"), 0);
  assert.equal(tripDays("", ""), 0);
  assert.equal(tripDays("2026-12-31", "2027-01-02"), 3);
});
test("trip estimate includes living costs and every activity for all travelers", () => {
  const plan = {
    start: "2026-12-01",
    end: "2026-12-03",
    travelers: 2,
    itinerary: [
      { activities: [{ cost: 20 }, { cost: 35 }] },
      { activities: [{ cost: 0 }] },
    ],
  };
  assert.equal(estimateCost(plan, { price: 65 }), 500);
});

test("all destinations have locally available photos and galleries", () => {
  for (const destination of destinations) {
    assert.ok(
      existsSync(new URL(`../public${destination.image}`, import.meta.url)),
      destination.name,
    );
    assert.ok(galleries[destination.id].length >= 2);
    for (const [image] of galleries[destination.id])
      assert.ok(
        existsSync(new URL(`../public/images/${image}.jpg`, import.meta.url)),
        image,
      );
  }
});
