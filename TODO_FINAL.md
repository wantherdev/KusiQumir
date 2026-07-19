# TODO FINAL — Producción KusiQ'umir

## 🔴 CRÍTICO (impedimento para producción)

### Backend
- [ ] **BC-1** `auth.service.ts:22,34,51` — `prisma.user.findUnique` sin `select` devuelve **password hash** a memoria. Agregar `select: { id: true, email: true, role: true }`.
- [ ] **BC-2** `articles.controller.ts:70,97` + `experiences.controller.ts:75,102` — `body as any` castea los DTOs validados a `any`, perdiendo type safety.
- [ ] **BC-3** `main.ts:41-45` — `CORS_ORIGIN.split(",")` sin trim ni validación URL. Agregar `.map(s => s.trim())` y filtrar URLs inválidas.
- [ ] **BC-4** `Dockerfile:22` — `CMD npx prisma migrate deploy && node dist/main.js` usa **shell form**. El proceso Node no recibe señales (SIGTERM). Usar `exec node dist/main.js` o entrypoint.
- [ ] **BC-5** `auth.controller.ts:96` — `res.clearCookie("access_token", { path: "/" })` falta `sameSite` y `secure`. En producción, cookie `secure` no se limpia.

### Frontend
- [ ] **FC-1** 4 páginas legales (`terminos.ts:85`, `politica-privacidad.ts:56`, `contrato.ts:74`, `cancelaciones.ts:49`) usan `bypassSecurityTrustHtml`. Reemplazar con `sanitizer.sanitize(SecurityContext.HTML, ...)` como el resto del proyecto.
- [ ] **FC-2** TODOS los templates: `<i class="ri-*"></i>` decorativos sin `aria-hidden="true"`. Screen readers anuncian "arrow up line", "menu line", etc. Agregar `aria-hidden="true"` a todos.
- [ ] **FC-3** `destinos.ts:96` + `mis-reservas.ts:57` — `item: any` en `trackByFn`. Tipar como `Tour` y `Booking` respectivamente.
- [ ] **FC-4** 5 `catch {}` sin parámetro de error: `footer.ts:28`, `destino-redirect.ts:48`, `reservar.ts:63,102`, `libro-reclamaciones.ts:132`.

### Infra
- [ ] **IC-1** `docker-compose.prod.yml:21` — Healthcheck de nginx **roto**: `CMD` exec form hace que `|| exit 1` sea parte de la URL. Cambiar a `CMD-SHELL`.
- [ ] **IC-2** `docker-compose.prod.yml` — `healthcheck.html` **no está montado** en el contenedor nginx. Agregar `- ./nginx/healthcheck.html:/usr/share/nginx/html/healthcheck.html:ro` a volumes.
- [ ] **IC-3** `docker-compose.yml` — **`CSRF_SECRET` nunca se pasa al backend**. Agregar `CSRF_SECRET: ${CSRF_SECRET}` al environment del backend.
- [ ] **IC-4** `.github/workflows/ci.yml:158-161` — Deploy no especifica `-f docker-compose.yml -f docker-compose.prod.yml`. Sin los flags correctos, nginx y SSL no se aplican.
- [ ] **IC-5** `.github/workflows/ci.yml:158-161` — Deploy **bypassea** `scripts/deploy.sh` completamente: sin validación pre-flight, sin rollback, sin healthcheck post-deploy.
- [ ] **IC-6** `nginx/nginx.conf:115-121` — Bloque `/docs` falta `proxy_set_header X-Forwarded-Proto $scheme;` y `proxy_http_version 1.1;`.
- [ ] **IC-7** `docker-compose.prod.yml` / `nginx/Dockerfile` — **Sin renovación automática de certbot**. Los certificados expiran a los ~90 días.

---

## 🟠 ALTO (debe hacerse antes o justo después del deploy)

### Backend
- [ ] **BH-1** **`@ApiProperty()` faltante en TODOS los DTOs** (20+ clases). Swagger no muestra schemas de request/response.
- [ ] **BH-2** `bookings.service.ts:95` + `packages.service.ts:69` — `const data: any = {}` bypasses type safety.
- [ ] **BH-3** `auth.module.ts:21` — `as any` en `expiresIn`.
- [ ] **BH-4** `jwt.strategy.ts:20` — `payload: any` en `validate()`.
- [ ] **BH-5** `metrics.interceptor.ts:11` — `Observable<any>` return.
- [ ] **BH-6** `env.validation.ts` — Falta validación para `JWT_EXPIRES_IN`, `JWT_COOKIE_MAX_AGE`.
- [ ] **BH-7** `auth/auth.controller.ts:49-53` — `GET /auth/health` es redundante con `GET /health`. Considerar remover.
- [ ] **BH-8** `csrf.guard.ts` — Archivo completo **dead code** (nunca importado). Remover.
- [ ] **BH-9** 30+ queries Prisma sin `select` (customers, guides, providers, operations, billing, payments, articles, experiences, packages, notifications, legal). Performance + data leakage.

### Frontend
- [ ] **FH-1** 5 imágenes sin `width`/`height`: navbar logo, footer logo, tour-detail, experience-detail inline, article inline.
- [ ] **FH-2** 2 hero images sin `loading="lazy"`: `experience-detail.ts:36`, `article.ts:36`.
- [ ] **FH-3** `travel-api.service.ts:1` — `HttpHeaders` importado pero no usado. Remover.
- [ ] **FH-4** WhatsApp number hardcodeado en 7 lugares (navbar, home, tour-detail, contacto). Mover a environment.
- [ ] **FH-5** Redes sociales hardcodeadas en footer. Mover a environment.
- [ ] **FH-6** `blog.ts` — `isLoading` siempre `false`, nunca muestra skeleton.

### Infra
- [ ] **IH-1** `.env.example:20` — `API_URL` documentado pero hardcodeado en `docker-compose.yml:65`. No tiene efecto. Remover del ejemplo o hacerlo efectivo.
- [ ] **IH-2** `promtail-config.yml:17-21` — Falta `drop_malformed: true` en stage `json`. Logs no-JSON (nginx text) se pierden en silencio.
- [ ] **IH-3** `promtail-config.yml:13-14` — Sin filtro de contenedores. Descubre TODOS los contenedores del host.
- [ ] **IH-4** `scripts/deploy.sh:108` — Post-deploy healthcheck no verifica nginx ni postgres.
- [ ] **IH-5** `scripts/deploy.sh:85-88` — Rollback IDs en `/tmp` (efímero). Usar archivo persistente.
- [ ] **IH-6** `.github/workflows/ci.yml` — Nginx no se construye en CI (solo en servidor al deploy).
- [ ] **IH-7** `.github/workflows/ci.yml` — Falta `lint` en ambos jobs.
- [ ] **IH-8** `.github/workflows/ci.yml:160` — `docker compose pull` trae `:latest`, no `:${{ github.sha }}`. Race condition entre builds.

---

## 🟡 MEDIO (post-deploy)

- [ ] **BM-1** `env.validation.ts` — Agregar `Joi.string().uri()` a `CORS_ORIGIN`.
- [ ] **BM-2** `customers.service.ts` — `"PE"` hardcodeado como nacionalidad default.
- [ ] **BM-3** `analytics.service.ts` — `0.12` (12%) hardcodeado como comisión.
- [ ] **BM-4** `prisma/prisma.service.ts` — `3` retries y `1000`ms hardcodeados.
- [ ] **BM-5** `csrf/csrf.middleware.ts:7` — Lista de paths para saltar CSRF hardcodeada.
- [ ] **BM-6** `notifications.controller.ts` — `POST /notifications/send` solo persiste en DB, nunca envía realmente.
- [ ] **BM-7** `tour-detail.ts` + `experience-detail.ts` — Falta `og:image` específico de cada página.
- [ ] **BM-8** `terminos.ts`, `politica-privacidad.ts`, `contrato.ts`, `cancelaciones.ts` — Contenido legal hardcodeado en TS. Mover a archivos markdown.
- [ ] **BM-9** i18n — App 100% en español sin `@angular/localize`.
- [ ] **BM-10** PWA — Service Worker no registrado. `site.webmanifest` existe pero no es funcional.

---

## 🟢 BAJO (nice to have)

- [ ] **BL-1** `angular.json` — Presupuesto de bundle: `main.js` 297KB (warning en 1MB, ok pero monitorear).
- [ ] **BL-2** `nginx/nginx.conf` — `'unsafe-inline'` en CSP. Idealmente usar nonces o hashes.
- [ ] **BL-3** `src/server.ts:69` — `console.log` de startup.
- [ ] **BL-4** `auth.interceptor.ts:19` — `console.error` en producción.
- [ ] **BL-5** `destino-redirect.ts:49` — `console.error` en catch.
- [ ] **BL-6** `main.ts:19` — `console.error` en bootstrap catch.
- [ ] **BL-7** `deploy.sh` — Notificación Slack/Telegram de deploy exitoso/fallido.
- [ ] **BL-8** `deploy.sh` — Agregar `--dry-run` mode.

---

## 🔵 BLOQUEADO (requiere acción externa)

- [ ] **BLK-1** TLS/certbot — Requiere dominio `kusiqumir.com` apuntando al servidor.
- [ ] **BLK-2** CloudFront invalidation — Requiere `CLOUDFRONT_DISTRIBUTION_ID` y AWS CLI.
- [ ] **BLK-3** Sentry DSN — Requiere cuenta en Sentry.
- [ ] **BLK-4** WhatsApp API — Requiere número verificado en Twilio/WhatsApp Business API.
