# f1.http-rest — HTTP y REST · Lección

*Lee este documento completo y responde las preguntas del final en el chat, una por una, para irlas desarrollando con el tutor.*

Esta lección parte de cero. Si algo te parece muy básico, léelo igual. Si algo te parece demasiado denso, dímelo y lo reinicio desde una base más simple.

---

## Por qué existe

### El problema: dos programas necesitan ponerse de acuerdo

Tu app de Angular (el *cliente*) corre en el navegador. Tu API de Nest (el *servidor*) corre en otra máquina. Son programas distintos, escritos por personas distintas, quizá en lenguajes distintos. Para que se entiendan, necesitan un **idioma común**: reglas sobre cómo se pide algo, cómo se responde y cómo se avisa si algo salió mal.

### Qué se hacía antes

Antes de que existieran convenciones comunes, cada servicio inventaba su propio formato: uno exigía enviar todo en una sola ruta (`/api?accion=borrarUsuario&id=3`), otro devolvía siempre "OK" aunque hubiera fallado, y cada uno usaba sus propios códigos de error. Para usar una API ajena tenías que leer un manual entero y aprender sus manías.

### Qué resuelve HTTP y qué añade REST

- **HTTP** (*HyperText Transfer Protocol*, protocolo de transferencia de hipertexto) es el idioma común: define la forma de una **petición** y de una **respuesta**.
- **REST** es un conjunto de **convenciones de diseño** sobre HTTP: en vez de inventar acciones, piensas en **recursos** (cosas, como "tableros" o "usuarios") y usas los **métodos** de HTTP como verbos estándar sobre ellos.

Resultado: quien conoce las convenciones puede adivinar bastante de una API nueva sin leer su manual.

---

## Términos que vas a ver

- **Cliente:** el programa que hace la petición (tu app Angular, `curl`, Postman...).
- **Servidor:** el programa que recibe la petición y responde (tu API de Nest).
- **Petición (request):** el mensaje que envía el cliente.
- **Respuesta (response):** el mensaje que devuelve el servidor.
- **Recurso:** una "cosa" que la API maneja y que tiene identidad, por ejemplo un tablero.
- **Ruta (path):** la parte de la dirección que identifica un recurso, como `/boards/7`.
- **Método HTTP:** el "verbo" de la petición: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- **Código de estado (status code):** un número de 3 cifras en la respuesta que dice cómo salió todo.
- **Header (cabecera):** un dato extra, con nombre y valor, que acompaña a la petición o a la respuesta (no es parte del contenido principal).
- **Body (cuerpo):** el contenido principal del mensaje, por ejemplo los datos de un tablero.
- **JSON:** formato de texto para representar datos, como `{ "name": "Todo" }`.
- **Idempotente:** una operación es idempotente si hacerla una vez o hacerla diez veces seguidas deja el servidor en el **mismo estado final**.
- **`curl`:** una herramienta de terminal para enviar peticiones HTTP a mano.

---

## Concepto

### Idea 1: una petición y una respuesta

Todo funciona como una conversación de **una pregunta y una respuesta**.

**Analogía:** pedir en una ventanilla. Tú dices qué quieres y sobre qué (petición), y el empleado te contesta con lo que pasó (respuesta).

Una **petición** lleva:
1. **Método**: qué quieres hacer (`GET`, `POST`...).
2. **Ruta**: sobre qué recurso (`/boards/7`).
3. **Headers**: datos extra (por ejemplo "te estoy enviando JSON").
4. **Body** (opcional): los datos, si hay que enviar algo.

Una **respuesta** lleva:
1. **Código de estado**: cómo salió.
2. **Headers**.
3. **Body** (opcional): lo que devuelve el servidor.

**Dónde la analogía deja de funcionar:** en la ventanilla puedes hacer preguntas de seguimiento sobre la marcha. En HTTP cada petición es independiente: el servidor no recuerda por sí mismo la anterior.

### Idea 2: recursos y rutas

En REST, la ruta nombra una **cosa**, no una acción. Se usa el **sustantivo en plural**:

| Ruta | Significa |
|---|---|
| `/boards` | la colección de todos los tableros |
| `/boards/7` | el tablero número 7 |
| `/boards/7/cards` | las tarjetas del tablero 7 |

La **acción** la expresa el método, no la ruta. Por eso **no** se escribe `/crearTablero` ni `/borrarTablero/7`.

### Idea 3: los métodos como verbos

| Método | Para qué | Ejemplo | ¿Lleva body? |
|---|---|---|---|
| `GET` | **Leer** | `GET /boards/7` | No |
| `POST` | **Crear** un recurso nuevo | `POST /boards` | Sí |
| `PUT` | **Reemplazar** el recurso completo | `PUT /boards/7` | Sí (todo el recurso) |
| `PATCH` | **Modificar solo parte** del recurso | `PATCH /boards/7` | Sí (solo lo que cambia) |
| `DELETE` | **Borrar** | `DELETE /boards/7` | No |

Tú ya distinguías bien `PUT` y `PATCH`. Un detalle: en la práctica, muchas APIs usan más `PATCH` para actualizar parcialmente, y reservan `PUT` para reemplazos completos.

**Equivalente con Angular:** en `HttpClient` usas `this.http.get(...)`, `.post(...)`, `.put(...)`, `.patch(...)` y `.delete(...)`: son exactamente estos mismos verbos.

### Idea 4: idempotencia (la que quedó floja en el diagnóstico)

Antes de definirla, una distinción previa: **no es** "que la petición no se repita hasta que la anterior se resuelva" (esa era tu definición). Es sobre **el estado final del servidor**.

**Analogía:** el botón de un ascensor. Si lo pulsas una vez, el ascensor viene al piso 3. Si lo pulsas diez veces seguidas, el resultado final es el mismo: el ascensor viene al piso 3. Eso es idempotente. En cambio, un botón de "añadir una moneda a la hucha" **no** es idempotente: pulsarlo diez veces deja diez monedas.

Aplicado a los métodos:

| Método | ¿Idempotente? | Por qué |
|---|---|---|
| `GET` | Sí | Leer no cambia nada |
| `PUT` | Sí | Reemplazar con los mismos datos diez veces deja el mismo recurso |
| `DELETE` | Sí | Borrar el tablero 7 diez veces: después de la primera ya no existe, y el estado final es el mismo (sin tablero 7) |
| `POST` | **No** | Cada `POST /boards` crea un tablero **nuevo**. Diez peticiones = diez tableros |
| `PATCH` | **Depende** | `PATCH {"name": "X"}` es idempotente. Pero `PATCH {"increment": 1}` no lo es |

**Dónde la analogía deja de funcionar:** el ascensor no distingue qué piso pediste; en HTTP importa **qué datos** envías. Por eso `PATCH` "depende".

**Por qué importa:** si una petición se corta a medias (internet falla) y no sabes si llegó, puedes **reintentarla sin miedo** si es idempotente. Con `POST` hay riesgo de duplicar.

### Idea 5: códigos de estado

Son números de 3 cifras. La primera cifra indica la familia:

| Familia | Significa | Ejemplo |
|---|---|---|
| `2xx` | Todo salió bien | `200`, `201`, `204` |
| `3xx` | Redirección | `301` |
| `4xx` | **Error del cliente**: la petición está mal | `400`, `404` |
| `5xx` | **Error del servidor**: la petición estaba bien pero el servidor falló | `500` |

Los que más vas a usar:

| Código | Nombre | Cuándo |
|---|---|---|
| `200` | OK | Lectura o actualización correcta, con body |
| `201` | Created | Se **creó** un recurso nuevo (respuesta típica de `POST`) |
| `204` | No Content | Salió bien y **no hay body** que devolver (típico de `DELETE`) |
| `400` | Bad Request | El cliente envió datos inválidos (JSON roto, falta un campo) |
| `404` | Not Found | El recurso que se pide no existe |
| `500` | Internal Server Error | Falló algo dentro del servidor (un bug) |

**Analogía:** el semáforo de la ventanilla. `2xx` es "listo, aquí tiene", `4xx` es "usted se equivocó en el formulario", `5xx` es "se nos cayó el sistema, no es culpa suya".

**Dónde la analogía deja de funcionar:** una ventanilla real te explica con palabras qué hiciste mal. El código solo da la categoría; el detalle suele ir en el body.

### Idea 6: headers y JSON

Un **header** es un dato con nombre y valor. Dos que verás siempre:

- `Content-Type: application/json` → "el body que envío (o recibo) está en formato JSON". Sin él, el servidor puede no saber cómo leer el body.
- `Authorization: Bearer <token>` → credenciales (lo verás más adelante en la fase de seguridad).

**JSON** es texto con una estructura parecida a un objeto de JavaScript, pero con reglas más estrictas: las claves van **siempre entre comillas dobles** y no admite comentarios ni comas finales.

```json
{ "name": "Todo", "columns": 3 }
```

---

## Demo mínima

### Demo: un recurso "tableros" visto con `curl`

Estos comandos son para **leer y entender**; todavía no tienes un servidor al que dispararlos (lo construirás en el tópico siguiente, "Servidor HTTP sin framework"). Imagina uno ya funcionando en `http://localhost:3000`.

**1) Crear un tablero**
```bash
curl -i -X POST http://localhost:3000/boards \
  -H "Content-Type: application/json" \
  -d '{"name":"Todo"}'
```
Línea por línea:
- `curl` — la herramienta que envía la petición.
- `-i` — pide que muestre también los **headers y el código de estado de la respuesta**, no solo el body. Sin esto solo verías el body.
- `-X POST` — fuerza el método `POST`.
- `http://localhost:3000/boards` — la dirección: `localhost` es "esta misma computadora", `3000` es el puerto (la "puerta" del servidor) y `/boards` es la ruta de la colección.
- `-H "Content-Type: application/json"` — añade el header que avisa que el body es JSON.
- `-d '{"name":"Todo"}'` — el **body** de la petición (`d` de *data*). Va entre comillas simples para que la terminal no toque las comillas dobles del JSON.

Salida esperada (resumida):
```
HTTP/1.1 201 Created
Content-Type: application/json

{"id":1,"name":"Todo"}
```
Se lee así: `201` = se creó; el servidor devuelve el recurso con su `id`.

**2) Leerlo**
```bash
curl -i http://localhost:3000/boards/1
```
- Sin `-X`, `curl` usa `GET` por defecto. Esperas `200 OK` y el tablero en el body.

**3) Pedir uno que no existe**
```bash
curl -i http://localhost:3000/boards/999
```
- Esperas `404 Not Found`. El cliente pidió algo que no hay: error del lado cliente (`4xx`).

**4) Borrarlo**
```bash
curl -i -X DELETE http://localhost:3000/boards/1
```
- Esperas `204 No Content`: salió bien y no hay body. Si lo repites, la segunda vez normalmente obtienes `404`, pero el estado final sigue siendo el mismo (no existe el tablero 1): por eso `DELETE` se considera idempotente aunque el código de respuesta cambie.

---

## Errores típicos

1. **Poner verbos en la ruta** (`/createBoard`, `/deleteBoard/7`). Síntoma: la API se siente "rara" y no sigue las convenciones. Causa: se olvida que la acción la pone el método HTTP.
2. **Devolver siempre `200`, incluso en errores.** Síntoma: el cliente cree que todo salió bien y trata un error como dato válido. Causa: no usar los códigos de estado para distinguir éxito de error.
3. **Confundir `400` con `404`.** `400` = "tu petición está mal formada o inválida"; `404` = "lo que buscas no existe". Un `POST` con JSON roto es `400`; un `GET /boards/999` de un tablero inexistente es `404`.

---

## Preguntas — respóndelas en el chat

*Una por una. Con tus palabras, aunque no estés segura.*

1. Quieres un endpoint para **crear** un tablero: ¿qué método, qué ruta y qué código de estado de éxito usarías? Y: ¿qué código devolverías si el cliente envía un JSON inválido, y cuál si pide un tablero que no existe?
2. Con la analogía del ascensor, explica con tus palabras qué significa que un método sea **idempotente**. Luego dime: ¿`POST /boards` es idempotente? ¿Y `DELETE /boards/7`? Justifica cada uno.
3. Escribe el comando `curl` para **actualizar solo el nombre** del tablero 7 a `"Done"`. ¿Qué método usarías y por qué ese y no el otro?
