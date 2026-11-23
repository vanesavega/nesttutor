# f1.modulos-cjs-esm · 01 — Tres errores típicos de ES Modules

- Herramienta: Node 24 (`node`)
- Tipo: debug
- Tiempo objetivo: 10 min
- Directorio de trabajo: `ejercicios/fase-1/f1.modulos-cjs-esm/01-fix-esm-errors/`

## Por qué esta herramienta
Los errores de módulos aparecen en cuanto mezclas sintaxis de CommonJS dentro de un proyecto ES Modules. Saber leer el mensaje y reconocer la causa te ahorra mucho tiempo.

## Objetivo
Hay tres archivos que fallan al ejecutarlos, cada uno por un error distinto. Para cada uno debes:
1. Ejecutarlo y copiar el mensaje de error.
2. Explicar por qué Node reaccionó así.
3. Arreglarlo para que imprima su salida sin errores.

Restricciones:
- **No cambies `package.json`** (debe seguir con `"type": "module"`). El arreglo va dentro de cada archivo.
- No cambies `util.js`.
- Si cambias o añades código, nombres y comentarios van en inglés. Tus explicaciones en `respuestas.md` pueden ir en español.

## Paso a paso

0. **Preparación — qué ya existe.** En esta carpeta ya están:
   - `package.json`: declara `"type": "module"`, o sea, todos los `.js` de la carpeta son ES Modules.
   - `util.js`: exporta una función `greet`. Está bien, no lo toques.
   - `a-require.js`, `b-extension.js`, `c-dirname.js`: los tres archivos rotos.
   - `respuestas.md`: plantilla donde escribes tus explicaciones.

   No hay que instalar nada. Abre una terminal en la carpeta:
   ```bash
   cd ejercicios/fase-1/f1.modulos-cjs-esm/01-fix-esm-errors
   ```
   Ese comando no imprime nada si va bien.

1. **Predice antes de ejecutar.** Abre `a-require.js` y, **antes de correrlo**, escribe en `respuestas.md` (en la sección de `a-require.js`) qué error crees que saldrá y por qué. Haz lo mismo con los otros dos archivos.

2. **Ejecuta el primero:**
   ```bash
   node a-require.js
   ```
   `node` ejecuta el archivo. Debe fallar y mostrar un mensaje de error en rojo. Copia la línea del error en `respuestas.md`. Compara con tu predicción.

3. **Explica y arregla.** En `respuestas.md`, escribe por qué ocurrió, y cambia `a-require.js` para que funcione. Vuelve a correr `node a-require.js`: debe imprimir una línea con `hello, ` seguido del nombre de tu sistema operativo.

4. **Repite con `b-extension.js`** (los mismos pasos 2 y 3): ejecuta `node b-extension.js`, copia el error, explica, arregla. Al arreglarlo debe imprimir `hello, world`.

5. **Repite con `c-dirname.js`**: ejecuta `node c-dirname.js`, copia el error, explica, arregla. Al arreglarlo debe imprimir `hello, world` y, en otra línea, la ruta de la carpeta donde está el archivo.

6. **Avísame en el chat** cuando termines. Guarda todos los archivos antes (Ctrl+S).

## Cómo se evalúa
Ejecuto `node a-require.js`, `node b-extension.js` y `node c-dirname.js` y leo `respuestas.md`. Criterio: los tres corren sin error con `package.json` intacto, y cada explicación identifica la causa real del error, no solo el síntoma.

## Pistas
Pídelas al tutor: son escalonadas y no están escritas aquí a propósito.
