import { writeFile } from "node:fs/promises";
const images = {
  "dolomites-lake": "photo-1501785888041-af3ef285b470",
  "dolomites-trail": "photo-1761027436967-63584b301a77",
  "santorini-village": "photo-1533105079780-92b9be482077",
  "kyoto-garden": "photo-1528360983277-13d401cdc186",
  "marrakech-medina": "photo-1489749798305-4fea3ae63d43",
  "maldives-resort": "photo-1573843981267-be1999ff37cd",
  "lisbon-rooftops": "photo-1768501362079-bf04cec711db",
  "lisbon-street": "photo-1548707309-dcebeab9ea9b",
  "iceland-waterfall": "photo-1504829857797-ddff29c27927",
  "cape-coast": "photo-1576485290814-1c72aa4bbb8e",
};
await Promise.all(
  Object.entries(images).map(async ([name, id]) => {
    try {
      const response = await fetch(
        `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=82`,
      );
      if (!response.ok) throw new Error(response.status);
      const bytes = Buffer.from(await response.arrayBuffer());
      await writeFile(`public/images/${name}.jpg`, bytes);
      console.log(`${name}: ${bytes.length} bytes`);
    } catch (error) {
      console.log(`${name}: ${error.message}`);
      process.exitCode = 1;
    }
  }),
);
