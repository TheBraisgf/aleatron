import { prettify, suitEs } from "../utils.js";

export const SOURCES = [
  { id: "useless-facts", name: "Useless Facts", kind: "Dato curioso", icon: "?!", lang: "en", url: "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en", docs: "https://uselessfacts.jsph.pl/", parse: r => r.text },
  { id: "cat-facts", name: "Cat Facts", kind: "Dato de gatos", icon: "↗", lang: "en", url: "https://catfact.ninja/fact", docs: "https://catfact.ninja/", parse: r => r.fact },
  { id: "dog-facts", name: "Dog Facts", kind: "Dato de perros", icon: "⌁", lang: "en", url: "https://dogapi.dog/api/v2/facts", docs: "https://dogapi.dog/", parse: r => r.data?.[0]?.attributes?.body || r.fact },
  { id: "pokeapi", name: "PokéAPI", kind: "Pokémon", icon: "◉", lang: "es", url: () => `https://pokeapi.co/api/v2/pokemon/${1 + Math.floor(Math.random() * 1025)}`, docs: "https://pokeapi.co/", parse: r => prettify(r.name) },
  { id: "official-joke", name: "Official Joke API", kind: "Chiste", icon: "☻", lang: "en", url: "https://official-joke-api.appspot.com/random_joke", docs: "https://github.com/15Dkatz/official_joke_api", parse: r => [r.setup, r.punchline].filter(Boolean).join(" — ") },
  { id: "jokeapi", name: "JokeAPI", kind: "Humor", icon: "↯", lang: "en", url: "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,racist,sexist,explicit&type=single", docs: "https://jokeapi.dev/", parse: r => r.joke || [r.setup, r.delivery].filter(Boolean).join(" — ") },
  { id: "chucknorris", name: "Chuck Norris Facts", kind: "Leyenda urbana", icon: "★", lang: "en", url: "https://api.chucknorris.io/jokes/random", docs: "https://api.chucknorris.io/", parse: r => r.value },
  { id: "ron-swanson", name: "Ron Swanson Quotes", kind: "Frase", icon: "☕", lang: "en", url: "https://ron-swanson-quotes.herokuapp.com/v2/quotes", docs: "https://github.com/jamesseanwright/ron-swanson-quotes", parse: r => Array.isArray(r) ? r[0] : r },
  { id: "boredapi", name: "Bored API", kind: "Actividad", icon: "⌂", lang: "en", url: "https://bored-api.appbrewery.com/random", docs: "https://bored-api.appbrewery.com/", parse: r => r.activity },
  { id: "random-user", name: "Random User", kind: "Persona ficticia", icon: "☺", lang: "es", url: "https://randomuser.me/api/?nat=es", docs: "https://randomuser.me/", parse: r => { const u = r.results?.[0]; return u ? `${u.name.first} ${u.name.last} de ${u.location.city}` : ""; } },
  { id: "deckofcards", name: "Deck of Cards", kind: "Carta", icon: "♠", lang: "es", url: "https://deckofcardsapi.com/api/deck/new/draw/?count=1", docs: "https://deckofcardsapi.com/", parse: r => { const c = r.cards?.[0]; return c ? `${c.value} de ${suitEs(c.suit)}` : ""; } },
  { id: "advice-slip", name: "Advice Slip", kind: "Consejo", icon: "✎", lang: "en", url: "https://api.adviceslip.com/advice", docs: "https://api.adviceslip.com/", parse: r => r.slip?.advice },
  { id: "dog-ceo", name: "Dog CEO", kind: "Raza de perro", icon: "♧", lang: "es", url: "https://dog.ceo/api/breeds/list/random", docs: "https://dog.ceo/dog-api/", parse: r => `La raza elegida al azar es ${r.message}.` }
];
