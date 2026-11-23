---
topic_id: f1.event-loop-async
fase: 1
tipo: codigo
estado: visto
nivel: bajo
tags: [fase/1, estado/visto]
---

# Event loop y asincronía

**Prerequisitos:** ninguno

**Criterio de dominio:** Un script demuestra que un bucle síncrono pesado retrasa un setTimeout y lo corrige partiendo el trabajo o con un worker thread; además predice y explica el orden de salida de 5 fragmentos que mezclan promesas, setTimeout y process.nextTick.

## Apuntes
- 2026-11-22 (diagnóstico): nivel bajo. Solo sondeo con preguntas; aún sin lección.
- 2026-11-23: el event loop saca tareas de las colas solo cuando el call stack está vacío; antes de cada macrotarea vacía todas las microtareas.
- Macrotareas: setTimeout, setInterval, E/S, setImmediate. Microtareas: .then/.catch/.finally, lo que va tras un await, queueMicrotask; process.nextTick tiene cola propia, aún más prioritaria.
- El cuerpo de una función async corre síncrono hasta su primer await; solo lo posterior pasa a microtareas, en orden FIFO.
- Un for pesado bloquea el hilo; await no. Soluciones: partir el trabajo cediendo turno entre pedazos (setImmediate/scheduler.yield) o worker_threads.
- Ejercicio: `ejercicios/fase-1/f1.event-loop-async/01-chunked-sum/` (completar, 4 pruebas pasan, con solución dada tras 3 pistas).

## Errores cometidos
- 2026-11-22: Orden A/setTimeout/promesa incorrecto; no reconoce el event loop. Sí entiende que un for síncrono bloquea y que await no.
- 2026-11-23: creyó que lo anterior al primer await de una async iba a una cola; invirtió el orden FIFO de microtareas; usó chunks por chunkSize; hizo await sobre un número, que no cede el turno.

## Relacionados
- [[2026-11-23]]: se estudió en la misma sesión que [[HTTP y REST]] y [[Módulos CommonJS y ES Modules]].
