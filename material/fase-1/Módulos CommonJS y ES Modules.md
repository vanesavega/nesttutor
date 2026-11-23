---
topic_id: f1.modulos-cjs-esm
fase: 1
tipo: codigo
estado: aprendido
nivel: nulo
repaso_proximo: 2026-11-25
tags: [fase/1, estado/aprendido]
---

# Módulos CommonJS y ES Modules

**Prerequisitos:** [[Event loop y asincronía]]

**Criterio de dominio:** El mismo módulo de utilidades se consume desde un proyecto CJS y otro ESM, ambos compilan con tsc y se ejecutan; el estudiante provoca y explica 3 errores típicos (require is not defined, ERR_MODULE_NOT_FOUND, __dirname is not defined).

## Apuntes
- 2026-11-22 (diagnóstico): nivel nulo. Solo sondeo con preguntas; aún sin lección.
- 2026-11-23: CJS usa require/module.exports (extensión opcional; existen require, module, __dirname, __filename); ESM usa import/export (extensión .js obligatoria; esas cuatro no existen).
- Node decide por extensión (.mjs/.cjs ganan) y luego por el campo type del package.json más cercano. En Node 24 un .js con import y sin type se detecta como ESM; con type commonjs da SyntaxError.
- Equivalentes en ESM: import.meta.dirname e import.meta.filename. require() de ESM funciona en Node 24 salvo con top-level await (ERR_REQUIRE_ASYNC_MODULE); import() dinámico sirve en ambos.
- Ejercicio: `ejercicios/fase-1/f1.modulos-cjs-esm/01-fix-esm-errors/` (debug, resuelto sin pistas).

## Errores cometidos
- 2026-11-22: No distingue require/import; no sabe por qué falla import sin type module ni qué pasa con __dirname en ESM.
- 2026-11-23: confundió import.meta.filename con dirname; explicaciones del porqué cortas; se saltó la predicción previa.

## Relacionados
- [[2026-11-23]]: se estudió en la misma sesión que [[Event loop y asincronía]] y [[HTTP y REST]].
