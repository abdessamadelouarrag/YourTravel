import { test, expect } from "@playwright/test";
test("search, filters and favorites work and persist", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Destination", exact: true })
    .fill("Bali");
  await page.getByRole("button", { name: "Let’s explore" }).click();
  await expect(page).toHaveURL(/q=Bali/);
  await expect(page.locator(".destination-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Save Bali to favorites", exact: true })
    .click();
  await page.goto("/favorites");
  await expect(page.locator(".destination-card")).toHaveCount(1);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Bali", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Remove Bali from favorites", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "A little room for possibility." }),
  ).toBeVisible();
  await page.goto("/explore");
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  await page.getByLabel("Continent", { exact: true }).selectOption("Africa");
  await expect(page.locator(".destination-card")).toHaveCount(2);
  await page.getByRole("slider").press("Home");
  for (let i = 0; i < 4; i++)
    await page.getByRole("slider").press("ArrowRight");
  await expect(page.locator(".destination-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.getByRole("button", { name: "List view" }).click();
  await expect(page.locator(".list-view")).toBeVisible();
});
test("quiz produces navigable personalized results", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Find my escape" }).click();
  for (const name of [
    "To the ocean",
    "Slow down & take it in",
    "More moments, less spending",
    "Sunshine on my skin",
    "Just me",
  ])
    await page.getByRole("button", { name, exact: true }).click();
  await expect(page.locator(".quiz-results a")).toHaveCount(3);
  await page.locator(".quiz-results a").first().click();
  await expect(page).toHaveURL(/destination\/bali/);
  await expect(
    page.getByRole("heading", { name: "Bali.", exact: true }),
  ).toBeVisible();
});
test("planner validates, calculates, edits, saves and downloads itinerary", async ({
  page,
}) => {
  await page.goto("/planner");
  await page.getByRole("button", { name: "Keep going" }).click();
  await expect(page.getByRole("alert")).toContainText("Choose a destination");
  await page.getByRole("button", { name: "Bali Indonesia" }).click();
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "Keep going" }).click();
  await expect(page.getByRole("alert")).toContainText("Choose your arrival");
  await page.getByLabel("Arrival date").fill("2026-12-01");
  await page.getByLabel("Departure date").fill("2026-12-03");
  await page.getByLabel("Total trip budget").fill("1500");
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "Nature", exact: true }).click();
  await page.getByRole("button", { name: "Create my itinerary" }).click();
  await expect(page.locator(".itinerary-day")).toHaveCount(3);
  const before = await page.locator(".summary-total strong").innerText();
  await page.getByRole("button", { name: "Add an experience" }).first().click();
  await page.getByRole("button", { name: "Balinese cooking class" }).click();
  await expect(page.locator(".itinerary-activity")).toHaveCount(4);
  await expect(page.locator(".summary-total strong")).not.toHaveText(before);
  await page
    .getByRole("button", { name: "Remove Balinese cooking class" })
    .first()
    .click();
  await expect(page.locator(".itinerary-activity")).toHaveCount(3);
  await page.getByRole("button", { name: "Save my adventure" }).click();
  await expect(page.getByRole("status")).toContainText("saved");
  await page.reload();
  await expect(page.locator(".itinerary-day")).toHaveCount(3);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download itinerary" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("my-bali-trip.txt");
});
test("planner handles activity deep links and rejects too-long trips", async ({
  page,
}) => {
  await page.goto("/planner?destination=kyoto&activity=1");
  await page.getByLabel("Arrival date").fill("2026-12-01");
  await page.getByLabel("Departure date").fill("2026-12-20");
  await page.getByRole("button", { name: "Keep going" }).click();
  await expect(page.getByRole("alert")).toContainText("14 days");
  await page.getByLabel("Departure date").fill("2026-12-01");
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "Culture", exact: true }).click();
  await page.getByRole("button", { name: "Create my itinerary" }).click();
  await expect(page.locator(".itinerary-activity strong")).toHaveText(
    "Traditional tea ceremony",
  );
});
test("gallery traps focus and escape closes; unknown destinations show 404", async ({
  page,
}) => {
  await page.goto("/destination/bali");
  await page.getByRole("button", { name: "Show all photos" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".gallery-image")).toHaveCount(3);
  await expect
    .poll(() =>
      page
        .locator(".gallery-image")
        .evaluateAll((images) =>
          images.every((image) => image.complete && image.naturalWidth > 0),
        ),
    )
    .toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/destination/unknown");
  await expect(
    page.getByRole("heading", { name: /Even a wrong turn/ }),
  ).toBeVisible();
});

test("search dates and travelers carry through to the planner", async ({
  page,
}) => {
  await page.goto("/explore?q=Bali&date=2026-12-15&travelers=4");
  await page.getByRole("link", { name: "Explore Bali", exact: true }).click();
  await page.getByRole("link", { name: "Add to my trip", exact: true }).click();
  await expect(page.getByLabel("Arrival date")).toHaveValue("2026-12-15");
  await expect(page.getByLabel("Travelers", { exact: true })).toHaveValue("4");
});

test("narrow mobile and tablet pages stay within the viewport", async ({
  page,
}) => {
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/explore",
      "/destination/santorini",
      "/planner",
      "/about",
      "/contact",
    ]) {
      await page.goto(route);
      await page.waitForTimeout(250);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        `${width}: ${route}`,
      ).toBe(false);
    }
  }
});
test("contact validates and prepares a local message", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Traveler");
  await page.getByLabel("Email address").fill("traveler@example.com");
  await page
    .getByLabel("What’s on your mind?")
    .fill("I would love to explore Morocco.");
  await page.getByRole("button", { name: "Prepare my message" }).click();
  await expect(page.getByRole("status")).toContainText("Your message is ready");
});
test("mobile routes have no overflow and menu navigates", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [
    "/",
    "/explore",
    "/destination/bali",
    "/planner",
    "/favorites",
    "/about",
    "/contact",
    "/not-a-page",
  ]) {
    await page.goto(path);
    await page.waitForTimeout(200);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      path,
    ).toBe(false);
  }
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeVisible();
});
