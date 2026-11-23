# f1.event-loop-async — Event loop y asincronía · Lección

*Lee este documento completo y responde las preguntas del final en el chat, una por una, para irlas desarrollando con el tutor.*

Esta lección parte de cero. Si algo te parece muy básico, léelo igual: está ahí a propósito. Si algo te parece demasiado denso, dímelo y lo reinicio desde una base más simple.

---

## Por qué existe

### El problema: un servidor debe atender a muchas personas a la vez

Imagina que escribes un servidor (un programa que está encendido todo el tiempo esperando que otros programas le hagan peticiones, por ejemplo tu app de Angular pidiendo una lista de tableros). Mientras atiendes a una persona, llegan otras diez.

Atender una petición casi nunca es solo "calcular algo". Casi siempre hay que **esperar**: esperar a que la base de datos responda, esperar a que se lea un archivo del disco, esperar a que otra API externa conteste. Esas esperas son lentas comparadas con lo que hace el procesador (milisegundos u horas del punto de vista del procesador, que hace millones de operaciones por segundo).

### Cómo se resolvía antes

La forma clásica era el **modelo de un hilo por petición**: cada persona que llega recibe su propio "trabajador" (un *hilo*, que es una línea de ejecución independiente dentro de un programa). Si 1000 personas llegan, hay 1000 trabajadores, y cada uno se queda parado esperando su respuesta.

¿Por qué eso era peor? Cada trabajador consume memoria, y la mayoría del tiempo está sin hacer nada, esperando. Es como contratar a un cocinero por cada cliente aunque casi todos se pasen el tiempo mirando el horno.

### Lo que hace Node.js

Node.js usa **un solo hilo** para ejecutar tu código JavaScript, y en vez de quedarse parado esperando, **anota lo que está esperando y sigue con otra cosa**. Cuando la espera termina, vuelve y continúa. El mecanismo que organiza esto se llama **event loop** (bucle de eventos).

Esto es potente, pero tiene una consecuencia que vas a ver en esta lección: **si ese único hilo se ocupa con algo largo, todo lo demás se detiene**. Entender esto es la diferencia entre un servidor que aguanta y uno que se congela.

---

## Términos que vas a ver

- **Hilo (thread):** una línea de ejecución. Un hilo hace una cosa a la vez.
- **Síncrono:** el código se ejecuta línea por línea; cada línea espera a que la anterior termine.
- **Asíncrono:** una operación que se *inicia* ahora pero cuyo resultado llega *después*; mientras tanto, el programa sigue.
- **Bloquear el hilo:** hacer algo largo y síncrono que impide que el hilo atienda cualquier otra cosa.
- **Call stack (pila de llamadas):** la "lista de lo que se está ejecutando ahora mismo". Tiene un solo nivel activo a la vez.
- **Callback:** una función que le entregas a otra para que la llame *más tarde*, cuando algo termine.
- **Cola de tareas:** una fila de callbacks esperando su turno para entrar a ejecutarse.
- **Macrotarea:** una tarea "grande" de la cola normal, por ejemplo la que dispara un `setTimeout`.
- **Microtarea:** una tarea "pequeña" de una cola especial con prioridad, por ejemplo la que dispara una promesa resuelta.
- **Promesa (Promise):** un objeto que representa un resultado que todavía no existe pero que va a existir (o fallar) en el futuro.
- **`async` / `await`:** forma más cómoda de escribir código que trabaja con promesas.
- **libuv:** la librería interna de Node, escrita en C, que se encarga de las esperas (disco, red, timers) fuera de tu hilo de JavaScript.

---

## Concepto

### Idea 1: un solo cocinero (el call stack)

**Analogía:** una cocina con **un solo cocinero**. Solo puede cortar, freír o emplatar una cosa a la vez. Lo que está haciendo en este momento es el **call stack**.

Cuando llamas a una función, entra al call stack; cuando termina, sale. Mientras una función está dentro, nada más puede ejecutarse.

```
console.log('hola')  →  entra a la pila, se ejecuta, sale
```

**Dónde la analogía deja de funcionar:** un cocinero real puede mirar el reloj mientras fríe. El call stack de JavaScript no: lo que está dentro se ejecuta de principio a fin sin interrupciones.

> **Pregunta mental:** si el cocinero tarda 5 segundos en una sola tarea, ¿qué hace el resto de clientes en ese tiempo? (Esta es tu pregunta 3 del diagnóstico; ya intuiste la respuesta.)

### Idea 2: el timbre y la ventanilla de pedidos (las esperas)

Si el cocinero tuviera que quedarse mirando el horno 10 minutos, no avanzaría nada. Entonces la cocina tiene **ayudantes** (en Node: libuv y el sistema operativo) que se encargan de las esperas. Cuando le dices a Node "léeme este archivo" o "espera 1 segundo", el cocinero:

1. Le entrega la orden al ayudante.
2. Deja anotado: "cuando termines, ejecuta ESTA función" (el callback).
3. Sigue con lo siguiente.

Cuando el ayudante termina, **no interrumpe al cocinero**. Pone el callback en una **fila** (la cola de tareas) y espera a que el cocinero esté libre.

**Dónde la analogía deja de funcionar:** los ayudantes reales de una cocina también son personas que cobran sueldo; aquí las esperas de red y de timers casi no cuestan, porque las gestiona el sistema operativo.

### Idea 3: el event loop es el encargado de la fila

El **event loop** es un bucle que repite siempre lo mismo:

1. ¿El call stack está vacío? (¿el cocinero está libre?)
2. Si sí, saca la siguiente tarea de la cola y ponla en el call stack.
3. Vuelve al paso 1.

Por eso un callback **nunca interrumpe** a otra función: solo entra cuando el stack se vacía.

### Idea 4: dos filas, una con prioridad (microtareas vs macrotareas)

Hay **dos colas**, no una:

| Cola | Qué entra aquí | Prioridad |
|---|---|---|
| **Microtareas** | Callbacks de promesas (`.then`, y lo que va después de un `await`), `queueMicrotask`, `process.nextTick` (tiene su propia cola aún más prioritaria) | **Alta** |
| **Macrotareas** | Callbacks de `setTimeout`, `setInterval`, E/S (leer archivos, red) | Normal |

**Regla de oro:** cuando el call stack queda vacío, el event loop **vacía por completo la cola de microtareas** antes de tomar *una sola* macrotarea.

**Analogía:** en el mostrador hay una fila normal y una "fila rápida" de pedidos urgentes. Antes de atender a alguien de la fila normal, el cocinero atiende a todos los de la fila rápida, incluso a los que se sumen mientras tanto.

**Dónde la analogía deja de funcionar:** en un mostrador real eso sería injusto; aquí es una regla del lenguaje y siempre es igual.

### Idea 5: `setTimeout(fn, 0)` no significa "ahora"

`setTimeout(fn, 0)` significa "pon `fn` en la fila de macrotareas lo antes posible". No se ejecuta de inmediato: antes tiene que terminar todo el código síncrono en curso **y** todas las microtareas pendientes.

Esto aclara un detalle de tu respuesta del diagnóstico: el retraso **no** se debe a que el timer tenga que "inicializar" o "cargar". Se debe a que `fn` entra a la fila de macrotareas, y esa fila solo se atiende cuando el stack está libre y las microtareas ya se vaciaron.

### Idea 6: qué es una promesa (y por qué la tuya sí se resolvía)

Una promesa es como el **ticket con número** que te dan en una panadería: no es el pan, es la garantía de que habrá pan (o te dirán que se acabó). Tiene tres estados:

- **pending** (pendiente): sigues esperando.
- **fulfilled** (cumplida): el resultado ya llegó.
- **rejected** (rechazada): hubo un error.

`Promise.resolve()` crea una promesa que **ya nace cumplida**. Y `.then(fn)` dice "cuando esté cumplida, mete `fn` en la cola de microtareas". Como ya estaba cumplida, `fn` entra a la cola de inmediato.

Aclaración sobre algo que dijiste en el diagnóstico: `await` **no es necesario** para que una promesa se resuelva. `await` solo sirve para *pausar tu función* hasta que la promesa se cumpla. Las promesas se resuelven por sí solas; `.then` ya engancha la tarea. Por eso la promesa de tu ejemplo no "nunca se resuelve": se resuelve y su callback corre.

### Idea 7: `async` / `await` es otra forma de escribir lo mismo

```ts
async function loadBoard(): Promise<string> {
  const data = await fetchSomething(); // pausa AQUÍ esta función, no todo el programa
  return data;
}
```

- `async` hace que la función **siempre devuelva una promesa**.
- `await` **pausa solo esa función** hasta que la promesa se cumpla, y libera el call stack para que otros hagan cosas. Lo que va **después** del `await` se ejecuta como una microtarea cuando la promesa se cumple.

**Equivalente con Angular:** en Angular usas Observables y `subscribe`; también ahí el código que reacciona llega después. Una promesa es parecida a un Observable que emite **un solo valor** y termina. Se diferencia en que una promesa empieza a ejecutarse en cuanto se crea (es "eager"), y un Observable normalmente no hace nada hasta que alguien se suscribe.

### Idea 8: bloquear el hilo

Si tu código síncrono tarda mucho (por ejemplo un `for` con mil millones de vueltas), el call stack no se vacía, el event loop **no puede sacar nada de ninguna cola**, y por tanto:

- los timers no se disparan a tiempo,
- las promesas ya cumplidas no ejecutan su `.then`,
- el servidor no contesta a ninguna petición.

`await` no bloquea porque libera el stack mientras espera. Un `for` pesado sí bloquea porque **no hay nada que liberar**: el cocinero está trabajando de verdad.

**Cómo se arregla:** dos formas comunes.
1. **Partir el trabajo** en pedazos pequeños y ceder el turno entre pedazos (por ejemplo con `setImmediate`), para que el event loop pueda atender otras cosas.
2. **Mandar el trabajo a otro hilo** con `worker_threads`: un segundo cocinero que se encarga solo de lo pesado.

---

## Demo mínima

### Demo 1: el orden de ejecución

```ts
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');
```

Explicación **línea por línea**:

- `console.log('A');` — Imprime `A` en la terminal. Es código síncrono: se ejecuta inmediatamente, dentro del call stack. Sin esta línea no habría un punto de referencia para ver qué corre antes.
- `setTimeout(() => console.log('B'), 0);` — Le pide a Node "pon esta función en la fila de **macrotareas** dentro de 0 ms". No imprime nada ahora. Solo registra la orden y el código sigue. Sin el `0`, tardaría el tiempo que pongas, pero sigue siendo una macrotarea.
- `Promise.resolve().then(() => console.log('C'));` — `Promise.resolve()` crea una promesa ya cumplida. `.then(...)` dice "cuando esté cumplida, ejecuta esto", así que mete la función en la cola de **microtareas**. No imprime nada ahora.
- `console.log('D');` — Imprime `D` inmediatamente. También síncrono.

**Salida esperada**, y por qué:

```
A
D
C
B
```

1. `A` y `D` salen primero porque son síncronos: el stack debe terminar todo lo síncrono antes de mirar cualquier cola.
2. Con el stack vacío, el event loop vacía **primero** las microtareas: sale `C`.
3. Solo después toma la macrotarea del timer: sale `B`.

Si quitaras el `Promise...then`, saldría `A D B`. Si cambiaras el orden de las líneas de `setTimeout` y de la promesa, el resultado sería el mismo, porque lo que manda es el tipo de cola, no el orden en que escribiste.

### Demo 2: un bucle síncrono retrasa un timer

```ts
const start: number = Date.now();

setTimeout(() => {
  console.log(`timer fired after ${Date.now() - start} ms`);
}, 100);

while (Date.now() - start < 2000) {
  // busy loop: occupies the thread for 2 seconds
}

console.log('loop finished');
```

Explicación **línea por línea**:

- `const start: number = Date.now();` — Guarda la hora actual en milisegundos. `: number` es el tipo explícito (TypeScript estricto). Sirve para medir cuánto pasa.
- `setTimeout(() => {...}, 100);` — Pide que el callback corra en ~100 ms. Solo se **registra**; todavía no se ejecuta.
- Dentro del callback: `console.log(\`timer fired after ${Date.now() - start} ms\`);` — Imprime cuánto tiempo pasó desde `start`. Los `${...}` insertan el valor dentro del texto.
- `while (Date.now() - start < 2000) { }` — Un bucle que no hace nada útil pero **no termina hasta pasados 2000 ms**. Es el equivalente a "el cocinero está ocupado 2 segundos". El comentario dentro del bucle explica su propósito.
- `console.log('loop finished');` — Imprime cuando el bucle termina.

**Cómo ejecutarlo:** guarda el código en un archivo `block.ts` y corre, desde esa carpeta:

```bash
npx tsx block.ts
```

- `npx` ejecuta una herramienta sin instalarla globalmente.
- `tsx` ejecuta archivos TypeScript directamente, sin compilar a mano.

**Salida esperada:**

```
loop finished
timer fired after 2000 ms     (aprox., no 100)
```

El timer pidió 100 ms, pero salió a ~2000 ms: no pudo entrar al stack hasta que el bucle terminó. Eso es **bloquear el hilo**.

---

## Errores típicos

1. **Creer que `setTimeout(fn, 0)` corre al instante.** Síntoma: el código "se ejecuta en otro orden" del esperado. Causa: `fn` es una macrotarea y espera a que el código síncrono y las microtareas terminen.
2. **Creer que `async` hace el código "más rápido" o paralelo.** Síntoma: usas `async` sobre una función con un `for` pesado y el servidor igual se congela. Causa: `async` no crea hilos; solo organiza el código que espera. Un cálculo pesado sigue ocupando el único hilo.
3. **Olvidar el `await`.** Síntoma: obtienes `Promise { <pending> }` en vez del valor, o el código sigue antes de tiempo. Causa: sin `await` no pausas la función, así que sigues con la promesa en la mano, no con su resultado.

---

## Preguntas — respóndelas en el chat

*Respóndelas de una en una; te contesto cada una antes de pasar a la siguiente. Responde con tus palabras, aunque no estés segura.*

1. Con tus palabras: ¿qué es el event loop y qué problema resuelve? Usa una analogía, si quieres la de la cocina o una tuya.
2. **Predice antes de ejecutar** (escribe tu respuesta y explica por qué):
   ```ts
   console.log('1');
   setTimeout(() => console.log('2'), 0);
   Promise.resolve().then(() => console.log('3'));
   (async () => {
     console.log('4');
     await null;
     console.log('5');
   })();
   console.log('6');
   ```
   ¿En qué orden salen los seis números?
3. Un servidor recibe una petición que hace un `for` de mil millones de vueltas. Otro usuario hace una petición simple al mismo tiempo. ¿Qué le pasa al segundo usuario, y qué dos soluciones posibles mencionó la lección?
