import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const maximumLineLength = 320;
const failures = [];

function listFiles(directory, extensions) {
  return fs
    .readdirSync(path.join(root, directory), { withFileTypes: true })
    .flatMap((entry) => {
      const relative = path.join(directory, entry.name);
      if (entry.isDirectory()) return listFiles(relative, extensions);
      return extensions.has(path.extname(entry.name)) ? [relative] : [];
    });
}

const files = [
  "index.html",
  ...listFiles("assets/css", new Set([".css"])),
  ...listFiles("assets/js", new Set([".js"])),
  ...listFiles("scripts", new Set([".cjs", ".mjs", ".ps1"])),
  ...listFiles(".github/workflows", new Set([".yaml", ".yml"])),
].sort();

for (const relative of files) {
  const source = fs.readFileSync(path.join(root, relative), "utf8");
  const lines = source.split(/\r?\n/);

  if (!source.endsWith("\n"))
    failures.push(`${relative}: missing final newline`);

  lines.forEach((line, index) => {
    if (line.length > maximumLineLength) {
      failures.push(
        `${relative}:${index + 1}: ${line.length} characters exceeds the ${maximumLineLength}-character limit`,
      );
    }
    if (/\s+$/.test(line))
      failures.push(`${relative}:${index + 1}: trailing whitespace`);
    if (line.includes("\t"))
      failures.push(`${relative}:${index + 1}: tab indentation`);
  });
}

if (failures.length) {
  console.error(
    `Source readability validation failed with ${failures.length} error(s):`,
  );
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `Source readability validation passed: ${files.length} first-party source files, maximum line length ${maximumLineLength}, no tabs or trailing whitespace.`,
);
