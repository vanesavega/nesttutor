---
topic_id: f1.http-rest
fase: 1
tipo: mixto
estado: visto
nivel: bajo
tags: [fase/1, estado/visto]
---

# HTTP y REST

**Prerequisitos:** [[TypeScript para backend]]

**Criterio de dominio:** Una tabla de 8 endpoints de un recurso con método, ruta, código de éxito y códigos de error, justificando cuáles son idempotentes, y verificada con curl contra el servidor del tópico siguiente.

## Apuntes
- 2026-11-22 (diagnóstico): nivel bajo. Solo sondeo con preguntas; aún sin lección.
- 2026-11-23: REST nombra recursos con sustantivos en plural; el método es el verbo (GET leer, POST crear, PUT reemplazar, PATCH modificar parte, DELETE borrar).
- Idempotente = repetir la operación deja el mismo estado final del servidor (GET, PUT, DELETE sí; POST no; PATCH depende). La respuesta puede cambiar (DELETE: 204 y luego 404).
- Códigos: 200 OK, 201 Created, 204 No Content, 400 petición inválida, 404 recurso inexistente, 500 fallo del servidor.
- Ejercicio: `ejercicios/fase-1/f1.http-rest/01-endpoints-table/tabla.md` (5 de 8 filas; pendiente, se verifica con curl tras el servidor nativo).

## Errores cometidos
- 2026-11-22: Define mal idempotencia; no sabe códigos de estado para crear/400/404; distingue PUT de PATCH.
- 2026-11-23: definió idempotencia como 'no repetir la petición'; PUT y PATCH sin /{id}; typo PACTH; 404 como 'ruta no encontrada'; Path con comandos curl.

## Relacionados
- [[Servidor HTTP sin framework]]: el servidor donde se verificará la tabla con curl (criterio de dominio de este tópico).
- [[2026-11-23]]: se estudió en la misma sesión que [[Event loop y asincronía]] y [[Módulos CommonJS y ES Modules]].
