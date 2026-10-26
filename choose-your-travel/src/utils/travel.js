export function filterDestinations(items, filters = {}) {
  const {
    query = "",
    continent = "All",
    country = "All",
    budget = 300,
    climate = "All",
    activity = "All",
    category = "All destinations",
  } = filters;
  return items.filter(
    (d) =>
      `${d.name} ${d.country}`.toLowerCase().includes(query.toLowerCase()) &&
      (continent === "All" || d.continent === continent) &&
      (country === "All" || d.country === country) &&
      d.price <= Number(budget) &&
      (climate === "All" || d.climate === climate) &&
      (activity === "All" || d.interests.includes(activity)) &&
      (category === "All destinations" ||
        (category === "Beach escapes"
          ? d.type === "Beach"
          : category === "Mountain retreats"
            ? d.type === "Mountains"
            : category === "City & culture"
              ? d.type === "Culture"
              : ["Adventure", "Mountains"].includes(d.type))),
  );
}
export function recommend(items, answers) {
  return items
    .map((d) => ({
      destination: d,
      score:
        (d.type === answers.landscape ? 4 : 0) +
        (d.interests.includes(answers.pace) ? 3 : 0) +
        (answers.budget === "Budget"
          ? d.price <= 100
            ? 3
            : 0
          : d.interests.includes("Luxury")
            ? 3
            : 0) +
        (d.climate === answers.weather ? 2 : 0) +
        (answers.company === "Family" && d.interests.includes("Beach")
          ? 1
          : 0) +
        (answers.company === "Friends" && d.interests.includes("Adventure")
          ? 1
          : 0) +
        (answers.company === "Couple" && d.interests.includes("Luxury")
          ? 1
          : 0) +
        (answers.company === "Solo" && d.interests.includes("Culture") ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.destination);
}
export function tripDays(start, end) {
  if (!start || !end) return 0;
  return Math.max(
    0,
    Math.round(
      (new Date(end + "T00:00:00Z") - new Date(start + "T00:00:00Z")) /
        86400000,
    ) + 1,
  );
}
export function estimateCost(plan, destination) {
  const days = tripDays(plan.start, plan.end);
  const activities = (plan.itinerary || [])
    .flatMap((day) => day.activities || [])
    .reduce((sum, a) => sum + Number(a.cost || 0), 0);
  return (days * destination.price + activities) * Number(plan.travelers || 1);
}
