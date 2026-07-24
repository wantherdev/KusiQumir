# Plan de Producción — Kusi Q'umir

## Estado actual

| Métrica | Resultado |
|---------|-----------|
| Build frontend | ✅ Angular 22 — compila sin errores |
| Build backend | ✅ NestJS — compila sin errores |
| Tests frontend | ✅ 6/6 pasan |
| Tests backend | ✅ 25/25 pasan |
| Lint frontend | ✅ 0 errores (47 warnings `no-explicit-any`) |
| Lint backend | ✅ 0 errores (40 warnings) |
| Prisma generate | ✅ Genera sin errores |
| SSR | ✅ server.ts presente, proxy de API |
| PWA | ✅ Service worker con cache |
| robots.txt / sitemap.xml | ✅ Existen |
| Docker | ✅ Multi-stage builds (backend, frontend, nginx) |
| Docker Compose | ✅ dev + prod + staging + monitoring |
| CI/CD | ✅ GitHub Actions (test → docker → deploy) |
| Deploy script | ✅ Con validaciones, rollback, Slack |
| Nginx | ✅ SSL, HSTS, CSP, rate limiting, cache |
| SSL | ✅ Certbot auto-renewal |
| CDN | ✅ CloudFront config |
| Monitoreo | ✅ Sentry + Grafana/Loki/Promtail |
| Auth | ✅ JWT httpOnly + CSRF + guards globales |
| Seguridad | ✅ Helmet, rate limiting, validación DTOs |
| Migraciones | ⚠️ Parcial (faltan Contact, Claim, recommendedFor) |
| Sentry DSN | ❌ Vacío en ambos entornos |
| Pagos reales | ❌ Solo persiste en BD, sin procesador |
| Notificaciones reales | ❌ Solo stub (console.log) |

**Veredicto: NO está listo para producción.** Sin pagos reales ni notificaciones al cliente, la agencia no puede operar.

---

## Fase 0: Correcciones inmediatas (~1 h)

| # | Tarea | Archivos | Esfuerzo | Prioridad |
|---|-------|----------|----------|-----------|
| 0.1 | Generar migración Prisma limpia desde cero que incluya todos los modelos (Contact, Claim, recommendedFor) | `backend/prisma/schema.prisma`, migrations/ | ~15 min | 🔴 Alta |
| 0.2 | Configurar `SENTRY_DSN` real en `environment.prod.ts` y `.env` | `Frontend/src/environments/environment.prod.ts`, `backend/.env` | ~10 min | 🔴 Alta |
| 0.3 | Verificar SSR prerenderiza rutas dinámicas (tours, artículos) | `Frontend/angular.json`, `Frontend/src/app/app.routes.ts` | ~30 min | 🟠 Media |

### 0.1 — Regenerar migración Prisma

```bash
cd backend
# 1. Resetea BD local (destructivo, solo si no hay datos reales)
pnpm prisma migrate reset --force

# 2. Genera migración limpia desde cero
pnpm prisma migrate dev --name init

# 3. Seed
pnpm prisma db seed

# 4. Verifica que todas las tablas existen
pnpm prisma studio
```

**Riesgo**: `prisma migrate reset --force` borra todos los datos. Alternativa segura: crear una migración manual que agregue solo las tablas faltantes:

```prisma
-- Migración manual para agregar Contact, Claim y recommendedFor
CREATE TABLE "Contact" (...);
CREATE TABLE "Claim" (...);
ALTER TABLE "Tour" ADD COLUMN "recommendedFor" TEXT[] DEFAULT '{}';
```

### 0.2 — Configurar Sentry

```env
# backend/.env
SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@oXXXXX.ingest.us.sentry.io/XXXXX
```

```typescript
// Frontend/src/environments/environment.prod.ts
sentryDsn: 'https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@oXXXXX.ingest.us.sentry.io/XXXXX',
```

---

## Fase 1: Pagos — Integrar procesador real (~10 h)

**Critical path**: Sin pagos el sitio no puede vender.

| # | Tarea | Archivos | Esfuerzo |
|---|-------|----------|----------|
| 1.1 | Instalar SDK (`culqi-node` o `stripe`) | `backend/package.json` | ~5 min |
| 1.2 | Crear `payments-gateway.service.ts` — lógica de creación de cargo, confirmación, reembolso | `backend/src/modules/payments/payments-gateway.service.ts` (nuevo) | ~4 h |
| 1.3 | Modificar `payments.service.ts` para llamar al gateway real | `backend/src/modules/payments/payments.service.ts` | ~1 h |
| 1.4 | Crear webhook handler para eventos del procesador (pago exitoso, fallido, reembolso) | `backend/src/modules/payments/payments-webhook.controller.ts` (nuevo) | ~2 h |
| 1.5 | Agregar variables de entorno del procesador | `backend/.env.example`, `backend/src/common/env.validation.ts` | ~15 min |
| 1.6 | Pasar nuevas variables en docker-compose | `docker-compose.yml` | ~10 min |
| 1.7 | Probar flujo completo: booking → payment → webhook confirma → booking CONFIRMADA | Tests E2E | ~2 h |

### 1.2 — payments-gateway.service.ts (esqueleto recomendado)

```typescript
@Injectable()
export class PaymentsGatewayService {
  constructor(private readonly config: ConfigService) {}

  async createCharge(booking: Booking, amount: number, currency: string): Promise<ChargeResult> {
    const gateway = this.config.get<string>('PAYMENT_GATEWAY');
    if (gateway === 'culqi') return this.culqiCharge(booking, amount, currency);
    if (gateway === 'stripe') return this.stripeCharge(booking, amount, currency);
    throw new BadRequestException('Payment gateway not configured');
  }

  async confirmCharge(paymentIntentId: string): Promise<ChargeResult> {
    // ... llama al SDK correspondiente
  }

  async refund(chargeId: string): Promise<void> {
    // ... llama al SDK correspondiente
  }
}
```

### Recomendación: Stripe > Culqi para MVP

| Criterio | Stripe | Culqi |
|----------|--------|-------|
| Documentación | ★★★★★ | ★★★☆☆ |
| SDK NestJS | ★★★★★ (nestjs/stripe) | ★★☆☆☆ (sin wrapper oficial) |
| Tarjeta internacional | ✅ | ✅ |
| Comisión | 2.9% + $0.30 | 3.99% + S/0.50 |
| Settlement | 2-7 días | 1-14 días |
| Integración | Webhooks + Checkout + Elements | Webhooks + JS |

---

## Fase 2: Notificaciones — Email real (~8 h)

**Critical path**: Sin notificaciones el cliente no recibe confirmación.

| # | Tarea | Archivos | Esfuerzo |
|---|-------|----------|----------|
| 2.1 | Instalar `nodemailer` + tipos | `backend/package.json` | ~5 min |
| 2.2 | Crear `email.service.ts` — configuración SMTP, templates | `backend/src/modules/notifications/email.service.ts` (nuevo) | ~3 h |
| 2.3 | Reemplazar stub `case "email"` en `notifications.service.ts` | `backend/src/modules/notifications/notifications.service.ts` | ~1 h |
| 2.4 | Disparar notificación automática al crear booking | `backend/src/modules/bookings/bookings.service.ts` | ~1 h |
| 2.5 | Templates HTML de email (confirmación, recordatorio, cancelación) | `backend/src/modules/notifications/templates/` (nuevo directorio) | ~2 h |
| 2.6 | Agregar variables SMTP a `.env.example` y `env.validation.ts` | `backend/.env.example`, `backend/src/common/env.validation.ts` | ~15 min |
| 2.7 | (Opcional) Implementar WhatsApp API real | `backend/src/modules/notifications/whatsapp-api.service.ts` (nuevo) | ~4 h extra |

### 2.2 — email.service.ts (esqueleto)

```typescript
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.config.get<number>('SMTP_PORT', 587),
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendBookingConfirmation(booking: Booking, tour: Tour): Promise<void> {
    const html = this.renderTemplate('booking-confirmation', { booking, tour });
    await this.transporter.sendMail({
      from: `"Kusi Q'umir" <${this.config.get<string>('SMTP_FROM')}>`,
      to: booking.customerEmail,
      subject: `Reserva confirmada: ${tour.title}`,
      html,
    });
  }
}
```

### Variables de entorno necesarias

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=notificaciones@kusiqumir.com
SMTP_PASS=app-password-16-chars
SMTP_FROM=notificaciones@kusiqumir.com
```

---

## Fase 3: Booking público — Flujo completo (~4 h)

Objetivo: Un visitante sin login puede seleccionar tour → llenar datos → crear reserva → pagar → recibir email.

| # | Tarea | Archivos | Esfuerzo |
|---|-------|----------|----------|
| 3.1 | Hacer `POST /bookings` público (quitar JWT guard) | `backend/src/modules/bookings/bookings.controller.ts` | ~30 min |
| 3.2 | Modificar `bookings.service.create()` para crear/actualizar Customer automáticamente | `backend/src/modules/bookings/bookings.service.ts` | ~1 h |
| 3.3 | Asegurar que frontend `reservar.ts` envía datos de contacto en el body | `Frontend/src/app/pages/reservar/reservar.ts` | ~1 h |
| 3.4 | Disparar notificación email al cliente tras crear booking | `backend/src/modules/bookings/bookings.service.ts` | ~30 min |
| 3.5 | Página de confirmación en frontend: "Reserva creada. Te enviamos un email" | `Frontend/src/app/pages/reservar/` | ~1 h |

---

## Fase 4: Seguridad y hardening (~6 h)

| # | Tarea | Archivos | Esfuerzo |
|---|-------|----------|----------|
| 4.1 | Validar que CSRF middleware usa `req.path` correctamente con nginx proxy | `backend/src/modules/csrf/csrf.middleware.ts` | ~30 min |
| 4.2 | Agregar verificación de email en registro (enviar link de confirmación) | `backend/src/modules/auth/auth.service.ts` | ~2 h |
| 4.3 | Rate limiting granular: auth 5/min, API 30/min, uploads 10/min | `backend/src/app.module.ts` + `nginx/nginx.conf` | ~1 h |
| 4.4 | Revisar CORS en producción solo para dominios reales | `docker-compose.prod.yml` | ~15 min |
| 4.5 | Refactorizar ~40 warnings `no-explicit-any` en backend | Múltiples archivos `backend/src/` | ~2 h |

---

## Fase 5: Infraestructura y deploy (~7 h)

| # | Tarea | Archivos | Esfuerzo |
|---|-------|----------|----------|
| 5.1 | Crear `.env.production` con valores reales | `backend/.env.production` (nuevo) | ~30 min |
| 5.2 | Probar deploy en servidor staging (VPS/Droplet) | Servidor externo | ~3 h |
| 5.3 | Verificar SSL con Let's Encrypt | `docker-compose.prod.yml`, nginx | ~1 h |
| 5.4 | Verificar pgbackup: backup diario + restauración | `scripts/backup-db.sh` | ~1 h |
| 5.5 | Probar rollback del deploy script | `scripts/deploy.sh` | ~1 h |
| 5.6 | Verificar Sentry + Grafana capturan datos reales | `docker-compose.monitoring.yml` | ~1 h |

### 5.1 — .env.production (template)

```env
POSTGRES_USER=kusiqumir
POSTGRES_PASSWORD=<fuerte-16+chars>
JWT_SECRET=<fuerte-32+chars>
CSRF_SECRET=<fuerte-32+chars>
CORS_ORIGIN=https://kusiqumir.com,https://www.kusiqumir.com
SENTRY_DSN=https://key@oXXXX.ingest.us.sentry.io/XXXXX
WHATSAPP_PHONE=51999000000
CSRF_SKIP_PATHS=auth/csrf,auth/login,auth/register,health
API_URL=http://backend:3000
GRAFANA_PASSWORD=<fuerte>
CLOUDFRONT_DISTRIBUTION_ID=EXXXXX
RETENTION_DAYS=7

# Payment gateway (Fase 1)
PAYMENT_GATEWAY=stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SMTP (Fase 2)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=notificaciones@kusiqumir.com
SMTP_PASS=<app-password>
SMTP_FROM=notificaciones@kusiqumir.com
```

---

## Fase 6: Testing final y pulido (~10 h)

| # | Tarea | Esfuerzo |
|---|-------|----------|
| 6.1 | Test E2E: registro → login → ver tour → crear booking → pagar → recibir email | ~3 h |
| 6.2 | Prueba de carga con k6 o artillery (100 usuarios concurrentes) | ~2 h |
| 6.3 | Verificar SSR: curl cada ruta devuelve HTML completo | ~1 h |
| 6.4 | Auditoría de seguridad rápida (OWASP top 10) | ~2 h |
| 6.5 | Probar responsive mobile | ~1 h |
| 6.6 | (Opcional) Google Analytics / Tag Manager | ~1 h |

---

## Resumen de esfuerzo

| Fase | Horas | Dependencias | Prioridad |
|------|-------|--------------|-----------|
| Fase 0: Correcciones inmediatas | ~1 h | - | 🔴 Imprescindible |
| Fase 1: Pagos (Stripe/Culqi) | ~10 h | Fase 0 | 🔴 Imprescindible |
| Fase 2: Email | ~8 h | Fase 0 | 🔴 Imprescindible |
| Fase 3: Booking público | ~4 h | Fase 1 + 2 | 🔴 Imprescindible |
| Fase 4: Seguridad | ~6 h | Fase 0 | 🟠 Muy recomendado |
| Fase 5: Infraestructura | ~7 h | Fase 0-4 | 🟠 Necesario para deploy |
| Fase 6: Testing final | ~10 h | Fase 1-5 | 🟢 Calidad |
| **Total** | **~46 h** | | |

---

## MVP acelerado (~19 h) — para lanzar en 1 semana

Si necesitas producción urgente, haz solo esto:

1. **Fase 0** (1 h) — migración + Sentry
2. **Fase 1 solo Stripe** (5 h) — stripe checkout (el más rápido), sin webhooks complejos
3. **Fase 2 solo email** (4 h) — nodemailer con SMTP de Gmail
4. **Fase 3** (4 h) — booking público
5. **Fase 5 parcial** (3 h) — deploy manual `docker compose up`, sin CI/CD
6. **Test básico** (2 h) — probar flujo completo una vez

**MVP funcional: ~19 h laborables (~3 días)**

---

## Checklist de verificación pre-producción

```markdown
- [ ] Migración Prisma regenerada con todos los modelos
- [ ] Sentry DSN configurado (frontend + backend)
- [ ] Stripe/Culqi integrado — pagos reales funcionan
- [ ] Nodemailer integrado — emails reales se envían
- [ ] Booking público funciona sin login
- [ ] Booking → Payment → Email: flujo completo probado
- [ ] SSL funcionando (HTTPS)
- [ ] Backups automáticos verificados
- [ ] Rate limiting activo en nginx + backend
- [ ] CORS restringido a dominios reales
- [ ] Deploy script probado (con rollback)
- [ ] 404/500 pages funcionan en SSR
- [ ] robots.txt y sitemap.xml accesibles
- [ ] Google Search Console configurado (opcional)
```

---

## Diagrama de flujo del sistema en producción

```
Usuario → HTTPS → CloudFront → Nginx (SSL, cache, rate-limit)
                                      │
                          ┌───────────┴───────────┐
                          ▼                       ▼
                     Frontend (SSR)           Backend API
                     :4000                     :3000
                          │                       │
                          └───────────┬───────────┘
                                      ▼
                                  PostgreSQL
                                  (PostGIS)
                                      │
                          ┌───────────┴───────────┐
                          ▼                       ▼
                     Stripe/Culqi            SMTP/Email
                     (pagos)                 (notificaciones)
                          │
                          ▼
                     Sentry (errores)
                     Grafana/Loki (logs)
```