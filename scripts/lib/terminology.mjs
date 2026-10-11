import fs from "node:fs";
import crypto from "node:crypto";

export const localeFolders = { "zh-CN": "2052", de: "1031", ja: "1041" };
export const rankPatterns = {
  "zh-CN": "等级 {n}",
  de: "Stufe {n}",
  ja: "レベル {n}",
};
export const sha256 = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");
export const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
export const graphFile =
  "dsp_universal_end_product_dag_v1_0/dsp_universal_end_product_graph_v1_0.json";

export function requiredTerms() {
  const graph = readJson(graphFile);
  const nodes = new Map(graph.nodes.map((node) => [node.node_id, node]));
  const tech = readJson("assets/data/tech-reference.json");
  const details = readJson("assets/data/tech-tooltip-details.json");
  const html = fs.readFileSync("index.html", "utf8");
  const items = new Set(
    [...html.matchAll(/data-item-id="(\d+)"/g)].map((m) => Number(m[1])),
  );
  for (const detail of Object.values(details)) {
    if (detail.cube) items.add(detail.cube.itemId);
    for (const unlock of detail.unlocks || []) items.add(unlock.itemId);
  }
  const ids = [
    ...Object.keys(tech).map((id) => `tech:${id}`),
    ...[...items].sort((a, b) => a - b).map((id) => `item:${id}`),
  ];
  return Object.fromEntries(
    ids.map((id) => {
      const node = nodes.get(id);
      if (!node?.name_raw) throw Error(`Missing retained identity: ${id}`);
      return [
        id,
        {
          key: node.name_raw,
          ...(id.startsWith("tech:")
            ? {
                english: tech[node.game_id].name,
                level: tech[node.game_id].level || 0,
              }
            : {}),
        },
      ];
    }),
  );
}

// Native tables supply base names in this snapshot. If a future table adds a
// rank, remove only a recognized suffix matching the retained integer.
export function nativeBase(name, level) {
  if (!level) return name;
  return name
    .replace(
      new RegExp(`\\s*(?:Lv\\.?|Level|Stufe|等级|レベル)\\s*${level}$`, "iu"),
      "",
    )
    .trim();
}

export function qualifiedName(record, locale) {
  const base = nativeBase(record.native, record.level);
  return record.level > 0
    ? `${base} ${rankPatterns[locale].replace("{n}", record.level)}`
    : base;
}
