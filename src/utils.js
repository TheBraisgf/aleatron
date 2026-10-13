export const $ = selector => document.querySelector(selector);

export function rand(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function prettify(value = "") {
  return value.replace(/-/g, " ").replace(/\b\w/g, match => match.toUpperCase());
}

export function suitEs(value = "") {
  return {
    DIAMONDS: "diamantes",
    HEARTS: "corazones",
    SPADES: "picas",
    CLUBS: "tréboles"
  }[value] || value.toLowerCase();
}

export function trimAt(value, maxLength) {
  const text = String(value ?? "").trim().replace(/\s+/g, " ");
  if (text.length <= maxLength) return text;
  const partial = text.slice(0, maxLength - 1);
  const cut = partial.lastIndexOf(" ");
  return (cut > maxLength * 0.65 ? partial.slice(0, cut) : partial) + "…";
}

export function titleCase(value) {
  return value ? value[0].toUpperCase() + value.slice(1) : value;
}

export function decodeHtml(value = "") {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = String(value);
  return textarea.value.replace(/\s+/g, " ").trim();
}
