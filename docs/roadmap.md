# Roadmap estándar de NestJS y Node.js backend (2026 →)

Parte de JavaScript y TypeScript básicos y llega a un perfil capaz de construir, probar y desplegar un backend completo con NestJS 12 sobre Node 24/26 LTS: PostgreSQL y MongoDB, autenticación, tiempo real y microservicios. Cada fase termina con un criterio de dominio verificable con código, que el agente tutor usará para ubicar el punto de partida.

**Versiones de referencia (nov 2026):** NestJS 12.x (12.1.1 a fines de sep 2026), Node 24 LTS (Node 26 entra a LTS el 28 oct 2026), TypeScript 6, @nestjs/config 12 (validación por Standard Schema; Joi 18+ sigue funcionando), TypeORM 1.x, Mongoose 9.x.

## Principios de diseño
1. **Conceptos antes que sintaxis.** Inyección de dependencias, módulos, ciclo de vida de la request, transacciones y relaciones no cambian entre versiones; los decoradores y las APIs sí. Lo legado (CJS, class-validator como única opción) se estudia como lectura, no como camino principal.
2. **Problema antes que herramienta.** Cada herramienta entra cuando el proyecto transversal la necesita, no por completitud.
3. **SQL antes que ORM.** Se escribe SQL con `pg` antes de usar TypeORM, para entender qué hace el ORM por debajo.
4. **Sesgo hacia donde va el campo.** Nest 12 trae paquetes ESM, validación con Standard Schema (Zod, Valibot, ArkType), CLI reconstruido y observabilidad nativa (`@nestjs/observe`). Se enseña Joi y class-validator (lo que hay en miles de proyectos) junto a Standard Schema, y TypeORM con conciencia de Drizzle y Prisma.
5. **La IA como copiloto.** CRUDs, DTOs y boilerplate se generan; lo que se entrena es el criterio: revisar una migración, detectar un N+1, juzgar un guard, desconfiar de un transaction mal puesto.
6. **Sin certificaciones.** No existe una certificación de NestJS con peso en el mercado; la señal es un proyecto desplegado, con pruebas y CI.

## Mapa general
| # | Fase | Horas est. | Hito verificable |
|---|------|-----------|------------------|
| 1 | Node.js y TypeScript para backend | 14 | Servidor HTTP sin framework |
| 2 | Núcleo de Nest: controladores, servicios, módulos, DTOs, pipes | 26 | API REST modular documentada |
| 3 | Providers personalizados, módulos globales y dinámicos | 12 | Provider intercambiable por entorno |
| 4 | Configuración tipada, Docker y PostgreSQL con `pg` | 20 | DB en Docker desde módulo global |
| 5 | TypeORM, patrón repository, migraciones y relaciones | 30 | Modelo relacional migrado |
| 6 | MongoDB y Mongoose | 20 | Módulo Mongo tipado con relaciones |
| 7 | Autenticación y autorización | 18 | JWT con refresh y roles |
| 8 | Tiempo real, colas y microservicios | 28 | Tablero en vivo + microservicio |
| 9 | Calidad, observabilidad y despliegue | 22 | API desplegada con CI verde |

Total ≈ 190 horas efectivas entre estudio y práctica.

---

## Fase 1: Node.js y TypeScript para backend (~14 h)
**Objetivo:** entender qué es Node por dentro y escribir un servidor HTTP sin framework.
**Conceptos**
- Event loop (llamadas bloqueantes vs no bloqueantes, microtareas, `async/await`, promesas)
- Streams y buffers (por qué importan con archivos grandes)
- Sistemas de módulos: CommonJS vs ES Modules (`package.json` `type`, `tsconfig` `module`)
- Gestor de paquetes y scripts (`pnpm` o `npm`), `process.env` y `--env-file`
- HTTP y REST: métodos, códigos de estado, headers, JSON, idempotencia
- TypeScript para backend: `strict`, interfaces vs clases, genéricos, utility types, decoradores y `emitDecoratorMetadata`
- Manejo de errores y errores operacionales vs bugs
**Tecnologías:** Node 24 LTS, TypeScript 6, pnpm, `node:http`, Bruno o curl.
**Criterio de dominio:** implementa con `node:http` (sin Express) un servidor con router mínimo y CRUD de un recurso en memoria: parseo de JSON, códigos HTTP correctos y manejo centralizado de errores. Demuestra con un script que un bucle síncrono pesado bloquea otras peticiones y corrígelo.
**Certificación:** ninguna necesaria en esta fase.

## Fase 2: Núcleo de Nest, controladores, servicios, módulos, DTOs y pipes (~26 h)
**Objetivo:** construir una API REST modular con validación y entender el ciclo completo de una request.
**Conceptos**
- Anatomía de Nest: módulos, controladores, providers, CLI (`nest g resource`)
- Decoradores de ruta y parámetros (`@Param`, `@Query`, `@Body`)
- Servicios e inyección por constructor
- DTOs vs entities (modelo de entrada/salida vs modelo de dominio); `PartialType`, `PickType`, `OmitType`
- Validación: `ValidationPipe` (`whitelist`, `transform`), class-validator y class-transformer; schema con Zod vía Standard Schema (Nest 12)
- Pipes integrados (`ParseIntPipe`, `ParseUUIDPipe`) y pipes personalizados
- Ciclo de la request: middleware, guards, interceptors, pipes, handler, exception filters
- Interceptors (logging, transformar respuesta), serialización (`ClassSerializerInterceptor`), exception filters y `HttpException`
- Swagger/OpenAPI, versionado, paginación y filtros
- Subida de archivos: Multer (`FileInterceptor`), validación de tipo y tamaño, servir archivos estáticos
**Tecnologías:** `@nestjs/cli` 12, class-validator, `@nestjs/swagger`, Zod.
**Criterio de dominio:** API CRUD con al menos 2 módulos, DTOs validados (rechaza campos extra y convierte tipos), un pipe personalizado, un interceptor que envuelve la respuesta, un filtro que traduce un error de dominio a HTTP y Swagger funcionando. Dibuja y explica el orden middleware, guard, interceptor, pipe, handler.
**Certificación:** ninguna necesaria en esta fase.

## Fase 3: Providers personalizados, módulos globales y dinámicos (~12 h)
**Objetivo:** dominar la inyección de dependencias para que el código sea intercambiable y testeable.
**Conceptos**
- Tokens de inyección (clase, string, `Symbol`, clase abstracta como interfaz)
- Providers personalizados: `useClass`, `useValue`, `useFactory` (con `inject`, async), `useExisting`
- Scopes: `DEFAULT`, `REQUEST`, `TRANSIENT` y su costo
- Exportar providers vs `@Global()` (cuándo es mala idea)
- Módulos dinámicos: `forRoot`, `forRootAsync`, `register`, `ConfigurableModuleBuilder`
- Dependencias circulares (`forwardRef` y por qué evitarlas)
- Lifecycle hooks (`onModuleInit`, `onApplicationShutdown`), `ModuleRef`
**Tecnologías:** Nest DI nativo.
**Criterio de dominio:** un `MailModule` con una interfaz `MailSender` y dos implementaciones (consola y falsa) elegidas con `useFactory` según el entorno; un módulo global con `useValue`; un módulo dinámico propio con `forRootAsync`; un test que reemplaza el provider. Explica cuándo un `@Global()` perjudica.
**Certificación:** ninguna necesaria en esta fase.

## Fase 4: Configuración tipada, Docker y PostgreSQL con `pg` (~20 h)
**Objetivo:** conectar a una base real desde un módulo global configurado por variables de entorno.
**Conceptos**
- Configuración 12-factor, `.env` por entorno, `.env.example`, secretos que nunca se commitean
- `@nestjs/config`: `isGlobal`, `envFilePath`, `expandVariables`, `cache`
- Validación del entorno con Joi 18 (esquema, defaults, falla al arrancar) y alternativa con Standard Schema/Zod
- Config tipada: `registerAs` (namespaces) y `ConfigType`
- Docker: imagen, contenedor, volumen, red, puertos; `docker compose` con Postgres y healthcheck
- SQL esencial: DDL, DML, JOIN, índices, `EXPLAIN` básico
- `node-postgres` (`pg`): `Pool`, consultas parametrizadas (inyección SQL), transacciones manuales
- `DatabaseModule` global con `useFactory` + `ConfigService`; cerrar el pool en `onApplicationShutdown`
- Repositorio escrito a mano sobre `pg`
**Tecnologías:** `@nestjs/config`, Joi 18, Docker y Compose, PostgreSQL (versión estable actual), `pg`.
**Criterio de dominio:** `docker compose up` levanta Postgres; la app se niega a arrancar con un mensaje claro si falta `DB_PASSWORD`; un `DatabaseModule` global expone un `Pool` vía `useFactory`; un `UsersRepository` con `pg` hace CRUD con consultas parametrizadas y una transacción con rollback ante error. Demuestra que una consulta concatenada es vulnerable y la parametrizada no.
**Certificación:** ninguna necesaria en esta fase.

## Fase 5: TypeORM, patrón repository, migraciones y relaciones (~30 h)
**Objetivo:** modelar datos relacionales con tipado fuerte y esquema versionado.
**Conceptos**
- `TypeOrmModule.forRootAsync` con `ConfigService`; `DataSource` aparte para la CLI
- Entities (`@Entity`, columnas, enums, timestamps, soft delete), `forFeature` y `Repository`
- Patrón repository: repositorio de TypeORM vs repositorio de dominio propio; custom repository con DI; cuándo la capa extra vale la pena
- `QueryBuilder`, paginación (offset vs keyset), índices
- Relaciones: OneToOne, OneToMany/ManyToOne, ManyToMany (tabla implícita vs explícita), `cascade`, `onDelete`, carga eager vs explícita
- Problema N+1: cómo detectarlo (logging) y corregirlo
- Transacciones (`DataSource.transaction`, `QueryRunner`)
- Migraciones: `synchronize: false` en producción, `migration:generate/run/revert`, migraciones manuales y de datos, correrlas en CI
- Tipado: entity como tipo, `DeepPartial`, `FindOptionsWhere`, tipos de retorno de `QueryBuilder`; seeding
- Panorama de alternativas: Drizzle y Prisma (qué cambia, cuándo elegirlos)
**Tecnologías:** `@nestjs/typeorm`, TypeORM 1.x, PostgreSQL.
**Criterio de dominio:** modelo de 5 entidades con los tres tipos de relación; migración inicial generada y revisada; una migración manual de datos; un N+1 reproducido y corregido; una transacción que revierte; un repositorio de dominio que oculta TypeORM tras una interfaz, probado con un repositorio falso. Explica por qué `synchronize: true` no va en producción.
**Certificación:** ninguna necesaria en esta fase.

## Fase 6: MongoDB y Mongoose (~20 h)
**Objetivo:** usar documentos con tipado y saber cuándo elegir Mongo sobre SQL.
**Conceptos**
- Modelo documental vs relacional: embeber vs referenciar (los datos que se leen juntos viven juntos)
- MongoDB en Compose (con replica set si se quieren transacciones)
- `@nestjs/mongoose`: `forRootAsync`, `forFeature`, `@Schema`, `@Prop`, `SchemaFactory`
- Tipado: `HydratedDocument`, `InferSchemaType`, `lean()` y sus tipos, `Types.ObjectId`; filtros más estrictos en Mongoose 9
- Relaciones: `ref` + `populate`, virtual populate, subdocumentos, discriminators
- Validación, defaults, índices (únicos, TTL, texto), hooks con promesas (sin `next` en Mongoose 9)
- Aggregation pipeline (`$match`, `$lookup`, `$group`), paginación, transacciones con sesiones
- DTO vs schema; el mismo dominio modelado en Postgres y en Mongo; persistencia políglota
**Tecnologías:** `@nestjs/mongoose`, Mongoose 9.x, MongoDB.
**Criterio de dominio:** un módulo de "actividad" con schema tipado, relaciones por `ref` y `populate`, un subdocumento embebido, un índice TTL y una agregación que agrupa actividad por usuario; más un texto de 10 líneas que justifica qué datos van en Postgres y cuáles en Mongo.
**Certificación:** ninguna necesaria en esta fase.

## Fase 7: Autenticación y autorización (~18 h)
**Objetivo:** proteger la API con identidad verificada y permisos.
**Conceptos**
- Autenticación vs autorización; hashing de contraseñas (argon2 o bcrypt, salt, costo)
- JWT: estructura, firma, expiración; access + refresh, rotación y revocación; refresh tokens guardados con hash
- `@nestjs/jwt`, Passport (estrategias `local` y `jwt`) y guards
- Guard global con decorador `@Public()`, decoradores propios (`@CurrentUser`), roles con `Reflector` y metadata
- Autorización por recurso (propiedad), cookies httpOnly vs header Bearer, CORS y CSRF básicos
- OAuth2/OIDC: visión general (login con Google)
- Rate limiting (`@nestjs/throttler`), `helmet`, OWASP API Top 10 esencial
**Tecnologías:** `@nestjs/jwt`, `@nestjs/passport`, argon2, `@nestjs/throttler`, helmet.
**Criterio de dominio:** registro, login, refresh con rotación y logout; guard global con `@Public()`; roles `admin` y `user`; un usuario no puede editar un recurso ajeno (403), con test e2e. Explica qué pasa si roban un refresh token y cómo lo mitiga tu diseño.
**Certificación:** ninguna necesaria en esta fase.

## Fase 8: Tiempo real, colas y microservicios (~28 h)
**Objetivo:** comunicar clientes en vivo, repartir trabajo en segundo plano y separar servicios con criterio.
**Conceptos**
- WebSockets vs SSE vs polling; gateways (`@WebSocketGateway`, `@SubscribeMessage`), Socket.IO (rooms, namespaces, acknowledgements), adaptador Redis para escalar
- Autenticación en el handshake; guards, pipes y filtros en WebSockets; `@Sse`
- Caché con Redis (`@nestjs/cache-manager`)
- Colas con BullMQ: jobs, reintentos, concurrencia, procesadores; `@nestjs/schedule`; `@nestjs/event-emitter`
- Microservicios en Nest: transporters (TCP, Redis, NATS o RabbitMQ), `@MessagePattern` (petición-respuesta) vs `@EventPattern` (eventos), `ClientProxy`, aplicaciones híbridas, gRPC (visión general)
- Monolito modular primero: cuándo NO usar microservicios; monorepo de Nest vs repos separados
- Idempotencia, reintentos, consistencia eventual, patrón outbox (concepto)
**Tecnologías:** `@nestjs/websockets` + Socket.IO, Redis, BullMQ, NATS o RabbitMQ (uno), `@nestjs/microservices`.
**Criterio de dominio:** dos clientes en una misma sala ven en vivo los cambios del otro (con autenticación en el handshake); un job de BullMQ envía una notificación con reintentos; un microservicio de notificaciones separado, comunicado por un transporter con message y event pattern, corriendo en Compose. Demuestra qué pasa cuando el microservicio está caído y cómo lo maneja tu diseño.
**Certificación:** ninguna necesaria en esta fase.

## Fase 9: Calidad, observabilidad y despliegue (~22 h)
**Objetivo:** dejar el sistema probado, observable y desplegado.
**Conceptos**
- Pirámide de testing; unitarios con `Test.createTestingModule` y providers falsos; e2e con `supertest`; integración con base real efímera (Testcontainers)
- Jest (CJS) y Vitest (ESM): diferencias y cuándo cada uno; cobertura útil
- Logging estructurado (Logger de Nest, pino, correlation id)
- Observabilidad con `@nestjs/observe` (Nest 12): trazas, métricas y errores
- Health checks (`@nestjs/terminus`), apagado ordenado (`enableShutdownHooks`)
- Dockerfile multi-stage e imagen mínima; Compose de todo el sistema
- CI con GitHub Actions: lint, test, build, migraciones; despliegue en un host (Railway, Fly, Render o AWS: uno)
- Rendimiento: adaptador Fastify vs Express, caché, índices, paginación
- Migración Nest 11 a 12 y CJS a ESM (guía oficial)
- Revisión de código generado por IA: checklist de PR
- Monorepo con Nx (Angular + Nest): `nx init` sobre un repo existente, tareas inferidas, grafo de proyectos, caché local, `nx affected` en CI, `enforce-module-boundaries`, librería compartida (qué compartir y qué no: tipos e interfaces sí; clases con decoradores de class-validator no, porque arrastran código de servidor al bundle de Angular)
**Tecnologías:** Jest o Vitest, supertest, Testcontainers, pino, `@nestjs/terminus`, GitHub Actions, Docker, Nx 23.
**Criterio de dominio:** el repo funciona como workspace Nx con `apps/web`, `apps/api` y una librería compartida de modelos, y un cambio en la librería dispara solo las pruebas de los proyectos afectados (`nx affected`); suite con unitarios y e2e (con base real efímera) en CI verde; imagen Docker multi-stage de la API; endpoint `/health`; logs estructurados con correlation id; API desplegada con URL pública y migraciones corridas desde el pipeline; un checklist de revisión de PR aplicado a código generado por IA con 3 fallos reales encontrados.
**Certificación:** ninguna necesaria en esta fase.

---

## Ruta con Michilog (orden por hitos)
Si la práctica se hace con Michilog, las fases no se estudian de corrido: cada lección se ve justo antes del hito que la usa. Las fases siguen siendo el contenido; los hitos son el orden.

| Hito Michilog | Lecciones del roadmap que van antes | Extra que el plan de Michilog no traía |
|---|---|---|
| Antes del 3 | F1 reducida: event loop, HTTP y `node:http` (~3 h) | Solo si el diagnóstico muestra huecos |
| 3a (API y Postgres) | F2 núcleo (controllers, services, módulos, DTOs, pipes, Swagger) + F4 (Docker Compose con Postgres, `ConfigModule` con Joi, config tipada, `pg` desde un `DatabaseModule` global con `useFactory`) | Docker pasa del hito 12 al 3; `pg` y módulo global son nuevos |
| 3b (ORM) | F3 (`useClass`, `useValue`, `useFactory`, módulos dinámicos) + F5 (TypeORM, repository, relaciones, migraciones, transacciones) | Patrón repository, transacciones, N+1 |
| 4 (conectar front y back) | F2: exception filters e interceptors | Ninguno |
| Después del 4 (Nx) | Monorepo con Nx: `nx init` sobre el repo actual, `apps/web` y `apps/api`, librería compartida de modelos, grafo de proyectos, caché, `affected`, límites entre módulos (~6 a 8 h, estimado) | Tema nuevo. El plugin `@nx/nest` lista Nest 10 y 11, no 12: se usa Nx sin sus generadores de Nest |
| 5 (fotos) | Subida de archivos con Multer, validación de tipo y tamaño, servir estáticos | Tema nuevo en el roadmap |
| 6 (login) | F7 completa: hash, JWT con refresh, guards, roles, rate limiting, helmet | Refresh con rotación |
| 7 (tendencias y alertas) | F8 parcial: eventos internos, `@nestjs/schedule`, caché | Ninguno |
| 8 (tiempo real) | F8 parcial: gateways de WebSockets, autenticación en el handshake | Ninguno |
| 9 (informe PDF) | F8 parcial: BullMQ y Redis | Ninguno |
| 10 (testing) | F9: unitarios, e2e, base efímera | Testcontainers |
| 12 (despliegue) | F9: Dockerfile multi-stage, CI, health, logs | Ninguno |
| Fase IoT | F6 MongoDB y Mongoose (lecturas de sensores) y F8 microservicios (MQTT) | Ambos quedan fuera del plan hasta aquí |

Lo que no pasa por Michilog (Mongo, microservicios, Node puro) se cierra como práctica corta. El diagnóstico final del tutor revisa los criterios de dominio de las 9 fases y marca los que Michilog no llegó a demostrar.

## Certificaciones
No hay certificación de NestJS o Node con peso real en contrataciones. La señal que cuenta es el proyecto transversal desplegado, con pruebas y CI. Si más adelante se quiere una credencial, tiene más sentido una de nube (AWS) que una de framework.

## Proyecto transversal (capstone evolutivo)
Si se practica con Michilog, ese es el proyecto transversal y el que sigue abajo pasa a ser un segundo proyecto posterior, como prueba de que lo aprendido se transfiere.

**API de tableros colaborativos (estilo BoardOps)**, un solo proyecto que crece fase a fase:
- F1: servidor `node:http` con tableros en memoria.
- F2: API Nest de boards, listas y tarjetas con DTOs, pipes y Swagger.
- F3: `NotificationSender` intercambiable por entorno y un módulo global de utilidades.
- F4: configuración tipada con Joi, Docker Compose y tabla de usuarios con `pg`.
- F5: migración de todo el modelo relacional a TypeORM, con relaciones y migraciones.
- F6: feed de actividad y comentarios en MongoDB.
- F7: registro, login JWT con refresh y roles de miembro por tablero.
- F8: tablero en vivo con Socket.IO, notificaciones por BullMQ y un microservicio.
- F9: pruebas, CI, Docker y despliegue.

El resultado final demuestra un backend completo: dos bases de datos con criterio, seguridad, tiempo real, servicios separados y un pipeline que lo despliega.

## Estimación de tiempo según ritmo (190 h)
| Ritmo | Duración total aprox. |
|---|---|
| 3.5 h/semana (solo sesiones de 30 min/día) | ~12.5 meses |
| 6 h/semana (sesiones diarias + 1 bloque de práctica) | ~7 meses |
| 10 h/semana | ~4.5 meses |
| 21 h/semana (intensivo, 3 h/día todos los días) | ~9 semanas (~2 meses) |
| 35 h/semana (intensivo fuerte, 5 h/día entre semana) | ~5.5 semanas |
| 40 h/semana (dedicación completa) | ~5 semanas |

Las sesiones de 30 min sirven para teoría; los criterios de dominio exigen bloques de práctica de 1 a 2 h. El roadmap está pensado desde cero: quien ya domina JavaScript y la inyección de dependencias (por ejemplo, desde Angular) puede recortar entre 25 y 35 h entre las fases 1 a 3, según lo que arroje el diagnóstico.

## Señales del mercado
- Backend sigue siendo la categoría de contratación más grande por volumen en 2026, pero los puestos "junior" suelen pedir experiencia: el portafolio con proyecto desplegado pesa más que la lista de herramientas.
- La IA subió el listón del trabajo backend en lugar de eliminarlo: lo repetitivo se automatiza y se valora el criterio para revisar.
- TypeORM pierde terreno en proyectos nuevos frente a Drizzle y Prisma, pero sigue siendo muy común en equipos NestJS empresariales con código existente; por eso se estudia y se compara.
- Nube y SQL aparecen en la mayoría de las ofertas backend, de ahí el peso de Docker, Postgres y despliegue en este roadmap.

## Fuentes principales
- InfoQ, NestJS 12 (ESM, Standard Schema, observabilidad nativa): https://infoq.com/news/2026/10/nestjs-12-observability
- Notas de la versión 12.0.0 de NestJS: https://newreleases.io/project/github/nestjs/nest/release/v12.0.0
- Guía de migración 11 a 12: https://docs.nestjs.com/migration-guide
- `@nestjs/config` 12 (Standard Schema, Joi 18+): https://newreleases.io/project/github/nestjs/config/release/12.0.0
- Node.js, nuevo calendario de lanzamientos y estado de LTS: https://nodejs.org/en/blog/announcements/evolving-the-nodejs-release-schedule
- Mongoose, soporte de versiones y migración a 9.x: https://mongoosejs.com/docs/version-support.html y https://mongoosejs.com/docs/migrating_to_9.html
- Comparación Prisma, Drizzle y TypeORM (oct 2026): https://tech-insider.org/prisma-vs-drizzle-vs-typeorm-2026/
- Mercado backend (160.000 ofertas analizadas): https://www.seekerscore.com/insights/backend-engineer-market-2026
- Roadmap backend 2026 (Scrimba): https://scrimba.com/articles/how-to-become-a-backend-developer-in-2026-complete-roadmap/
- Habilidades backend más pedidas (Nucamp): https://www.nucamp.co/blog/most-in-demand-backend-skills-in-2026-apis-databases-cloud-observability-security
