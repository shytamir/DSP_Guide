export const components = Object.freeze({
  buildCard: Object.freeze({ className: "build-card", nativeTags: Object.freeze(["details"]) }),
  productionReference: Object.freeze({ className: "production-reference", nativeTags: Object.freeze(["details"]) }),
  itemReference: Object.freeze({ className: "proto-ref", idAttribute: "data-item-id" }),
  technologyReference: Object.freeze({ className: "tech-ref", idAttribute: "data-tech-id", nativeTags: Object.freeze(["button"]) }),
  productionArrow: Object.freeze({ className: "production-arrow", idAttribute: "data-producer-item-id" }),
  routeMap: Object.freeze({ className: "route-map", nativeTags: Object.freeze(["ul", "ol"]) }),
  routeRow: Object.freeze({ className: "route-row", nativeTags: Object.freeze(["li"]) }),
});

const voidElements = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function getAttribute(openingTag, name) {
  const escapedName = escapeRegExp(name);
  const match = openingTag.match(new RegExp(`(?:^|\\s)${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>]+))`, "i"));
  return match ? match[1] ?? match[2] ?? match[3] : null;
}

export function hasAttribute(openingTag, name) {
  return new RegExp(`(?:^|\\s)${escapeRegExp(name)}(?:\\s|=|/?>)`, "i").test(openingTag);
}

export function hasClass(openingTag, className) {
  return (getAttribute(openingTag, "class") || "").split(/\s+/).includes(className);
}

export function isNativeComponent(element, contract) {
  return !contract.nativeTags || contract.nativeTags.includes(element.tag);
}

export function findElementsByClass(source, className) {
  const openingPattern = /<([A-Za-z][\w:-]*)\b[^>]*>/g;
  const elements = [];
  for (const opening of source.matchAll(openingPattern)) {
    const openingTag = opening[0];
    if (!hasClass(openingTag, className)) continue;
    const tag = opening[1].toLowerCase();
    const contentStart = opening.index + openingTag.length;
    if (voidElements.has(tag) || /\/>$/.test(openingTag)) {
      elements.push({ tag, openingTag, inner: "", full: openingTag, index: opening.index, end: contentStart });
      continue;
    }

    const tokenPattern = new RegExp(`<\\/?${escapeRegExp(tag)}\\b[^>]*>`, "gi");
    tokenPattern.lastIndex = contentStart;
    let depth = 1;
    let closing = null;
    for (const token of source.matchAll(tokenPattern)) {
      if (token.index < contentStart) continue;
      depth += /^<\//.test(token[0]) ? -1 : 1;
      if (depth === 0) {
        closing = token;
        break;
      }
    }
    if (!closing) continue;
    const end = closing.index + closing[0].length;
    elements.push({
      tag,
      openingTag,
      inner: source.slice(contentStart, closing.index),
      full: source.slice(opening.index, end),
      index: opening.index,
      end,
    });
  }
  return elements;
}

export function replaceElementsByClass(source, className, replacer) {
  let result = source;
  const elements = findElementsByClass(source, className);
  for (let index = elements.length - 1; index >= 0; index -= 1) {
    const element = elements[index];
    result = `${result.slice(0, element.index)}${replacer(element)}${result.slice(element.end)}`;
  }
  return result;
}

export function elementTextByClass(source, className) {
  const element = findElementsByClass(source, className)[0];
  return element ? stripMarkup(element.inner) : "";
}

export function stripMarkup(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
