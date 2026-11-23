---
topic_id: f2.dtos-validacion
fase: 2
tipo: codigo
estado: no_visto
nivel: bajo
tags: [fase/2, estado/no_visto]
---

# DTOs y validación con class-validator

**Prerequisitos:** [[Rutas, parámetros y códigos HTTP]]

**Criterio de dominio:** DTOs de creación y actualización (este con PartialType); una petición con campo extra se rechaza con 400 y una con tipo equivocado se rechaza o convierte según la configuración, con un test e2e que lo demuestra.

## Apuntes
- 2026-11-22 (diagnóstico): nivel bajo. Solo sondeo con preguntas; aún sin lección.

## Errores cometidos
- 2026-11-22: No sabe que falta ValidationPipe para validar; esperaba que class-validator actuara solo.

## Relacionados
