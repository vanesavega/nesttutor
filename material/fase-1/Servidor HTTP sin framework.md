---
topic_id: f1.servidor-http-nativo
fase: 1
tipo: codigo
estado: no_visto
nivel: bajo
tags: [fase/1, estado/no_visto]
---

# Servidor HTTP sin framework

**Prerequisitos:** [[HTTP y REST]]

**Criterio de dominio:** CRUD de un recurso en memoria con router propio sobre node:http: 201, 204, 404, 400 y 500 correctos, errores en un único punto, y un test con fetch que ejercita cada ruta.

## Apuntes
- 2026-11-22 (diagnóstico): nivel bajo. Solo sondeo con preguntas; aún sin lección.

## Errores cometidos
- 2026-11-22: Reconoce req/res a medias; no sabe leer el body en node:http ni qué pasa sin res.end().

## Relacionados
