import { MODE_INFO } from "../config/modes.js";
import { rand, shuffle, titleCase, trimAt } from "../utils.js";

const bridges = [
  "Por desgracia", "Lo inquietante es que", "El giro es que", "Todo iba bien hasta que",
  "Como era de esperar", "La parte ilegal (presuntamente) es que", "Nadie contaba con que"
];

const connectors = [
  "ha decidido montar una consultora", "se presenta a las elecciones", "quiere ser influencer",
  "ha heredado una oficina en el infierno", "dirige una secta con newsletter", "exige derechos laborales",
  "ha abierto una academia online", "está preparando una oposición", "se ha hecho crítico gastronómico",
  "ha fundado una startup"
];

const endings = [
  "y nadie ha leído los términos y condiciones.",
  "con la confianza de quien claramente no ha entendido nada.",
  "aunque Hacienda ya está al corriente.",
  "por motivos que un abogado recomendaría no investigar.",
  "y, sorprendentemente, recibe financiación europea."
];

function fact(result, fallback) {
  return trimAt(result?.value || fallback, 150);
}

function makeTitle(mode, first, second) {
  const x = trimAt(first?.value || "un fenómeno inexplicable", 65);
  const y = trimAt(second?.value || "una comunidad de vecinos", 55);

  if (mode === "personaje") return rand([`${titleCase(x)}: profesional del desastre`, `El último experto en ${y}`, `Doctor ${titleCase(x)}`]);
  if (mode === "invento") return rand([`${titleCase(x)}®: ahora con ${y}`, `El anti-${titleCase(x)}`, `La solución definitiva para ${y}`]);
  if (mode === "mundo") return rand([`El mundo donde ${x.toLowerCase()} es ley`, `Bienvenidos a ${titleCase(y)}`, `La república independiente de ${x}`]);
  if (mode === "video") return rand([`Probamos ${x} durante 24 horas`, `POV: ${x} te arruina el día`, `Unboxing de ${y} (sale mal)`]);
  if (mode === "historia") return rand([`La increíble historia de ${x}`, `${titleCase(x)} y el misterio de ${y}`, `Nadie esperaba que ${x.toLowerCase()} acabara así`]);
  return rand([`${titleCase(x)} contra ${y}`, `${titleCase(x)}: el incidente`, `¿Quién ha autorizado ${y}?`]);
}

function makeFields(mode, first, second, third, absurdity) {
  const x = fact(first, "un dato aparentemente irrelevante");
  const y = fact(second, "una situación profundamente incómoda");
  const z = fact(third, "un trámite municipal");
  const bridge = rand(bridges);
  const connector = rand(connectors);
  const ending = rand(endings);
  const reality = absurdity >= 85 ? "la lógica ha dimitido" : absurdity >= 55 ? "la lógica ha pedido vacaciones" : "los números cuadran";

  if (mode === "historia") return [
    ["Premisa", `Todo comienza cuando alguien descubre que «${x}». Lo que parecía una anécdota cambia por completo cuando «${y}».`],
    ["Protagonista", `Una persona aparentemente normal que ${connector} y que solo quería tener un martes tranquilo.`],
    ["Antagonista", `${titleCase(z)} se convierte en el obstáculo central. No parece peligroso, pero tiene exactamente el poder necesario para arruinarlo todo.`],
    ["Reglas del mundo", `Cuando algo queda registrado oficialmente, la realidad está obligada a comportarse como si fuera cierto.`],
    ["Conflicto", `El protagonista debe decidir entre arreglar «${x}» o aprovecharse de «${y}» antes de que todo sea irreversible.`],
    ["Giro", `${bridge}, se descubre que «${z}» llevaba años siendo la pieza que faltaba.`],
    ["Final posible", `El problema se resuelve, pero solo después de que ${connector}. ${ending}`]
  ];

  if (mode === "personaje") return [
    ["Quién es", `Una persona obsesionada con «${x}». Nadie sabe por qué, incluida ella.`],
    ["Objetivo", `Quiere convertir «${y}» en una profesión respetable aunque nadie se lo haya pedido.`],
    ["Profesión", `${titleCase(z)} / consultor independiente / experto autoproclamado.`],
    ["Habilidad inútil", `Puede explicar durante veinte minutos cualquier cosa relacionada con «${x}», pero nunca sabe cuándo parar.`],
    ["Defecto", `Confunde seguridad con tener una opinión sobre absolutamente todo.`],
    ["Enemigo", `${titleCase(y)}. No parece una amenaza hasta que descubre que puede denunciarle por un formulario.`],
    ["Giro", `En realidad, ${connector}.`],
    ["Arco", `Empieza queriendo demostrar que tenía razón y termina aceptando que quizá el problema era él. Solo quizá.`]
  ];

  if (mode === "video") return [
    ["Hook", `«Hoy vamos a descubrir qué pasa si mezclamos ${x} con ${y}.»`],
    ["Premisa", `Un reto aparentemente sencillo que utiliza dos datos reales y termina escalando hasta algo completamente absurdo.`],
    ["Estructura", `1. Presentar el dato. 2. Explicar la regla. 3. Primer intento. 4. Todo empieza a salir mal. 5. Consecuencia inesperada. 6. Remate.`],
    ["Momentos clave", `El descubrimiento de «${z}», el primer fracaso público y el momento en que alguien propone una solución todavía peor.`],
    ["Remate", `${bridge}, ${connector}.`],
    ["CTA", `«Si queréis que probemos otra combinación todavía peor, decidme cuál.»`]
  ];

  if (mode === "mundo") return [
    ["Concepto", `Un mundo donde «${x}» es un hecho cotidiano y «${y}» forma parte de la infraestructura básica de la sociedad.`],
    ["Regla principal", `Lo imposible deja de ser extraño cuando aparece publicado en un documento oficial.`],
    ["Sociedad", `La gente organiza su vida alrededor de ${z}. Hay profesiones, leyes y conflictos enteros dedicados a ello.`],
    ["Costumbres", `Los ciudadanos consideran completamente normal ${connector}. Lo raro es intentar vivir de una manera convencional.`],
    ["Conflicto", `Alguien descubre que las reglas que sostienen el mundo tienen una contradicción.`],
    ["Facciones", `Quienes quieren conservar el sistema frente a quienes quieren romperlo.`],
    ["Giro", `El mundo no funciona por accidente: alguien diseñó estas reglas y espera que alguien las descubra.`]
  ];

  if (mode === "invento") return [
    ["Nombre", `${titleCase(x)}®`],
    ["Problema", `Nadie tiene realmente este problema, pero después de explicar «${y}» durante treinta segundos empieza a parecer urgente.`],
    ["Solución", `Un dispositivo que combina «${x}» y «${z}» para solucionar una necesidad completamente inventada.`],
    ["Funcionamiento", `El usuario pulsa un botón y confía plenamente en que algo importante esté ocurriendo en el interior.`],
    ["Público objetivo", `Personas que dicen «yo esto me lo compraría» antes de preguntar cuánto cuesta.`],
    ["Ventaja", `${reality}.`],
    ["Defecto", `Nadie sabe repararlo y el manual recomienda fingir que nunca existió.`],
    ["Anuncio", `«Porque quizá no lo necesitas. Pero si lo tienes, ¿cómo vas a volver atrás?»`]
  ];

  return [
    ["Premisa", `Una combinación imposible de «${x}» y «${y}» se convierte inesperadamente en una idea que podría funcionar.`],
    ["Protagonista", `Alguien que ${connector} y comete el error de tomárselo en serio.`],
    ["Conflicto", `Todo se complica cuando aparece «${z}» y convierte una tontería en un problema de dimensiones absurdas.`],
    ["Giro", `${bridge}, ${reality}.`],
    ["Final posible", `La idea sobrevive, contra todo pronóstico. ${ending}`]
  ];
}

export function pickSources(sources) {
  return shuffle(sources).slice(0, 5);
}

export function buildIdea(results, mode, absurdity) {
  const usable = results.filter(result => result.ok && result.value);
  if (usable.length < 2) throw new Error("No hay suficientes fuentes traducidas para fabricar una idea.");

  const [first, second, third] = shuffle(usable);
  return {
    id: Date.now() + Math.random(),
    title: makeTitle(mode, first, second),
    fields: makeFields(mode, first, second, third, absurdity),
    sources: [first, second, third].filter(Boolean).map(result => result.source.name),
    mode,
    absurdity
  };
}

export function getMode(mode) {
  return MODE_INFO[mode] || MODE_INFO.caos;
}
