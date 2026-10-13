import { MODE_INFO } from "../config/modes.js";
import { CREATIVE_BANK } from "../config/creative-bank.js";
import { rand, shuffle, titleCase, trimAt } from "../utils.js";

const bridges = [
  "Por desgracia", "Lo inquietante es que", "El giro es que", "Todo iba bien hasta que",
  "Como era de esperar", "La parte ilegal (presuntamente) es que", "Nadie contaba con que",
  "Lo verdaderamente preocupante es que", "Contra todo pronóstico", "La explicación resulta ser peor",
  "A partir de ahí", "El problema aparece cuando", "Nadie había previsto que", "La teoría se rompe cuando",
  "El detalle que cambia todo es que"
];

const endings = [
  "y nadie ha leído los términos y condiciones.",
  "con la confianza de quien claramente no ha entendido nada.",
  "aunque Hacienda ya está al corriente.",
  "por motivos que un abogado recomendaría no investigar.",
  "y, sorprendentemente, recibe financiación europea.",
  "sin que nadie consiga explicar quién dio permiso.",
  "y el lunes siguiente todo vuelve a parecer normal.",
  "con una factura que nadie recuerda haber aprobado.",
  "y una reunión extraordinaria que podría haberse evitado.",
  "para desgracia de todos los implicados."
];

function fact(result, fallback) {
  return trimAt(result?.value || fallback, 150);
}

function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "algo completamente innecesario");
}

function pick(list, fallback) {
  return rand(list?.length ? list : [fallback]);
}

function makeTitle(mode, first, second) {
  const x = trimAt(first?.value || "un fenómeno inexplicable", 65);
  const y = trimAt(second?.value || "una comunidad de vecinos", 55);

  const titles = {
    caos: [
      `${titleCase(x)} contra ${y}`,
      `${titleCase(x)}: el incidente`,
      `¿Quién ha autorizado ${y}?`,
      `El día que ${x.toLowerCase()} dejó de ser normal`,
      `Manual para sobrevivir a ${x.toLowerCase()}`
    ],
    historia: [
      `La increíble historia de ${x}`,
      `${titleCase(x)} y el misterio de ${y}`,
      `Nadie esperaba que ${x.toLowerCase()} acabara así`,
      `El expediente ${titleCase(x)}`,
      `Las reglas de ${titleCase(y)}`
    ],
    personaje: [
      `${titleCase(x)}: profesional del desastre`,
      `El último experto en ${y}`,
      `Doctor ${titleCase(x)}`,
      `La persona que sabía demasiado sobre ${y}`,
      `Manual de uso de ${titleCase(x)}`
    ],
    video: [
      `Probamos ${x} durante 24 horas`,
      `POV: ${x} te arruina el día`,
      `Unboxing de ${y} (sale mal)`,
      `Intentamos convertir ${x} en contenido`,
      `La peor idea posible con ${titleCase(y)}`
    ],
    mundo: [
      `El mundo donde ${x.toLowerCase()} es ley`,
      `Bienvenidos a ${titleCase(y)}`,
      `La república independiente de ${x}`,
      `Atlas de un mundo que no debería existir`,
      `Las leyes de ${titleCase(x)}`
    ],
    invento: [
      `${titleCase(x)}®`,
      `El anti-${titleCase(x)}`,
      `La solución definitiva para ${y}`,
      `${titleCase(x)} Pro Max`,
      `Algo que nadie necesitaba: ${titleCase(y)}`
    ]
  };

  return pick(titles[mode], `${titleCase(x)}: una mala idea`);
}

function makeFields(mode, first, second, third, absurdity) {
  const x = fact(first, "un dato aparentemente irrelevante");
  const y = fact(second, "una situación profundamente incómoda");
  const z = fact(third, "un trámite municipal");
  const bridge = rand(bridges);
  const ending = rand(endings);
  const reality = absurdity >= 85 ? "la lógica ha dimitido" : absurdity >= 55 ? "la lógica ha pedido vacaciones" : "los números cuadran";

  if (mode === "historia") {
    const protagonist = pick(CREATIVE_BANK.character.goals, "resolver un problema extraño");
    const enemy = pick(CREATIVE_BANK.character.enemies, "una institución demasiado eficiente");
    const conflict = fill(pick(CREATIVE_BANK.history.conflicts, "una decisión sencilla se convierte en un problema enorme"), { x, y, z });
    const twist = fill(pick(CREATIVE_BANK.history.twists, "el detalle que parecía irrelevante era la clave"), { x, y, z });
    return [
      ["Premisa", `Todo comienza con «${x}». Cuando aparece «${y}», una situación aparentemente normal empieza a seguir unas reglas que nadie entiende del todo.`],
      ["Protagonista", `Alguien que quiere ${protagonist}, pero descubre demasiado tarde que «${z}» está directamente relacionado con su problema.`],
      ["Antagonista", `${enemy}. No necesariamente quiere hacer daño: simplemente necesita que las cosas funcionen según sus propias reglas.`],
      ["Reglas del mundo", `Cuando algo queda registrado oficialmente, la realidad empieza a comportarse como si fuera cierto. Cuanto más absurdo es el registro, más difícil resulta contradecirlo.`],
      ["Conflicto", `${conflict}.`],
      ["Giro", `${bridge}: ${twist}.`],
      ["Final posible", `El protagonista consigue cambiar las reglas, pero el precio es aceptar una consecuencia que nadie había previsto. ${ending}`]
    ];
  }

  if (mode === "personaje") {
    const profession = pick(CREATIVE_BANK.character.professions, "consultor de problemas que no existen");
    const ability = pick(CREATIVE_BANK.character.abilities, "recuerda datos completamente inútiles");
    const defect = pick(CREATIVE_BANK.character.defects, "necesita tener una opinión sobre todo");
    const goal = pick(CREATIVE_BANK.character.goals, "demostrar que tenía razón");
    const enemy = pick(CREATIVE_BANK.character.enemies, "un funcionario con demasiado tiempo libre");
    const arc = pick(CREATIVE_BANK.character.arcs, "aprende a aceptar que no puede controlarlo todo");
    return [
      ["Quién es", `Una persona obsesionada con «${x}» que ha convertido una peculiaridad en identidad. Nadie sabe por qué, incluida ella.`],
      ["Objetivo", `${goal}, aunque para conseguirlo tendrá que enfrentarse a «${y}».`],
      ["Profesión", `${titleCase(profession)}. Es sorprendentemente competente cuando el problema no tiene sentido.`],
      ["Habilidad inútil", `${ability}.`],
      ["Defecto", `${defect}.`],
      ["Enemigo", `${enemy}. Su relación empieza siendo accidental y termina siendo personal.`],
      ["Giro", `«${z}» demuestra que el personaje conoce una parte de la situación que no debería conocer.`],
      ["Arco", `${arc}.`]
    ];
  }

  if (mode === "video") {
    const hook = fill(pick(CREATIVE_BANK.video.hooks, "Tenemos una pregunta que debemos comprobar."), { x, y });
    const momentA = pick(CREATIVE_BANK.video.moments, "el primer intento");
    const momentB = pick(CREATIVE_BANK.video.moments, "el resultado inesperado");
    const momentC = pick(CREATIVE_BANK.video.moments, "el remate");
    const punchline = fill(pick(CREATIVE_BANK.video.punchlines, "La teoría sigue viva."), { x, y });
    return [
      ["Hook", `«${hook}»`],
      ["Premisa", `Partimos de «${x}» y «${y}» y planteamos un reto sencillo: descubrir qué ocurre cuando ambos datos se convierten en una situación real.`],
      ["Estructura", `1. Presentar el dato. 2. Explicar el reto. 3. Primer intento. 4. Aparece un problema. 5. Intento de solución. 6. Resultado. 7. Remate.`],
      ["Momentos clave", `${momentA}; ${momentB}; ${momentC}.`],
      ["Remate", `${punchline}`],
      ["CTA", `«¿Qué otro dato deberíamos convertir en un experimento? Dejadlo en comentarios y elegimos el siguiente.»`]
    ];
  }

  if (mode === "mundo") {
    const society = pick(CREATIVE_BANK.world.societies, "la sociedad se organiza alrededor de reglas extrañas");
    const custom = pick(CREATIVE_BANK.world.customs, "celebrar cualquier acontecimiento con una ceremonia");
    const factionA = pick(CREATIVE_BANK.world.factions, "quienes quieren mantener el sistema");
    let factionB = pick(CREATIVE_BANK.world.factions, "quienes quieren romperlo");
    if (factionB === factionA) factionB = "los que creen que todo podría funcionar de otra manera";
    return [
      ["Concepto", `Un mundo donde «${x}» es un hecho cotidiano y «${y}» forma parte de la infraestructura básica de la sociedad.`],
      ["Regla principal", `Lo imposible deja de ser extraño cuando aparece publicado en un documento oficial. La contradicción solo existe hasta que alguien la registra.`],
      ["Sociedad", `${society}. Además, «${z}» determina una parte importante de la vida pública.`],
      ["Costumbres", `Es completamente normal ${custom}. Lo extraño es intentar vivir de una manera convencional.`],
      ["Conflicto", `Alguien descubre que las reglas que sostienen este mundo tienen una contradicción y que corregirla podría destruir lo que mantienen unido.`],
      ["Facciones", `${factionA}; frente a ${factionB}. Ambas creen estar protegiendo el mundo.`],
      ["Giro", `El sistema no funciona por accidente: alguien diseñó estas reglas y dejó «${z}» como una pista para quien llegara demasiado lejos.`]
    ];
  }

  if (mode === "invento") {
    const name = pick(CREATIVE_BANK.invention.names, "SolucionaEso");
    const problem = pick(CREATIVE_BANK.invention.problems, "la gente tiene un problema demasiado pequeño para admitirlo");
    const solution = pick(CREATIVE_BANK.invention.solutions, "un dispositivo que convierte una molestia cotidiana en un proceso formal");
    const audience = pick(CREATIVE_BANK.invention.audiences, "personas que empiezan frases con «debería existir algo que...»");
    const defect = pick(CREATIVE_BANK.invention.defects, "produce más instrucciones de las que elimina");
    return [
      ["Nombre", `${name}®`],
      ["Problema", `${problem}. Curiosamente, «${y}» hace que parezca mucho más urgente.`],
      ["Solución", `${solution}. Está diseñado alrededor de «${x}» y utiliza «${z}» como argumento de venta.`],
      ["Funcionamiento", `El usuario inicia el proceso, confirma que realmente quiere continuar y deja que el sistema convierta una molestia pequeña en una experiencia cuidadosamente documentada.`],
      ["Público objetivo", `${audience}.`],
      ["Ventaja", `${reality}. En una presentación con suficiente confianza, parece una innovación histórica.`],
      ["Defecto", `${defect}.`],
      ["Anuncio", `«No necesitas ${name}®. Y precisamente por eso necesitas ${name}® antes que nadie.»`]
    ];
  }

  return [
    ["Premisa", `Una combinación imposible de «${x}» y «${y}» se convierte inesperadamente en una idea que podría funcionar.`],
    ["Protagonista", `${pick(CREATIVE_BANK.character.goals, "alguien que quiere resolver un problema extraño")}, y comete el error de tomárselo en serio.`],
    ["Conflicto", `${fill(pick(CREATIVE_BANK.history.conflicts, "una situación pequeña se convierte en un problema enorme"), { x, y, z })}.`],
    ["Giro", `${bridge}: ${fill(pick(CREATIVE_BANK.history.twists, "el detalle irrelevante era la clave"), { x, y, z })}. Con un nivel de absurdo del ${absurdity}%, ${reality}.`],
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
