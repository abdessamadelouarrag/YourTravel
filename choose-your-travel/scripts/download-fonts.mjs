import { mkdir, writeFile } from "node:fs/promises";
await mkdir("public/fonts", { recursive: true });
for (const [name, family] of [
  ["inter", "Inter"],
  ["manrope", "Manrope"],
]) {
  const response = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@400..800&display=swap`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      },
    },
  );
  if (!response.ok) throw Error(response.status);
  const css = await response.text();
  const matches = [...css.matchAll(/url\((https:[^)]+)\)/g)];
  const url = matches.at(-1)?.[1];
  if (!url) throw Error("Font URL missing");
  const font = await fetch(url);
  if (!font.ok) throw Error(font.status);
  const bytes = Buffer.from(await font.arrayBuffer());
  await writeFile(`public/fonts/${name}.woff2`, bytes);
  console.log(
    `${name}: ${bytes.length} bytes, signature ${bytes.subarray(0, 4).toString()}`,
  );
}
