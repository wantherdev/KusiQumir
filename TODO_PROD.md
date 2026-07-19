# TODO Producción — KusiQ'umir

## 🔴 CRÍTICO (impedimento para producción)

- [ ] **CRIT-1** `nginx/nginx.conf` — Agregar `Content-Security-Policy` header (CSP). White-listear CDN Remixicon, Google Fonts, Unsplash, WhatsApp.
- [ ] **CRIT-2** `docker-compose.yml` — Remover `ports: "3000:3000"` y `"4000:4000"` del bloque `backend`/`frontend` en producción. Solo nginx debe exponer puertos. Usar override o perfil.
- [ ] **CRIT-3** `Frontend/Dockerfile` — Agregar `USER node` en runner stage (corre como root actualmente).
- [ ] **CRIT-4** `docker-compose.monitoring.yml` — Montar `/var/run/docker.sock:/var/run/docker.sock:ro` en promtail (sin esto no descubre contenedores).
- [ ] **CRIT-5** `backend/src/modules/guides/guides.controller.ts:29-33` — Agregar `@Roles("ADMIN")` a `findAll()` y `findOne()`. Cualquier usuario autenticado puede ver guías.
- [ ] **CRIT-6** `backend/src/modules/providers/providers.controller.ts:29-43` — Idem, agregar `@Roles("ADMIN")`.
- [ ] **CRIT-7** `backend/src/modules/notifications/whatsapp.service.ts:24` — Remover hardcoded default `"51999000000"`; fallar si `WHATSAPP_PHONE` no está definido.

## 🟠 ALTO (debe hacerse antes o justo después del deploy)

### Backend
- [ ] **HIGH-1** Agregar DTOs con `class-validator` para query params en:
  - `bookings.controller.ts:62` (`findAllAdmin(@Query() query: Record<string, string>)`)
  - `tours.controller.ts:60` (`findAll(@Query() query: Record<string, string>)`)
  - `articles.controller.ts:47` (`findAll(@Query() query: Record<string, string>)`)
  - `experiences.controller.ts:51` (`findAll(@Query() query: Record<string, string>)`)
- [ ] **HIGH-2** `bookings.service.ts:95` / `packages.service.ts:68` — Reemplazar `const data: any = {}` con tipos Prisma concretos.
- [ ] **HIGH-3** Agregar `@ApiProperty()` decorators a **todos los DTOs** (Swagger docs están vacíos).
- [ ] **HIGH-4** `common/metrics.interceptor.ts` — Reemplazar `console.log`/`console.warn` con `Logger` de NestJS.
- [ ] **HIGH-5** `main.ts:31` — Configurar helmet con CSP personalizado, HSTS, `permissions-policy`, `referrer-policy` explícitos.
- [ ] **HIGH-6** `auth/auth.module.ts:21` — Hacer `expiresIn` configurable vía env var.
- [ ] **HIGH-7** `common/http-exception.filter.ts:53-55` — Asegurar que `stack` nunca se devuelve en producción (verificar `NODE_ENV`).

### Frontend
- [ ] **HIGH-8** `src/index.html` — Agregar sitemap.xml y robots.txt (crear archivos en `public/`).
- [ ] **HIGH-9** Agregar JSON-LD structured data (LocalBusiness, TravelAgency, BreadcrumbList) en `index.html`.
- [ ] **HIGH-10** Agregar `width`/`height` a todas las imágenes sin excepción (CLS fix). Prioridad: home, destinos, paquetes, experiencias, blog.
- [ ] **HIGH-11** `navbar.html:41-53` — Fix dropdown hover-only: agregar `:focus-within` o JS toggle para accesibilidad por teclado.
- [ ] **HIGH-12** `destino-redirect.ts:48-49` — Rellenar el catch block vacío con manejo de error real.
- [ ] **HIGH-13** `mis-reservas.ts:50-54` — Resetear `showConfirm = false` después de cancelación exitosa.
- [ ] **HIGH-14** `reservar.html` — Agregar validación a campos phone, startDate, customerName, customerEmail.

### Infra
- [ ] **HIGH-15** `docker-compose.prod.yml` — Agregar `condition: service_healthy` en `depends_on` de nginx→backend y nginx→frontend.
- [ ] **HIGH-16** `docker-compose.yml:35-36` — Agregar `condition: service_healthy` en pgbackup→postgres.
- [ ] **HIGH-17** `scripts/deploy.sh` — Implementar rollback mechanism (snapshot de containers previos, redeploy si healthcheck falla).
- [ ] **HIGH-18** `scripts/deploy.sh:21-24` — Fallar si `.env` no existe. Validar `CORS_ORIGIN`, `WHATSAPP_PHONE`.
- [ ] **HIGH-19** `scripts/deploy.sh` — Agregar HTTP healthcheck contra `/api/v1/health` post-deploy.
- [ ] **HIGH-20** `.github/workflows/ci.yml` — Agregar stage de deploy (SSH + docker compose pull & up) o trigger a un webhook.
- [ ] **HIGH-21** `.github/workflows/ci.yml` — Agregar `pnpm audit` + lint + typecheck.
- [ ] **HIGH-22** `docker-compose.monitoring.yml` — Agregar `restart: unless-stopped` a todos los servicios. Agregar healthchecks.
- [ ] **HIGH-23** `docker-compose.prod.yml` — Implementar renovación automática de certbot (cron job o sidecar container).
- [ ] **HIGH-24** `docker-compose.prod.yml` — Mover monitoreo a network separada (no compartir con app network).
- [ ] **HIGH-25** `nginx/nginx.conf:116-119` — Agregar `limit_req zone=api` y proxy headers a `/api/v1/docs`.
- [ ] **HIGH-26** `.env.example` — Unificar `NEXT_PUBLIC_API_URL` / `API_URL`. Agregar `POSTGRES_USER`, `PGPASSWORD`, `RETENTION_DAYS`. Pasar `CSRF_SECRET` a docker-compose.

## 🟡 MEDIO (semanas posteriores al deploy)

### Backend
- [ ] **MED-1**  `prisma/prisma.service.ts:28` — Wrap raw Prisma errors en excepción genérica.
- [ ] **MED-2**  `bookings.controller.ts` — Tipar `@Request() req: any` con interfaz `AuthenticatedRequest`.
- [ ] **MED-3**  `auth/auth.controller.ts:88` — Reemplazar `(req as any).user` con tipo.
- [ ] **MED-4**  `main.ts:49` — Remover non-null assertions; validar con Joi antes de usar.
- [ ] **MED-5**  `modules/csrf/csrf.service.ts:22` — Analizar impacto de `httpOnly: false` (XSS leak). Considerar doble cookie pattern.
- [ ] **MED-6**  Agregar `select` en `findMany()` de servicios que over-fetchean (guides, providers, operations, payments, billing, legal).
- [ ] **MED-7**  `auth/auth.controller.ts:39,47,91` — Agregar `@Throttle()` personalizado a endpoints públicos (login, register).

### Frontend
- [ ] **MED-8**  Agregar `robots.txt` en `public/`.
- [ ] **MED-9**  Agregar `sitemap.xml` dinámico (o estático con rutas principales).
- [ ] **MED-10** `app.config.ts:30,48` — Mover console.warn a entorno de desarrollo solamente.
- [ ] **MED-11** `travel-api.service.ts` — Tipar returns de `sendContact()`, `sendClaim()`, `getMyProfile()`, `updateMyProfile()`.
- [ ] **MED-12** Agregar `aria-expanded` al toggle de menú móvil en navbar.
- [ ] **MED-13** Agregar "skip to main content" link al inicio de `index.html`.
- [ ] **MED-14** Agregar `loading="lazy"` a imágenes que falten (tour-detail.html:39).
- [ ] **MED-15** Agregar tags `og:image` y `twitter:image` a layouts compartidos.
- [ ] **MED-16** Agregar `canonical` tag al head de cada ruta.
- [ ] **MED-17** Registrar Service Worker (`@angular/pwa`) o al menos offline page.
- [ ] **MED-18** `home.ts:50` y 7 dashboards — Tipar `item` en `trackByFn` con tipos concretos.
- [ ] **MED-19** `contacto.ts:156` — Tipar `form: any` como `NgForm`.

### Infra
- [ ] **MED-20** `docker-compose.monitoring.yml` — Agregar `depends_on` entre promtail→loki y grafana→loki.
- [ ] **MED-21** `scripts/deploy.sh` — Usar `set -a; source .env; set +a` en vez de `grep | xargs`.
- [ ] **MED-22** `nginx/nginx.conf` — Agregar `proxy_connect_timeout`, `proxy_read_timeout`, `proxy_send_timeout`.
- [ ] **MED-23** `nginx/nginx.conf` — Agregar `Permissions-Policy` header.
- [ ] **MED-24** `.github/workflows/ci.yml` — Usar GitHub Secrets en vez de hardcoded test secrets.
- [ ] **MED-25** `.github/workflows/ci.yml` — Agregar Docker layer caching (cache-from/cache-to).
- [ ] **MED-26** `promtail-config.yml` — Agregar `pipeline_stages` para parseo de logs estructurados.
- [ ] **MED-27** `docker-compose.prod.yml` — Agregar healthcheck a nginx.

## 🟢 BAJO (nice to have / tech debt)

- [ ] **LOW-1**  `destinos.ts` — `isLoading` se inicializa en `false` pero con resolver es sincrónico. Considerar remover.
- [ ] **LOW-2** `experiencias.ts:87` — Mismo problema, loading spinner nunca se muestra.
- [ ] **LOW-3** `blog.ts:37` — Idem.
- [ ] **LOW-4**  Todos los console.log en producción (auth.interceptor.ts, main.ts, server.ts) — mover a Logger.
- [ ] **LOW-5**  `nginx/nginx.conf` — Agregar rate limiting a `/` (root/frontend).
- [ ] **LOW-6**  `health.controller.ts:7` — Remover `@SkipThrottle()` o limitar a IP interna.
- [ ] **LOW-7**  `reservar/reservar.ts:72-77` — Reemplazar `(this.item as Tour)` con type narrowing real.
- [ ] **LOW-8**  Agregar etiquetas `og:type` correctas en páginas de tours y experiencias.
- [ ] **LOW-9**  `auth/auth.controller.ts:74` — Mover `maxAge` de cookie a config/env.
- [ ] **LOW-10** Instalar y configurar i18n (`@angular/localize`).
- [ ] **LOW-11** Todo el contenido legal hardcoded — mover a archivos markdown o CMS.
- [ ] **LOW-12** `destinos.html:28` — Convertir `*ngFor="let _ of [].constructor(6)"` a `@for` loop real.
- [ ] **LOW-13** `scripts/deploy.sh:50` — Agregar notificación (Slack/Telegram) de deploy exitoso/fallido.

## 🔵 BLOQUEADO (requiere acción externa)
- [ ] **BLK-1** TLS/certbot — Requiere dominio `kusiqumir.com` apuntando al servidor.
- [ ] **BLK-2** CloudFront invalidation — Requiere `CLOUDFRONT_DISTRIBUTION_ID` y AWS CLI configurado.
- [ ] **BLK-3** Sentry DSN — Requiere cuenta en Sentry y DSN real.
- [ ] **BLK-4** WhatsApp API — Requiere número real verificado en Twilio/WhatsApp Business API.
