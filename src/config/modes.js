export const MODE_INFO = {
  caos: {
    name: "Caos absoluto",
    short: "Una idea completa sin género fijo.",
    description: "Une datos aleatorios y construye una idea lista para desarrollar, sin obligarla a encajar en un formato concreto.",
    output: "Título · premisa · protagonista · conflicto · giro · final posible"
  },
  historia: {
    name: "Premisa de historia",
    short: "Elige esto si quieres escribir una historia.",
    description: "Convierte el azar en el esqueleto de una historia: quién la protagoniza, qué quiere, qué se lo impide y cómo podría terminar.",
    output: "Título · premisa · protagonista · antagonista · reglas del mundo · conflicto · giro · final posible"
  },
  personaje: {
    name: "Personaje lamentable",
    short: "Elige esto si necesitas un personaje.",
    description: "Crea un personaje absurdo pero utilizable, con identidad, objetivo, profesión, defecto, habilidad inútil y problema personal.",
    output: "Quién es · objetivo · profesión · habilidad inútil · defecto · enemigo · giro · arco"
  },
  video: {
    name: "Vídeo / sketch",
    short: "Elige esto si quieres algo que puedas grabar.",
    description: "Transforma los datos en una pieza de contenido: un hook claro, una premisa, una estructura de vídeo y un remate final.",
    output: "Título · hook · premisa · estructura · momentos clave · remate · CTA"
  },
  mundo: {
    name: "Mundo imposible",
    short: "Elige esto para hacer worldbuilding.",
    description: "Crea un universo donde los datos absurdos sean parte de la normalidad, con reglas, sociedad, conflictos y cosas que explorar.",
    output: "Concepto · regla principal · sociedad · costumbres · conflicto · facciones · giro"
  },
  invento: {
    name: "Invento innecesario",
    short: "Elige esto si quieres inventar un producto absurdo.",
    description: "Diseña un producto que nadie necesitaba pero que, explicado con suficiente seguridad, parece una startup perfectamente financiable.",
    output: "Nombre · problema · solución · funcionamiento · público · ventaja · defecto · anuncio"
  }
};

export const MODE_ORDER = Object.keys(MODE_INFO);
