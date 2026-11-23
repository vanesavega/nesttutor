# f1.event-loop-async · 01 — Suma en pedazos sin bloquear el event loop

- Herramienta: Node.js (`setImmediate`, `async`/`await`) y Jest
- Tipo: completar
- Tiempo objetivo: 10-12 min
- Directorio de trabajo: `ejercicios/fase-1/f1.event-loop-async/01-chunked-sum/`

## Por qué esta herramienta
Un bucle síncrono pesado ocupa el único hilo de Node y congela timers, promesas y peticiones. Antes (o en otros lenguajes) se resolvía con más hilos; en Node, una forma de evitarlo es partir el trabajo y ceder el turno entre pedazos para que el event loop atienda lo demás.

## Objetivo
Completar la función `sumRangeInChunks(limit, chunkSize)` en `starter.ts`.

- **Entrada:** `limit` (número entero ≥ 0) y `chunkSize` (cuántos números procesas antes de ceder el turno).
- **Salida:** una promesa que se cumple con la suma de todos los enteros desde `0` hasta `limit - 1`. Es el mismo resultado que `sumRangeBlocking`.
- **Restricciones:**
  - No uses `worker_threads` (eso es otro ejercicio).
  - No modifiques `sumRangeBlocking`, ni las firmas de las funciones, ni el archivo `starter.spec.ts`.
  - Entre un pedazo y el siguiente debes **ceder el turno al event loop** para que otras tareas, como un `setInterval`, puedan ejecutarse.
  - Todo el código, nombres y comentarios van en inglés.

## Paso a paso

0. **Preparación — qué ya existe y qué no.** En esta carpeta ya están:
   - `starter.ts`: el esqueleto. Tiene `sumRangeBlocking` (ya hecha, no la toques) y `sumRangeInChunks` (tiene un `TODO`, es la que completas).
   - `starter.spec.ts`: las pruebas (tests) de Jest que dirán si tu solución funciona. No las modifiques.
   - `package.json`, `tsconfig.json`, `jest.config.js`: la configuración de proyecto, ya escrita. No necesitas crear ningún archivo nuevo.

   Abre una terminal en la carpeta del ejercicio:
   ```bash
   cd ejercicios/fase-1/f1.event-loop-async/01-chunked-sum
   ```
   Ese comando cambia la carpeta actual de la terminal. No imprime nada si todo va bien.

   Instala las dependencias (las herramientas que listan `package.json`: TypeScript, Jest y sus tipos):
   ```bash
   npm install
   ```
   `npm install` descarga esas herramientas a una carpeta `node_modules/`. Verás una lista de paquetes añadidos y no deberían salir errores en rojo.

1. **Mira cómo falla hoy.** Corre las pruebas antes de tocar nada:
   ```bash
   npx jest starter.spec.ts
   ```
   `npx jest` ejecuta Jest, y `starter.spec.ts` es el archivo de pruebas. Deberías ver que la prueba de `sumRangeBlocking` pasa y que las de `sumRangeInChunks` fallan con el mensaje `Not implemented`. Eso es lo esperado: es tu punto de partida.

2. **Entiende qué miden los tests.** Lee `starter.spec.ts`. La función `countTicksDuring` arranca un `setInterval` que sube un contador cada 5 ms mientras corre el trabajo. Con el bucle bloqueante el contador queda en 0 (la prueba de línea base lo demuestra). Con tu versión por pedazos, el contador debe subir. **Antes de escribir código**, escribe en un comentario dentro de `starter.ts` una predicción: ¿por qué el contador sube si partes el trabajo? Esto es la parte de *predecir*.

3. **Implementa `sumRangeInChunks` en `starter.ts`.** Guía de proceso, sin código:
   1. Necesitas un acumulador y un índice que recuerde por dónde vas.
   2. Procesa como máximo `chunkSize` números y para.
   3. Entre pedazos, devuelve el control al event loop: tienes que **esperar** un turno de event loop. Piensa en qué herramienta de la lección crea una macrotarea que se ejecuta "después de lo pendiente" y cómo convertir esa espera en algo que puedas `await`.
   4. Repite hasta llegar a `limit` y devuelve el total.
   5. Cuida los casos borde: `limit` igual a 0, y un `limit` que no es múltiplo de `chunkSize`.

4. **Verifica.** Corre:
   ```bash
   npx jest starter.spec.ts
   ```
   Debes ver `Tests: 4 passed, 4 total`. Si alguna falla, lee el mensaje: dice qué valor recibió y cuál esperaba. Si falla `lets timers fire while it works`, el contador de ticks salió menor a 3: tu código no está cediendo el turno de verdad.

5. **Comprueba los tipos.** Corre:
   ```bash
   npx tsc --noEmit
   ```
   `tsc` es el compilador de TypeScript y `--noEmit` significa "solo revisa errores, no generes archivos". No debe imprimir nada si todo está bien.

6. **Avísame en el chat** cuando esté listo. Yo ejecuto las pruebas y reviso tu archivo.

## Convención de código
Variables, funciones, docstrings y comentarios en inglés (estándar del repo).

## Cómo se evalúa
Ejecuto `npx jest starter.spec.ts` y `npx tsc --noEmit` en esta carpeta. Criterio: 4 pruebas pasando, cero errores de tipos y una solución que cede el turno de verdad (no que "pase por casualidad").

## Pistas
Pídelas al tutor: son escalonadas y no están escritas aquí a propósito.
