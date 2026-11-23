---
topic_id: f1.event-loop-async
fase: 1
tipo: codigo
estado: no_visto
nivel: bajo
tags: [fase/1, estado/no_visto]
---

# Event loop y asincronía

**Prerequisitos:** ninguno

**Criterio de dominio:** Un script demuestra que un bucle síncrono pesado retrasa un setTimeout y lo corrige partiendo el trabajo o con un worker thread; además predice y explica el orden de salida de 5 fragmentos que mezclan promesas, setTimeout y process.nextTick.

## Apuntes
- 2026-11-22 (diagnóstico): nivel bajo. Solo sondeo con preguntas; aún sin lección.

## Errores cometidos
- 2026-11-22: Orden A/setTimeout/promesa incorrecto; no reconoce el event loop. Sí entiende que un for síncrono bloquea y que await no.

## Relacionados
