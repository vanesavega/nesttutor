---
topic_id: f4.database-module-global
fase: 4
tipo: codigo
estado: no_visto
nivel: sin_evaluar
tags: [fase/4, estado/no_visto]
---

# DatabaseModule global con useFactory

**Prerequisitos:** [[node-postgres - Pool, consultas parametrizadas y transacciones]]

**Criterio de dominio:** Un DatabaseModule global expone el Pool vía useFactory con configuración tipada; un UsersRepository hace CRUD con pg; al cerrar la app el pool se cierra (se ve en logs) y compose es el único requisito para correrla.

## Apuntes
*(el tutor escribe aquí al cierre de cada sesión que toque este tópico)*

## Errores cometidos

## Relacionados
