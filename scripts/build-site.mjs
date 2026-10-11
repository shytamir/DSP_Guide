import { generateSite, writeSite } from "./lib/site-builder.mjs";
const [directory, ...args] = process.argv.slice(2);
if (!directory)
  throw Error(
    "Usage: node scripts/build-site.mjs <empty-site-directory> [--preview zh-CN|de|ja] [--segment A|B|C|D|E|F]",
  );
const option = (name) =>
  args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
const preview = option("--preview");
const segment = option("--segment");
if (segment && !preview) throw Error("Segments are private previews only");
for (let i = 0; i < args.length; i += 2)
  if (!["--preview", "--segment"].includes(args[i]) || !args[i + 1])
    throw Error("Unknown or incomplete argument");
const files = generateSite({ preview, segment });
writeSite(directory, files);
console.log(
  `${preview ? "PRIVATE PREVIEW" : "Release site"}: ${files.size} files -> ${directory}`,
);
