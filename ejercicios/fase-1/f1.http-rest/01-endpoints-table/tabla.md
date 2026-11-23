# Endpoints for the `boards` resource

> Transcribed by the tutor from the student's screenshot (2026-11-23). Status: 5 of 8 rows. Left as submitted on purpose; pending items are listed at the bottom.

| # | Method | Path | Success code | Error codes (and when) | Idempotent? | Why |
|---|--------|------|--------------|------------------------|-------------|-----|
| 1 | GET | curl -i http://localhost:3000/boards | 200 | 404 si no encuentra esa ruta | si | por que si lo envio varias veces no cambia anda de boards |
| 2 | POST | curl -i -X POST http://localhost:3000/boards \ -H "Content-Type: application/json" \ -d '{"name":"Todo", "columns":3}' | 201 | 404: la ruta donde intenta crear el board no existe o 400 si envio el body de forma incorrecta | no | si se envia el post dos veces, se crean dos boards o elementos |
| 3 | PUT | curl -i -X PUT http://localhost:3000/boards \ -H "Content-Type: application/json" \ -d '{"name":"done", "columns":5}' | 200 | 404: la ruta donde intenta crear el board no existe o 400 si envio el body de forma incorrecta | si | si se hace el put varias veces con el mismo contenido este solo cambia el elemnto una vez |
| 4 | PATCH | curl -i -X PACTH http://localhost:3000/boards \ -H "Content-Type: application/json" \ -d '{"name":"done"}' | 200 | 404: la ruta donde intenta crear el board no existe o 400 si envio el body de forma incorrecta | si | si se hace el patch varias veces con el mismo contenido este solo cambia el elemnto una vez |
| 5 | DELETE | curl -i -X DELETE http://localhost:3000/boards/1 | 204 | 404 si no encuentra esa ruta | SI | si se evia varios deletes del ismo elemnto este ya se habra borrado con el primeor y no va a cmabair el recurso |

## Pending (from the tutor's review)

- Rows 6-8 missing.
- Rows 3 and 4: PUT and PATCH need an `/{id}` in the path (which board are they changing?).
- Row 4: `PACTH` typo, should be `PATCH`.
- Path column should hold only the path (e.g. `/boards/7`), not the full `curl` command.
- 404 should mean "that specific board does not exist", not "route not found".
- Table text should be in English.
