# ALEATRÓN ↗

> **Ideas frescas. Cerebro frito.**
>
> Una máquina creativa que roba pequeños datos de internet, los mezcla con azar y devuelve algo que, contra todo pronóstico, podrías convertir en una historia, un vídeo, un personaje o un invento absurdo.

**Sin IA. Sin backend. Sin claves. Solo APIs públicas, azar y malas decisiones.**

[![Deploy](https://github.com/TheBraisgf/aleatron/actions/workflows/deploy.yml/badge.svg)](https://github.com/TheBraisgf/aleatron/actions/workflows/deploy.yml)
[![Quality](https://github.com/TheBraisgf/aleatron/actions/workflows/quality.yml/badge.svg)](https://github.com/TheBraisgf/aleatron/actions/workflows/quality.yml)

---

## ¿Qué demonios hace?

Aleatrón consulta varias APIs públicas en cada tirada. De cada fuente obtiene un pequeño fragmento de información: un dato curioso, un Pokémon, una frase, una carta, un consejo, una persona ficticia…

Después, **no intenta fingir que eso es una respuesta inteligente**. Un conjunto de reglas y plantillas convierte esos ingredientes en una ficha creativa.

El resultado depende del formato elegido:

| Modo | Para qué sirve | Qué devuelve |
| --- | --- | --- |
| **Caos absoluto** | Una idea libre | Premisa, protagonista, conflicto, giro y final |
| **Premisa de historia** | Escribir ficción | Premisa, protagonista, antagonista, mundo, conflicto, giro y final |
| **Personaje lamentable** | Crear personajes | Identidad, objetivo, profesión, habilidad, defecto, enemigo y arco |
| **Vídeo / sketch** | Crear contenido | Hook, premisa, estructura, momentos, remate y CTA |
| **Mundo imposible** | Worldbuilding | Concepto, reglas, sociedad, costumbres, conflicto, facciones y giro |
| **Invento innecesario** | Ideas de productos | Problema, solución, funcionamiento, público, ventaja, defecto y anuncio |

El control de **absurdo** modifica el tono de la generación: desde algo que casi podría pasar hasta una situación en la que la realidad ha presentado su carta de dimisión.

---

## La filosofía

Aleatrón nació de una pregunta bastante sencilla:

> **¿Qué pasa si le damos a un programa un montón de APIs públicas y ninguna supervisión adulta?**

La respuesta es esta.

No hay un modelo generativo escondido detrás. No hay una API de OpenAI. No hay una base de datos secreta de ideas. La gracia está precisamente en el mecanismo: **datos reales + azar + reglas + contexto absurdo**.

---

## Arquitectura

Es una aplicación web estática **en despliegue**, pero dinámica en ejecución: todo el contenido se genera en el navegador mediante llamadas HTTP a servicios públicos.

```text
aleatron/
├── .github/
│   └── workflows/
│       ├── deploy.yml       # Publicación en GitHub Pages
│       └── quality.yml      # Comprobaciones automáticas
│
├── assets/
│   └── favicon.svg
│
├── src/
│   ├── app.js               # Punto de entrada y eventos de la interfaz
│   ├── config/
│   │   ├── apis.js          # Catálogo de fuentes públicas
│   │   └── modes.js         # Modos y formatos de salida
│   ├── core/
│   │   ├── generator.js     # Reglas que convierten datos en ideas
│   │   └── storage.js       # Ideas guardadas en localStorage
│   ├── services/
│   │   └── api-client.js    # HTTP, timeouts y traducción
│   ├── ui/
│   │   └── render.js        # Renderizado de resultados y controles
│   └── utils.js              # Utilidades compartidas
│
├── index.html               # Estructura semántica de la aplicación
├── styles.css               # Sistema visual principal
├── green-theme.css          # Identidad cromática de Aleatrón
├── .gitignore
├── .nojekyll
└── README.md
```

La intención es que cada pieza tenga **un trabajo concreto**. Si mañana queremos añadir una API, tocamos `config/apis.js`. Si queremos inventar un nuevo formato, `config/modes.js` + `core/generator.js`. Si queremos cambiar cómo se pinta una idea, `ui/render.js`.

Nada de un `app.js` de 800 líneas que nadie quiere abrir un lunes por la mañana.

---

## Fuentes públicas

Actualmente Aleatrón puede tirar de fuentes como:

- Useless Facts
- Cat Facts
- Dog Facts
- PokéAPI
- Official Joke API
- JokeAPI
- Chuck Norris Facts
- Ron Swanson Quotes
- Bored API
- Random User
- Deck of Cards API
- Advice Slip
- Dog CEO

Las fuentes se seleccionan al azar. Si una falla, tarda demasiado o no puede proporcionar una traducción utilizable, se descarta y Aleatrón busca otra.

### Idiomas

La interfaz y las ideas están pensadas para salir en **castellano**. Cuando una API solo proporciona inglés, el cliente intenta traducir el dato mediante servicios públicos de traducción. Si tampoco es posible, **no mete el inglés a la fuerza en la idea**: descarta esa fuente.

---

## Ejecutarlo en local

No hay `npm install`. No hay bundler. No hay build.

Necesitas simplemente servir el proyecto mediante HTTP:

```bash
python -m http.server 8000
```

Después abre:

```text
http://localhost:8000
```

También puedes usar cualquier servidor estático equivalente.

> Abrir `index.html` directamente con `file://` no es la forma recomendada porque los módulos ES y algunas peticiones `fetch` pueden comportarse de manera distinta.

---

## Deploy

Aleatrón se publica automáticamente con **GitHub Actions + GitHub Pages**.

1. Ve a **Settings → Pages**.
2. Selecciona **GitHub Actions** como fuente de despliegue.
3. Haz push a `main`.
4. `deploy.yml` publica la aplicación.
5. `quality.yml` comprueba la sintaxis y las referencias básicas antes de que el proyecto se vaya de paseo.

---

## Guardado

Las ideas guardadas viven únicamente en el navegador mediante `localStorage`.

No existe una cuenta. No existe un servidor de usuarios. No existe una base de datos de tus malas ideas.

---

## Stack

- HTML semántico
- CSS puro
- JavaScript moderno con módulos ES
- `fetch` / APIs HTTP públicas
- `localStorage`
- GitHub Actions
- GitHub Pages

**Cero dependencias de runtime.**

---

## Contribuir

¿Has encontrado una API pública que sería perfecta para empeorar Aleatrón? ¿Tienes un formato nuevo?

Abre un issue o manda un pull request.

Buenas ideas son bienvenidas.

Malas ideas son todavía más bienvenidas.

---

## Licencia

MIT.

Las APIs utilizadas son servicios de terceros y mantienen sus propios términos, límites y licencias. Si decides bombardearlas con 40.000 peticiones, el problema será tuyo y probablemente también el de sus servidores.

---

<p align="center">
  <strong>ALEATRÓN ↗</strong><br />
  <sub>INTERNET, PERO CON MALAS IDEAS.</sub>
</p>
