import { MODE_INFO } from "../config/modes.js";
import { $, decodeHtml } from "../utils.js";

export function renderMode() {
  const mode = $("#mode")?.value || "caos";
  const info = MODE_INFO[mode];
  if (!info) return;

  $("#mode-name").textContent = info.name;
  $("#mode-description").textContent = info.description;
  $("#mode-output").textContent = `SALIDA: ${info.output}`;
  $("#generation-hint").textContent = info.short;
}

export function updateAbsurdity(value) {
  const number = Number(value);
  $("#absurdity-value").textContent = `${number}%`;
  $("#absurdity-description").textContent = number < 35
    ? "Raro, pero todavía podría pasarle a alguien."
    : number < 60
      ? "La realidad empieza a perder credibilidad."
      : number < 80
        ? "Aquí ya hacen falta explicaciones y probablemente un abogado."
        : number < 95
          ? "La lógica ha solicitado la baja voluntaria."
          : "La realidad ha dejado de contestar al teléfono.";

  document.documentElement.style.setProperty("--range-progress", `${((number - 20) / 80) * 100}%`);
}

export function renderIdea(idea, state) {
  state.current = idea;
  $("#idea-number").textContent = `TIRADA #${String(state.count).padStart(3, "0")}`;
  $("#idea-title").textContent = idea.title;
  $("#idea-description").textContent = `${MODE_INFO[idea.mode].name}. Ficha generada a partir de datos públicos.`;

  const tags = $("#idea-tags");
  tags.innerHTML = "";
  [...idea.sources, `${idea.absurdity}% ABSURDO`].forEach(tag => {
    const element = document.createElement("span");
    element.textContent = decodeHtml(tag);
    tags.append(element);
  });

  const fields = $("#idea-fields");
  fields.innerHTML = "";
  idea.fields.forEach(([label, text]) => {
    const wrapper = document.createElement("div");
    const heading = document.createElement("strong");
    const paragraph = document.createElement("p");
    wrapper.className = "idea-field";
    heading.textContent = label;
    paragraph.textContent = text;
    wrapper.append(heading, paragraph);
    fields.append(wrapper);
  });

  $("#idea-footnote").textContent = `FUENTES USADAS: ${idea.sources.join(" · ")}`;
  $("#copy-button").disabled = false;
  $("#save-button").disabled = false;
  $("#source-status-text").textContent = "IDEA FABRICADA";
}

export function renderSources(results) {
  const grid = $("#source-grid");
  grid.innerHTML = "";

  results.forEach(result => {
    const tile = document.createElement("div");
    tile.className = `source-tile ${result.ok ? "is-ok" : "is-error"}`;
    tile.innerHTML = `<span class="source-icon">${result.source.icon}</span><div><strong>${result.source.name}</strong><small>${result.ok ? `${result.source.kind} · ${result.ms} ms` : result.error}</small></div>`;
    grid.append(tile);
  });
}

export function renderSaved(saved, onOpen) {
  const list = $("#saved-list");
  if (!saved.length) {
    list.innerHTML = '<p class="empty-saved">Todavía no hay ideas. Qué bonito es no tener antecedentes.</p>';
    return;
  }

  list.innerHTML = "";
  saved.forEach(idea => {
    const card = document.createElement("article");
    card.className = "saved-card";
    card.innerHTML = `<div><small>${MODE_INFO[idea.mode]?.name || "Idea"}</small><h3></h3></div><button type="button">↗</button>`;
    card.querySelector("h3").textContent = idea.title;
    card.querySelector("button").onclick = () => onOpen(idea);
    list.append(card);
  });
}
