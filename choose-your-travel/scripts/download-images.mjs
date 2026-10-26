import { mkdir, writeFile } from "node:fs/promises";
const photos = {
  "bali-coast": "photo-1573790387438-4da905039392",
  "bali-aerial": "photo-1555400038-63f5ba517a47",
  hero: "photo-1510414842594-a61c69b5ae57",
  bali: "photo-1537996194471-e657df975ab4",
  dolomites: "photo-1464822759023-fed622ff2c3b",
  santorini: "photo-1613395877344-13d4a8e0d49e",
  kyoto: "photo-1493976040374-85c8e12f0c0e",
  marrakech: "photo-1539020140153-e479b8c22e70",
  maldives: "photo-1514282401047-d79a71a590e8",
  lisbon: "photo-1555881400-74d7acaacd8b",
  iceland: "photo-1476610182048-b716b8518aae",
  cape: "photo-1580060839134-75a5edca2e99",
  alps: "photo-1469521669194-babb45599def",
  escape: "photo-1441974231531-c6227db76b6e",
};
await mkdir("public/images", { recursive: true });
await Promise.all(
  Object.entries(photos).map(async ([name, id]) => {
    try {
      const response = await fetch(
        `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${name === "hero" ? 2400 : 1000}&q=85`,
      );
      if (!response.ok) throw new Error(response.status);
      const data = Buffer.from(await response.arrayBuffer());
      await writeFile(`public/images/${name}.jpg`, data);
      console.log(`${name}: ${data.length} bytes`);
    } catch (e) {
      console.error(`${name}: ${e.message}`);
      process.exitCode = 1;
    }
  }),
);
