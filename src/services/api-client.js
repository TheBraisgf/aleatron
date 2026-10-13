import { decodeHtml } from "../utils.js";

const API_TIMEOUT = 8500;
const TRANSLATE_TIMEOUT = 6000;

async function fetchJson(url, timeout = API_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function translateToSpanish(text) {
  const clean = decodeHtml(text);
  if (!clean || !/[A-Za-z]/.test(clean)) return clean;

  try {
    const data = await fetchJson(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|es`,
      TRANSLATE_TIMEOUT
    );
    const translated = data?.responseData?.translatedText;
    if (translated && translated.toLowerCase() !== clean.toLowerCase()) return decodeHtml(translated);
  } catch {
    // Try the second public translator below.
  }

  try {
    const data = await fetchJson(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(clean)}`,
      TRANSLATE_TIMEOUT
    );
    const translated = Array.isArray(data?.[0]) ? data[0].map(item => item?.[0] || "").join("") : "";
    if (translated) return decodeHtml(translated);
  } catch {
    // A source without a Spanish result is discarded by pullSource().
  }

  return "";
}

export async function pullSource(source) {
  const startedAt = performance.now();

  try {
    const endpoint = typeof source.url === "function" ? source.url() : source.url;
    const raw = await fetchJson(endpoint);
    let value = decodeHtml(source.parse(raw));

    if (!value) throw new Error("Sin datos");

    if (source.lang === "en") {
      value = await translateToSpanish(value);
      if (!value) throw new Error("Traducción no disponible");
    }

    return {
      source,
      value,
      ms: Math.round(performance.now() - startedAt),
      ok: true
    };
  } catch (error) {
    return {
      source,
      ok: false,
      error: error?.name === "AbortError" ? "Tiempo agotado" : error.message
    };
  }
}
