import { SOURCES } from "./config/apis.js";
import { MODE_INFO } from "./config/modes.js";
import { pullSource } from "./services/api-client.js";
import { buildIdea, pickSources } from "./core/generator.js";
import { readSaved, writeSaved } from "./core/storage.js";
import { $, } from "./utils.js";
import { renderIdea, renderMode, renderSaved, renderSources, updateAbsurdity } from "./ui/render.js";

const state = {
  count: 0,
  current: null,
  loading: false,
  saved: readSaved()
};

function toast(message) {
  const element = $("#toast");
  if (!element) return;
  element.textContent = message;
  element.classList.add("is-visible");
  clearTimeout(window.__aleatronToast);
  window.__aleatronToast = setTimeout(() => element.classList.remove("is-visible"), 2200);
}

function ideaAsText(idea) {
  return [`Título: ${idea.title}`, ...idea.fields.map(([label, text]) => `${label}: ${text}`)].join("\n\n");
}

async function generate() {
  if (state.loading) return;

  state.loading = true;
  $("#generate-button").disabled = true;
  $("#source-status-text").textContent = "CONSULTANDO INTERNET…";
  $("#error-note").hidden = true;

  try {
    const mode = $("#mode").value;
    const absurdity = Number($("#absurdity").value);
    let results = await Promise.all(pickSources(SOURCES).map(pullSource));

    for (let attempt = 0; results.filter(result => result.ok).length < 3 && attempt < 2; attempt += 1) {
      const used = new Set(results.map(result => result.source.id));
      const fallbackSources = SOURCES.filter(source => !used.has(source.id));
      results = results.concat(await Promise.all(pickSources(fallbackSources).slice(0, 3).map(pullSource)));
    }

    renderSources(results);
    const idea = buildIdea(results, mode, absurdity);
    state.count += 1;
    renderIdea(idea, state);
    $("#generation-hint").textContent = `${MODE_INFO[mode].name}: ${MODE_INFO[mode].short}`;
  } catch (error) {
    $("#error-note").hidden = false;
    $("#error-note").textContent = `No ha salido nada decente: ${error.message}`;
    $("#source-status-text").textContent = "EL CAOS HA FALLADO";
  } finally {
    state.loading = false;
    $("#generate-button").disabled = false;
  }
}

$("#generate-button")?.addEventListener("click", generate);

$("#mode")?.addEventListener("change", renderMode);

$("#absurdity")?.addEventListener("input", event => updateAbsurdity(event.target.value));

$("#copy-button")?.addEventListener("click", async () => {
  if (!state.current) return;
  try {
    await navigator.clipboard.writeText(ideaAsText(state.current));
    toast("Idea copiada.");
  } catch {
    toast("No se pudo copiar.");
  }
});

$("#save-button")?.addEventListener("click", () => {
  if (!state.current) return;
  if (state.saved.some(idea => idea.id === state.current.id)) {
    toast("Esta idea ya está guardada.");
    return;
  }
  state.saved.unshift(state.current);
  writeSaved(state.saved);
  renderSaved(state.saved, openSavedIdea);
  toast("Idea guardada.");
});

$("#clear-saved")?.addEventListener("click", () => {
  state.saved = [];
  writeSaved(state.saved);
  renderSaved(state.saved, openSavedIdea);
  toast("Archivo vaciado.");
});

function openSavedIdea(idea) {
  renderIdea(idea, state);
  $("#idea-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

renderMode();
updateAbsurdity($("#absurdity")?.value || 87);
renderSaved(state.saved, openSavedIdea);
