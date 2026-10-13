# Aleatrón

**Una máquina de ideas improbables. Sin IA: APIs públicas, azar y llamadas HTTP.**

Aleatrón selecciona APIs al azar, consulta datos reales y los combina en una premisa absurda. Si una API falla, se descarta y se prueban otras; no se inventan respuestas para simular que funciona.

## Desarrollo local

No necesita dependencias ni compilación. Sirve el repositorio mediante HTTP:

```bash
python -m http.server 8000
```

Abre http://localhost:8000.

## APIs

Las fuentes y su documentación están declaradas en `src/app.js`: datos inútiles, facts de animales, Pokémon, chistes, personas ficticias, cartas, consejos y razas de perros. Se escogen varias en cada generación. Se requiere HTTPS y que cada API permita CORS para que el navegador pueda consultarla.

Los servicios externos pueden aplicar límites, cambiar sus respuestas o dejar de funcionar. Aleatrón usa timeout por llamada y fallback con fuentes adicionales. No usa IA, claves, servidor propio ni backend.

## Deploy con GitHub Pages

El workflow `.github/workflows/deploy.yml` publica el sitio automáticamente al hacer push a `main`.

1. Abre **Settings → Pages** en GitHub.
2. En **Build and deployment**, selecciona **GitHub Actions** como fuente.
3. Haz push a `main`; el workflow valida y despliega el contenido del repo.
4. Encuentra la URL en **Settings → Pages** o en el resumen del workflow.

El workflow `.github/workflows/quality.yml` también valida la sintaxis JS y referencias de archivos en pushes y pull requests.

## Guardado

Las ideas se guardan localmente en el navegador mediante `localStorage`, sin enviarse a ningún servidor.

## Licencia

MIT. Aleatrón llama servicios de terceros; consulta sus términos antes de hacer uso intensivo.
