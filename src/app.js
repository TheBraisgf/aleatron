const API_TIMEOUT = 8500;
const $ = (selector) => document.querySelector(selector);

const SOURCES = [
  { id: "useless-facts", name: "Useless Facts", kind: "Dato inútil", icon: "?!", url: "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en", docs: "https://uselessfacts.jsph.pl/", fetch: r => ({ value: r.text }) },
  { id: "cat-facts", name: "Cat Facts", kind: "Biología felina", icon: "↗", url: "https://catfact.ninja/fact", docs: "https://catfact.ninja/", fetch: r => ({ value: r.fact }) },
  { id: "dog-facts", name: "Dog Facts", kind: "Datos perrunos", icon: "⌁", url: "https://dogapi.dog/api/v2/facts", docs: "https://dogapi.dog/", fetch: r => ({ value: r.data?.[0]?.attributes?.body || r.facts?.[0] || r.fact }) },
  { id: "pokeapi", name: "PokéAPI", kind: "Pokémon", icon: "◉", url: () => "https://pokeapi.co/api/v2/pokemon/" + (1 + Math.floor(Math.random() * 1025)), docs: "https://pokeapi.co/", fetch: r => ({ value: prettify(r.name), extra: r.types?.map(t => t.type.name).join(" / ") }) },
  { id: "official-joke", name: "Official Joke API", kind: "Chistes malos", icon: "☻", url: "https://official-joke-api.appspot.com/random_joke", docs: "https://github.com/15Dkatz/official_joke_api", fetch: r => ({ value: [r.setup, r.punchline].filter(Boolean).join(" — ") }) },
  { id: "jokeapi", name: "JokeAPI", kind: "Humor", icon: "↯", url: "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,racist,sexist,explicit&type=single", docs: "https://jokeapi.dev/", fetch: r => ({ value: r.joke || [r.setup, r.delivery].filter(Boolean).join(" — ") }) },
  { id: "chucknorris", name: "Chuck Norris Facts", kind: "Leyenda urbana", icon: "★", url: "https://api.chucknorris.io/jokes/random", docs: "https://api.chucknorris.io/", fetch: r => ({ value: r.value }) },
  { id: "ron-swanson", name: "Ron Swanson Quotes", kind: "Filosofía de bar", icon: "☕", url: "https://ron-swanson-quotes.herokuapp.com/v2/quotes", docs: "https://github.com/jamesseanwright/ron-swanson-quotes", fetch: r => ({ value: Array.isArray(r) ? r[0] : r }) },
  { id: "boredapi", name: "Bored API", kind: "Actividades", icon: "⌂", url: "https://bored-api.appbrewery.com/random", docs: "https://bored-api.appbrewery.com/", fetch: r => ({ value: r.activity, extra: r.type ? "Categoría: " + r.type : "" }) },
  { id: "random-user", name: "Random User", kind: "Persona ficticia", icon: "☺", url: "https://randomuser.me/api/?nat=es,gb,us", docs: "https://randomuser.me/", fetch: r => { const u = r.results?.[0]; return { value: u ? [u.name?.first, u.name?.last].filter(Boolean).join(" ") : "", extra: u ? [u.location?.city, u.location?.country].filter(Boolean).join(", ") : "" }; } },
  { id: "deckofcards", name: "Deck of Cards", kind: "Carta aleatoria", icon: "♠", url: "https://deckofcardsapi.com/api/deck/new/draw/?count=1", docs: "https://deckofcardsapi.com/", fetch: r => ({ value: r.cards?.[0] ? r.cards[0].value + " de " + suitEs(r.cards[0].suit) : "" }) },
  { id: "advice-slip", name: "Advice Slip", kind: "Consejo cuestionable", icon: "✎", url: "https://api.adviceslip.com/advice", docs: "https://api.adviceslip.com/", fetch: r => ({ value: r.slip?.advice }) },
  { id: "dog-ceo", name: "Dog CEO", kind: "Dato perruno", icon: "♧", url: "https://dog.ceo/api/breeds/list/random", docs: "https://dog.ceo/dog-api/", fetch: r => ({ value: "La raza elegida al azar es " + r.message + "." }) }
];

const state = { count: 0, current: null, loading: false, saved: loadSaved(), lastResults: [] };
const problems = ["y descubre que alguien ha convertido esto en un trámite oficial.", "pero la burocracia local exige tres copias y un sacrificio simbólico.", "hasta que aparece una persona que asegura haberlo patentado en 1998.", "y el único experto disponible es un señor que ha venido a cambiar el router.", "aunque todo el mundo insiste en que es perfectamente normal.", "justo cuando un comité internacional decide regularlo.", "pero el sindicato correspondiente se niega a colaborar.", "y ahora tiene que explicárselo a su casero.", "hasta que la situación escala por culpa de una impresora.", "pero resulta que el verdadero problema era el formulario número 7B.", "y por alguna razón, todo depende de una votación en una comunidad de vecinos.", "pero el tutorial oficial dura nueve horas y está en un idioma inventado."];
const bridges = ["Por desgracia", "Lo inquietante es que", "El giro es que", "Todo iba más o menos bien hasta que", "Como era de esperar", "La parte ilegal (presuntamente) es que", "Nadie contaba con que"];
const connectors = ["ha decidido montar una consultora", "se presenta a las elecciones", "quiere ser influencer", "ha heredado una oficina en el infierno", "dirige una secta con newsletter", "exige derechos laborales", "ha abierto una academia online", "está preparando una oposición", "se ha hecho crítico gastronómico", "ha fundado una startup"];
const endings = ["y nadie ha leído los términos y condiciones.", "con la confianza de quien claramente no ha entendido nada.", "mientras suena una versión de jazz de la sintonía de Windows.", "y la única reseña tiene una estrella y dice «interesante».", "aunque Hacienda ya está al corriente.", "por motivos que un abogado recomendaría no investigar.", "y, sorprendentemente, recibe financiación europea."];

function rand(list) { return list[Math.floor(Math.random() * list.length)]; }
function shuffle(list) { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function prettify(value = "") { return value.replace(/-/g, " ").replace(/\b\w/g, m => m.toUpperCase()); }
function suitEs(suit = "") { return ({ DIAMONDS: "diamantes", HEARTS: "corazones", SPADES: "picas", CLUBS: "tréboles" })[suit] || suit.toLowerCase(); }
function escapeText(value) { return String(value ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]); }
function loadSaved() { try { return JSON.parse(localStorage.getItem("aleatron-saved") || "[]"); } catch { return []; } }
function persistSaved() { try { localStorage.setItem("aleatron-saved", JSON.stringify(state.saved)); } catch { toast("El navegador no deja guardar más ideas."); } }
function trimAt(value, max) { const s = String(value ?? "").trim().replace(/\s+/g, " "); if (s.length <= max) return s; const part = s.slice(0, max - 1); return part.slice(0, part.lastIndexOf(" ") > max * .65 ? part.lastIndexOf(" ") : max - 1) + "…"; }
function titleCase(value) { return value ? value.charAt(0).toUpperCase() + value.slice(1) : value; }

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const type = response.headers.get("content-type") || "";
    if (!type.includes("json")) throw new Error("La API no ha devuelto JSON");
    return await response.json();
  } finally { clearTimeout(timeout); }
}
async function pull(source) {
  const start = performance.now();
  try {
    const url = typeof source.url === "function" ? source.url() : source.url;
    const data = source.fetch(await fetchJson(url));
    if (!data?.value) throw new Error("La API no devolvió un dato utilizable");
    return { source, ...data, ms: Math.round(performance.now() - start), ok: true };
  } catch (error) {
    return { source, ok: false, error: error?.name === "AbortError" ? "Tiempo agotado" : error.message };
  }
}
function pickSources() { return shuffle(SOURCES).slice(0, 4 + Math.floor(Math.random() * 2)); }

function makeTitle(mode, a, b) {
  const first = trimAt(a?.value || "un fenómeno inexplicable", 65);
  const second = trimAt(b?.value || "una comunidad de vecinos", 55);
  if (mode === "personaje") return rand([titleCase(first) + ": " + rand(["héroe por accidente", "profesional del desastre", "amenaza administrativa", "villano de media jornada"]), "El último " + rand(["experto", "superviviente", "influencer", "funcionario"]) + " de " + second, rand(["Don", "Doña", "Capitán", "Doctor"]) + " " + titleCase(first)]);
  if (mode === "invento") return rand([titleCase(first) + "®: ahora con " + second, "El " + rand(["anti-", "multi-", "hiper-", "cuántico "]) + titleCase(first), "Una solución de " + second + " para un problema inexistente"]);
  if (mode === "mundo") return rand(["El planeta donde " + first.toLowerCase() + " es ley", "Bienvenidos a " + titleCase(second), "La república independiente de " + first]);
  if (mode === "video") return rand(["Probamos " + first + " durante 24 horas", "POV: " + first + " te debe dinero", "Unboxing de " + second + " (sale mal)"]);
  if (mode === "historia") return rand(["La increíble historia de " + first, titleCase(first) + " y el misterio de " + second, "Nadie esperaba que " + first.toLowerCase() + " acabara así"]);
  return rand([titleCase(first) + " contra " + second, titleCase(first) + ": el incidente", "¿Quién ha autorizado " + second + "?", titleCase(first) + " y otros errores del sistema"]);
}
function makeDescription(mode, a, b, c, absurdity) {
  const subject = trimAt(a?.value || "un hecho aparentemente irrelevante", 115);
  const extra = trimAt(b?.value || "una situación profundamente incómoda", 100);
  const third = trimAt(c?.value || "un trámite municipal", 95);
  const weird = rand(connectors);
  if (mode === "personaje") return "Su rasgo distintivo es que conoce el dato de «" + trimAt(subject, 125) + "». En su tiempo libre, " + weird + ". Su mayor enemigo: " + extra + ". " + rand(endings);
  if (mode === "invento") return "Un dispositivo que combina «" + trimAt(subject, 110) + "» con «" + trimAt(extra, 95) + "». Promete revolucionar un sector que no existe. " + rand(bridges) + ", " + weird + ". " + rand(endings);
  if (mode === "mundo") return "En este universo, el conocimiento de que «" + trimAt(subject, 110) + "» ha cambiado la estructura de la sociedad. Todo se sostiene gracias a «" + trimAt(extra, 100) + "». " + rand(bridges) + ", " + third + ".";
  if (mode === "video") return "Formato: falso documental con presupuesto de 14 €. El reto empieza con «" + trimAt(subject, 100) + "» y termina en «" + trimAt(extra, 100) + "». " + rand(bridges) + ", alguien tiene que presentar una reclamación formal.";
  if (mode === "historia") return "La premisa: «" + trimAt(subject, 120) + "». El protagonista solo quería tener un martes tranquilo, pero «" + trimAt(extra, 105) + "» cambia las reglas. " + rand(bridges) + ", " + weird + ". " + rand(endings);
  const level = absurdity >= 85 ? rand(["la lógica ha dimitido", "el sentido común ha bloqueado el número", "la realidad está en modo avión"]) : absurdity >= 55 ? rand(["todo parece legal a primera vista", "la lógica ha pedido vacaciones", "nadie se ha leído el manual"]) : rand(["es raro, pero los números cuadran", "esto podría tener una explicación", "la realidad aún no ha presentado alegaciones"]);
  return "Se ha detectado «" + subject + "» en combinación con «" + extra + "». " + rand(bridges) + ", " + weird + ". El informe final confirma que " + level + ", " + rand(problems);
}
function buildIdea(results, mode, absurdity) {
  const facts = results.filter(r => r.ok && r.value);
  const primary = rand(facts);
  const secondary = rand(facts.filter(x => x !== primary)) || primary;
  const tertiary = rand(facts.filter(x => x !== primary && x !== secondary)) || secondary;
  const chosen = [...new Set([primary, secondary, tertiary].filter(Boolean))];
  return { id: Date.now() + Math.random(), title: makeTitle(mode, primary, secondary), description: makeDescription(mode, primary, secondary, tertiary, absurdity), mode, absurdity, tags: [...new Set(chosen.map(r => r.source.name.toUpperCase()))].slice(0, 3), sources: [...new Set(facts.map(r => r.source.name))], createdAt: new Date().toISOString() };
}
function updateSourceTiles(results = []) {
  $("#source-grid").innerHTML = SOURCES.map(source => {
    const result = results.find(r => r.source.id === source.id);
    return '<a class="source-tile ' + (result?.ok ? "is-ok is-used" : "") + ' ' + (result && !result.ok ? "is-failed" : "") + '" href="' + source.docs + '" target="_blank" rel="noreferrer" title="Documentación de ' + escapeText(source.name) + '"><span class="source-icon">' + source.icon + '</span><div><strong>' + escapeText(source.name) + '</strong><small>' + (result ? (result.ok ? "Respondió en " + result.ms + " ms" : "No respondió esta vez") : escapeText(source.kind)) + '</small></div><span class="source-state">' + (result ? (result.ok ? "●" : "×") : "↗") + '</span></a>';
  }).join("");
}
function renderIdea(idea) {
  $("#idea-number").textContent = "TIRADA #" + String(state.count).padStart(3, "0");
  $("#idea-tags").innerHTML = idea.tags.map(tag => "<span>" + escapeText(tag) + "</span>").join("") + "<span>" + idea.absurdity + "% ABSURDO</span>";
  const titleParts = idea.title.split(": ");
  $("#idea-title").replaceChildren();
  $("#idea-title").append(document.createTextNode(titleParts[0]));
  if (titleParts.length > 1) {
    $("#idea-title").append(document.createElement("br"));
    const emphasis = document.createElement("em");
    emphasis.textContent = titleParts.slice(1).join(": ");
    $("#idea-title").append(emphasis);
  }
  $("#idea-description").textContent = idea.description;
  $("#idea-footnote").textContent = "FUENTES USADAS: " + idea.sources.join(" · ").toUpperCase();
  $("#idea-doodle").textContent = rand(["✳", "↯", "☻", "※", "✷", "⊹", "?!", "∞"]);
  $("#source-status-text").textContent = idea.sources.length + " FUENTES RESPONDIERON · DATOS REALES";
  $(".result-status").classList.add("live");
  $("#copy-button").disabled = false; $("#save-button").disabled = false;
  $("#idea-card").classList.remove("is-loading", "is-refreshing"); void $("#idea-card").offsetWidth; $("#idea-card").classList.add("is-refreshing");
  updateSourceTiles(state.lastResults);
}
async function generate() {
  if (state.loading) return;
  state.loading = true;
  $("#generate-button").disabled = true;
  $("#generate-button").querySelector("span:nth-child(2)").textContent = "CONSULTANDO EL CAOS…";
  $("#idea-card").classList.add("is-loading");
  $("#error-note").hidden = true;
  $("#source-status-text").textContent = "LLAMANDO A LAS APIS…";
  $("#generation-hint").textContent = "Llamadas HTTP en marcha. Que sea lo que el servidor quiera.";
  const mode = $("#mode").value; const absurdity = Number($("#absurdity").value);
  const selected = pickSources();
  let results = await Promise.all(selected.map(pull));
  let successful = results.filter(r => r.ok && r.value);
  if (successful.length < 2) {
    // Retry failed choices with fresh endpoints from sources that have not been queried yet.
    const alreadyTried = new Set(results.map(r => r.source.id));
    const extras = shuffle(SOURCES.filter(s => !alreadyTried.has(s.id))).slice(0, 5);
    const retries = await Promise.all(extras.map(pull));
    results = results.concat(retries);
    successful = results.filter(r => r.ok && r.value);
  }
  state.lastResults = results; state.count++;
  if (!successful.length) {
    $("#idea-card").classList.remove("is-loading");
    $("#source-status-text").textContent = "LAS APIS HAN HECHO GHOSTING";
    $("#error-note").hidden = false;
    $("#error-note").textContent = "Esta vez no ha respondido ninguna API con datos utilizables. Puede ser un bloqueo de CORS, una caída temporal o problemas de red. Prueba otra vez; Aleatrón no inventa respuestas para fingir que funciona.";
    $("#generation-hint").textContent = "Sin datos reales, no hay humo creativo.";
    updateSourceTiles(results);
  } else {
    const idea = buildIdea(successful, mode, absurdity);
    state.current = idea; renderIdea(idea);
    const failed = results.length - successful.length;
    $("#generation-hint").textContent = failed ? successful.length + " fuentes útiles · " + failed + " han pasado de nosotros." : "Las fuentes han respondido. El azar está de buen humor.";
    if (successful.length < 2) {
      $("#error-note").hidden = false;
      $("#error-note").textContent = "Solo ha respondido una API con datos de texto. La idea se ha construido a partir de ese dato real y combinaciones narrativas locales.";
    }
  }
  $("#generate-button").disabled = false;
  $("#generate-button").querySelector("span:nth-child(2)").textContent = "FABRICAR ABSURDO";
  $("#idea-card").classList.remove("is-loading"); state.loading = false;
}
function toast(message) {
  const el = $("#toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("show"), 2200);
}
function loadSaved() { try { return JSON.parse(localStorage.getItem("aleatron-saved") || "[]"); } catch { return []; } }
function persistSaved() { try { localStorage.setItem("aleatron-saved", JSON.stringify(state.saved)); } catch { toast("El navegador no deja guardar más ideas."); } }
function currentIdeaText(idea) { return idea.title + "\n\n" + idea.description + "\n\nFuentes: " + idea.sources.join(", ") + "\nGenerado por Aleatrón sin IA."; }
async function copyIdea() {
  if (!state.current) return;
  try { await navigator.clipboard.writeText(currentIdeaText(state.current)); toast("Idea copiada. Úsala con responsabilidad."); }
  catch { const area = document.createElement("textarea"); area.value = currentIdeaText(state.current); area.style.position = "fixed"; area.style.opacity = "0"; document.body.append(area); area.select(); const ok = document.execCommand("copy"); area.remove(); toast(ok ? "Idea copiada." : "No se pudo copiar. Selecciona el texto manualmente."); }
}
function saveIdea() {
  if (!state.current) return;
  if (state.saved.some(item => item.title === state.current.title && item.description === state.current.description)) { toast("Esta idea ya está archivada."); return; }
  state.saved.unshift({ ...state.current, id: Date.now() + Math.random() }); state.saved = state.saved.slice(0, 30); persistSaved(); renderSaved(); toast("Añadida al archivo de ideas.");
}
function removeSaved(id) { state.saved = state.saved.filter(item => item.id !== id); persistSaved(); renderSaved(); }
function renderSaved() {
  const list = $("#saved-list");
  if (!state.saved.length) { list.innerHTML = '<p class="empty-saved">Todavía no hay ideas. Qué bonito es no tener antecedentes.</p>'; return; }
  list.innerHTML = state.saved.map((idea, index) => '<article class="saved-card"><div class="saved-card-top"><span>IDEA ARCHIVADA #' + String(state.saved.length - index).padStart(2, "0") + '</span><span>' + new Date(idea.createdAt).toLocaleDateString("es-ES") + '</span></div><h3>' + escapeText(idea.title) + '</h3><p>' + escapeText(idea.description) + '</p><div class="saved-card-top"><span>' + escapeText((idea.sources || []).join(" · ")) + '</span><button type="button" data-remove="' + idea.id + '">ELIMINAR ×</button></div></article>').join("");
  list.querySelectorAll("[data-remove]").forEach(button => button.addEventListener("click", () => removeSaved(Number(button.dataset.remove))));
}
$("#generate-button").addEventListener("click", generate);
$("#absurdity").addEventListener("input", event => { $("#absurdity-value").textContent = event.target.value + "%"; });
$("#copy-button").addEventListener("click", copyIdea);
$("#save-button").addEventListener("click", saveIdea);
$("#clear-saved").addEventListener("click", () => { if (!state.saved.length) { toast("El archivo ya está vacío."); return; } state.saved = []; persistSaved(); renderSaved(); toast("Archivo destruido. No quedan pruebas."); });
$("#mode").addEventListener("change", () => {
  const hints = { caos: "Cada click es una mala decisión nueva.", historia: "Una premisa sin guionista que la frene.", personaje: "No todos los héroes tienen que ser útiles.", video: "La vergüenza ajena también es un formato.", mundo: "Worldbuilding sin comité de ética.", invento: "Soluciones a problemas que no existían." };
  $("#generation-hint").textContent = hints[$("#mode").value];
});
updateSourceTiles();
renderSaved();
