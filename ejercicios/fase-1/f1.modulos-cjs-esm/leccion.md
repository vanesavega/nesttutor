# f1.modulos-cjs-esm — Módulos CommonJS y ES Modules · Lección

*Lee este documento completo y responde las preguntas del final en el chat, una por una, para irlas desarrollando con el tutor.*

Esta lección parte de cero. Si algo te parece muy básico, léelo igual. Si algo te parece demasiado denso, dímelo y lo reinicio desde una base más simple.

**Importante sobre versiones:** muchos tutoriales de internet fueron escritos para Node más antiguo. Todo lo que ves aquí fue **comprobado ejecutándolo en Node 24**, la versión de este curso. Donde Node 24 se comporta distinto a lo que dicen tutoriales viejos, te lo señalo.

---

## Por qué existe

### El problema: un programa grande no cabe en un archivo

Imagina que tu API tiene 5000 líneas. Si todo está en un solo archivo:
- no encuentras nada,
- dos partes del código pueden usar el mismo nombre de variable y pisarse,
- no puedes reutilizar una pieza en otro proyecto sin copiar y pegar.

La solución es dividir el código en **archivos separados** (llamados **módulos**), donde cada uno **decide qué comparte** con los demás y **qué toma** de los demás.

### Qué se hacía antes

JavaScript nació en el navegador **sin ninguna forma de dividir el código en archivos**. Se resolvía pegando muchas etiquetas `<script>` en el HTML, y todas las variables quedaban en un espacio común: una variable de un archivo podía pisar a la de otro. Era frágil y difícil de mantener.

### Dos sistemas, por una razón histórica

Cuando Node.js apareció (2009), JavaScript todavía no tenía un sistema de módulos oficial. Node **inventó el suyo**: **CommonJS** (CJS), con `require` y `module.exports`. Años después, el propio lenguaje JavaScript estandarizó uno oficial: los **ES Modules** (ESM), con `import` y `export`. Es el que usas en Angular.

Resultado: hoy conviven **dos sistemas** en Node. No es un descuido: es herencia. Y casi todos los errores raros de este tema salen de mezclarlos sin darte cuenta.

---

## Términos que vas a ver

- **Módulo:** un archivo de código que expone ciertas cosas y puede tomar cosas de otros archivos.
- **CommonJS (CJS):** el sistema original de Node. Usa `require(...)` para traer y `module.exports` para compartir.
- **ES Modules (ESM):** el sistema oficial de JavaScript. Usa `import ... from ...` para traer y `export` para compartir.
- **`package.json`:** un archivo de configuración de tu proyecto Node. Entre otras cosas guarda el nombre, las dependencias y, en este tema, el campo `"type"`.
- **Campo `"type"`:** dentro de `package.json`, le dice a Node cómo interpretar los archivos `.js`: `"commonjs"` o `"module"`.
- **Extensión `.cjs` / `.mjs`:** forma de forzar el sistema de **un archivo concreto**, sin importar el `"type"`: `.cjs` siempre es CJS, `.mjs` siempre es ESM.
- **Scope (alcance) de módulo:** el "espacio" donde viven las variables de un archivo. En ESM y CJS, lo que declaras en un archivo no se ve desde otro salvo que lo compartas.
- **`tsconfig.json`:** archivo de configuración de TypeScript. La opción `"module"` indica a qué sistema debe traducir tu código el compilador.
- **`tsc`:** el compilador de TypeScript: traduce `.ts` a `.js`.
- **Top-level await:** usar `await` directamente en el nivel superior de un archivo, sin meterlo dentro de una función `async`. Solo existe en ESM.

---

## Concepto

### Idea 1: CommonJS, la forma clásica de Node

**Analogía:** un taller donde cada herramienta está en su propia caja con etiqueta. Para usar una, vas a buscar su caja (`require`) y cada caja tiene una puerta por la que **solo sale lo que su dueño decidió sacar** (`module.exports`).

```js
// util.js (the one that shares)
module.exports = { hello: () => 'hi from cjs' };

// app.js (the one that uses it)
const { hello } = require('./util');
console.log(hello());
```

- `module.exports = ...` — lo que pongas aquí es lo que otros reciben cuando hagan `require` de este archivo.
- `require('./util')` — **ejecuta** `util.js` y devuelve lo que ese archivo puso en `module.exports`. El `./` significa "en esta misma carpeta".

**Dónde la analogía deja de funcionar:** una caja real tiene cosas físicas; aquí lo que sacas es una **referencia al mismo objeto**, no una copia independiente. Y `require` es una **llamada a función** que corre en el momento, no una declaración fija.

### Idea 2: ES Modules, la forma oficial

```js
// util.js
export const hello = () => 'hi from esm';

// app.js
import { hello } from './util.js';
console.log(hello());
```

- `export const hello = ...` — marca `hello` como compartido.
- `import { hello } from './util.js'` — trae `hello`. **Fíjate en `.js` al final:** en ESM la extensión del archivo es **obligatoria** en rutas relativas. Es una diferencia importante con Angular, donde el empaquetador lo resuelve por ti.

**Equivalente con Angular:** en tus componentes siempre usaste `import { Component } from '@angular/core'`. Eso es ESM. Por eso este tema te resultará familiar en la sintaxis; lo nuevo es entender **por qué Node necesita saber cuál sistema usar**.

### Idea 3: diferencias de comportamiento que debes conocer

| | CommonJS | ES Modules |
|---|---|---|
| Traer | `require('./x')` | `import ... from './x.js'` |
| Compartir | `module.exports = ...` | `export ...` |
| Extensión en ruta relativa | opcional (`./x`) | **obligatoria** (`./x.js`) |
| `require`, `module`, `__dirname`, `__filename` | existen | **no existen** |
| Cuándo se carga | en el momento de ejecutar `require(...)` | `import` se resuelve **antes** de ejecutar el código |
| Top-level `await` | no | sí |

Los tres errores que el criterio de dominio te pide provocar y explicar vienen de esa tabla:

1. **`require is not defined`** — usas `require(...)` dentro de un archivo ESM.
2. **`ERR_MODULE_NOT_FOUND`** — en ESM escribes `import ... from './util'` sin `.js`.
3. **`__dirname is not defined`** — usas `__dirname` dentro de un archivo ESM.

### Idea 4: cómo decide Node si un archivo es CJS o ESM

Node necesita saber qué idioma habla un archivo **antes** de leerlo. Lo decide en este orden:

1. Si la extensión es **`.mjs`** → ESM. Si es **`.cjs`** → CJS. (Gana siempre.)
2. Si es `.js`, mira el campo **`"type"`** del `package.json` más cercano hacia arriba:
   - `"type": "module"` → ESM
   - `"type": "commonjs"` → CJS
3. Si **no hay `"type"`**, el valor por defecto histórico es CJS.

**Cambio en Node 24 que debes conocer:** si no hay `"type"` y el archivo `.js` contiene sintaxis `import`/`export`, Node 24 **lo detecta y lo trata como ESM** en lugar de fallar. Lo comprobé: un `.js` con `import fs from 'node:fs'` y sin `"type"` funciona. Tutoriales viejos dicen que da error: ya no es así. Pero **si pones `"type": "commonjs"` explícito**, entonces sí falla con `SyntaxError: Cannot use import statement outside a module`.

Conclusión práctica: **no confíes en la detección automática**. Declara siempre el `"type"` en tu `package.json`, para que el sistema sea explícito y predecible.

### Idea 5: mezclar los dos sistemas

- **ESM puede importar CJS** sin problema.
- **CJS puede cargar ESM** con `require()` **en Node 24** (comprobado). Esto es **nuevo**: antes daba el famoso `ERR_REQUIRE_ESM`, que verás mucho en tutoriales y preguntas viejas de internet. Hoy sigue fallando en un caso: si el módulo ESM usa **top-level `await`**; entonces sale `ERR_REQUIRE_ASYNC_MODULE` y debes usar `import()`.
- **`import()` dinámico:** `import('./x.js')` es una **función** que devuelve una promesa. Funciona desde CJS y desde ESM, y sirve para cargar un módulo ESM cuando `require` no puede, o para cargarlo solo cuando hace falta.

### Idea 6: equivalentes de `__dirname` en ESM

En ESM no existe `__dirname`, pero hay reemplazo: `import.meta.dirname` (la carpeta del archivo actual) e `import.meta.filename` (la ruta del archivo actual). Existen en Node 24.

### Idea 7: TypeScript y la opción `module`

Tú escribes `import`/`export` en tus archivos `.ts` casi siempre. Pero lo que Node ejecuta es el `.js` que genera `tsc`. La opción `"module"` de `tsconfig.json` decide **cómo se traduce** tu `import`:

- `"module": "commonjs"` → `tsc` convierte tus `import` en `require(...)`. El resultado corre como CJS. **Es lo que usa Nest por defecto**, y es la razón por la que en el repo del curso aparece "CommonJS" como contexto.
- `"module": "nodenext"` → `tsc` respeta lo que decida Node según `"type"` y la extensión; y en ESM te exige poner `.js` en las rutas relativas, aunque tu archivo sea `.ts`.

Idea clave: el `"type"` de `package.json` y el `"module"` de `tsconfig.json` deben **estar de acuerdo**. Si no, `tsc` compila bien pero Node falla al ejecutar.

---

## Demo mínima

Esta demo es para **leer y entender**. Ya la ejecuté yo en Node 24 con esta estructura:

```
mods/
├── cjs/
│   ├── util.js
│   └── app.js
└── esm/
    ├── package.json     ← contiene {"type":"module"}
    ├── util.js
    └── app.js
```

**Carpeta `cjs/`** (sin `"type"`, usa CommonJS):
```js
// cjs/util.js
module.exports = { hello: () => 'hi from cjs' };

// cjs/app.js
const { hello } = require('./util');
console.log(hello(), typeof __dirname);
```
- `module.exports = {...}` comparte un objeto con una función.
- `require('./util')` lo trae; las llaves `{ hello }` toman solo esa propiedad (se llama *desestructuración*, la misma de Angular/JS).
- `typeof __dirname` pregunta qué tipo de dato es `__dirname`. En CJS existe y es un texto.

Comando y salida:
```bash
node cjs/app.js
```
`node` ejecuta el archivo. Salida real: `hi from cjs string`.

**Carpeta `esm/`** (con `"type": "module"` en su `package.json`):
```js
// esm/util.js
export const hello = () => 'hi from esm';

// esm/app.js
import { hello } from './util.js';
console.log(hello());
console.log(typeof require, typeof __dirname);
```
- `typeof require` y `typeof __dirname` dan `undefined` porque **no existen** en ESM. `typeof` es la forma segura de preguntar: no lanza error aunque la variable no exista.

Salida real:
```
hi from esm
undefined undefined
```

**Los tres errores, en ESM** (todos reproducidos en esta máquina):

| Código | Error que da | Por qué |
|---|---|---|
| `const x = require('node:fs');` | `ReferenceError: require is not defined in ES module scope, you can use import instead` | `require` no existe en ESM |
| `import { hello } from './util';` (sin `.js`) | `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../util'` | ESM no adivina la extensión |
| `console.log(__dirname);` | `ReferenceError: __dirname is not defined in ES module scope` | `__dirname` no existe en ESM |

---

## Errores típicos

1. **Mezclar sin darte cuenta.** Copias un ejemplo de internet que usa `require` en un proyecto con `"type": "module"`. Síntoma: `require is not defined in ES module scope`. Causa: el `"type"` hace que todo `.js` sea ESM.
2. **Olvidar la extensión en ESM.** Síntoma: `ERR_MODULE_NOT_FOUND` aunque el archivo exista. Causa: en ESM, `'./util'` busca literalmente un archivo llamado `util`, no `util.js`.
3. **Fiarte de un tutorial viejo.** Síntoma: un tutorial dice "esto da ERR_REQUIRE_ESM" y en tu Node 24 funciona. Causa: Node cambió. Mira la versión del tutorial antes de creerlo.

---

## Preguntas — respóndelas en el chat

*Una por una. Con tus palabras, aunque no estés segura.*

1. Con tus palabras: ¿cuál es la diferencia entre `require(...)` y `import ... from ...`? Dime al menos dos diferencias concretas de la tabla de la Idea 3.
2. Tienes `app.js` con `import fs from 'node:fs'` y un `package.json` con `"type": "commonjs"`. ¿Qué pasa al ejecutarlo con `node app.js`, y qué dos formas distintas tienes de arreglarlo?
3. En un archivo ESM necesitas la carpeta del archivo actual. ¿Qué escribirías en lugar de `__dirname`, y por qué `__dirname` no funciona ahí?
