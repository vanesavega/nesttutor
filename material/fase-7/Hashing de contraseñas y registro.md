---
topic_id: f7.hash-passwords
fase: 7
tipo: codigo
estado: no_visto
nivel: sin_evaluar
tags: [fase/7, estado/no_visto]
---

# Hashing de contraseñas y registro

**Prerequisitos:** [[Transacciones y persistencia políglota]], [[Repository y QueryBuilder]]

**Criterio de dominio:** El endpoint /register guarda un hash argon2 y nunca el texto; un test comprueba que la contraseña no aparece en la respuesta ni en logs y que la verificación acepta la correcta y rechaza la incorrecta.

## Apuntes
*(el tutor escribe aquí al cierre de cada sesión que toque este tópico)*

## Errores cometidos

## Relacionados
