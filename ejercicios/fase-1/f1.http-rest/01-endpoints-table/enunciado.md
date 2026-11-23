# f1.http-rest · 01 — Tabla de 8 endpoints para `boards`

- Herramienta: papel y editor (diseño); `curl` queda para verificar en el tópico siguiente
- Tipo: diseño (tópico mixto: la parte de producción llega con el servidor del tópico siguiente)
- Tiempo objetivo: 10 min
- Directorio de trabajo: `ejercicios/fase-1/f1.http-rest/01-endpoints-table/`

## Por qué esta herramienta
Diseñar la API **antes** de programarla evita inventar rutas y códigos a mitad de camino. Una tabla obliga a decidir método, ruta y códigos de cada operación.

## Objetivo
Diseñar la API de un recurso `boards` (tableros, como los de Michilog o Trello). Cada tablero tiene `id` y `name`, y puede tener tarjetas (`cards`) con `id` y `title`.

Completa `tabla.md` con **8 endpoints**. Para cada uno indica:
- Método y ruta.
- Código de estado de éxito.
- Códigos de error posibles y **cuándo** ocurren.
- Si es idempotente, con su justificación en una frase.

Restricciones:
- Debe incluir, como mínimo: listar tableros, ver uno, crear, reemplazar completo, modificar parcialmente y borrar. Los otros 2 los eliges tú (por ejemplo, algo con las tarjetas de un tablero).
- Rutas con sustantivos en plural, sin verbos.
- Todo el texto de la tabla en inglés (el repo exige código en inglés).

## Paso a paso
0. **Preparación.** En esta carpeta ya existe `tabla.md`, con la tabla vacía. No hay que instalar nada ni crear archivos nuevos. Ábrelo en tu editor.
1. **Piensa antes de escribir.** Para cada operación pregúntate: ¿qué método HTTP la expresa? ¿qué recurso nombra la ruta? Escribe primero las 6 filas obligatorias.
2. **Códigos de éxito.** Para cada fila decide si lleva body y si crea algo, y de ahí sale el código (`200`, `201` o `204`).
3. **Códigos de error.** Para cada fila escribe qué errores pueden ocurrir y cuándo: ¿un dato inválido? ¿un recurso que no existe? Anótalo en la columna de errores, con la causa entre paréntesis.
4. **Idempotencia.** Usa tu cuenta de "estado final del servidor": si repites la petición 3 veces, ¿cambia el resultado después de la primera? Anótalo con una frase en la columna *Why*.
5. **Añade las 2 filas libres** y revisa que ninguna ruta tenga verbos.
6. **Avísame en el chat** cuando esté listo. Yo leo `tabla.md` y te hago preguntas sobre las decisiones. Esta tabla se verificará con `curl` cuando construyamos el servidor en el tópico siguiente.

## Cómo se evalúa
Leo `tabla.md`. Criterio: 8 filas completas, métodos y códigos coherentes con las convenciones de la lección, idempotencia justificada con el criterio del estado final, y rutas sin verbos.

## Pistas
Pídelas al tutor: son escalonadas y no están escritas aquí a propósito.
