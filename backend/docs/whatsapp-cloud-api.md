# WhatsApp Cloud API — Integración

> ⚠️ **DOCUMENTO DE PLAN — NO IMPLEMENTADO**
>
> Este documento describe una integración futura con WhatsApp Cloud API.
> Actualmente el backend no tiene implementado el envío automatizado de WhatsApp.
> El módulo `notifications` existe pero usa un stub; no hay módulo `whatsapp` ni webhook.

## Objetivo

Cuando un cliente crea una reserva desde el frontend:

1. El backend guarda la reserva en la base de datos
2. El backend envía un mensaje automatizado al **número del cliente** vía WhatsApp Cloud API (Meta)
3. El cliente recibe: *"Recibimos tu reserva para [tour]. Un asesor te contactará en breve."*
4. La agencia ve la reserva en el admin dashboard (`/admin/reservas`)

---

## Prerrequisitos (cuenta de Meta Business)

Antes de activar el envío automatizado se necesita:

| Recurso | Dónde obtenerlo |
|---------|-----------------|
| **Cuenta de Facebook Business** | https://business.facebook.com |
| **WhatsApp Business Account** | https://business.facebook.com/wa/manage |
| **Número de WhatsApp verificado** | En el panel de WhatsApp Business Account |
| **Token permanente** | En Meta for Developers → WhatsApp → API |
| **Phone Number ID** | En Meta for Developers → WhatsApp → API |
| **Webhook URL** | Endpoint del backend: `POST /api/v1/whatsapp/webhook` |

---

## Variables de entorno

Agregar al `.env` de producción:

```env
WHATSAPP_API_TOKEN="EAAT..."          # Token permanente de Meta
WHATSAPP_PHONE_ID="123456789"         # ID del número en Meta Developers
WHATSAPP_WEBHOOK_VERIFY="mi-token-secreto"  # Token para verificar webhook
NOTIFICATIONS_ENABLED=true
```

---

## Arquitectura

```
Frontend (reservar.ts)
  │
  ▼
POST /api/v1/bookings (público)
  │
  ▼
bookings.service.ts
  │
  ├── Crea Customer (o actualiza si ya existe)
  ├── Crea Booking
  ├── Llada WhatsAppApiService.send(phone, message)
  │     │
  │     ▼
  │   POST graph.facebook.com/v22.0/{phone-id}/messages
  │     │
  │     ▼
  │   Cliente recibe WhatsApp
  │
  └── Devuelve booking a frontend

Frontend → Muestra: "Reserva creada con éxito.
                   Te hemos enviado una confirmación a WhatsApp."
```

---

## Archivos a implementar

### 1. `whatsapp-api.service.ts` (nuevo)

```
backend/src/modules/notifications/whatsapp-api.service.ts
```

Servicio que envía mensajes vía WhatsApp Cloud API:

```typescript
@Injectable()
export class WhatsAppApiService {
  private readonly apiVersion = 'v22.0';
  private readonly baseUrl = 'https://graph.facebook.com';

  constructor(private readonly config: ConfigService) {}

  async sendMessage(to: string, body: string): Promise<void> {
    const token = this.config.get<string>('WHATSAPP_API_TOKEN');
    const phoneId = this.config.get<string>('WHATSAPP_PHONE_ID');
    if (!token || !phoneId) return; // No configurado

    await fetch(`${this.baseUrl}/${this.apiVersion}/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to.replace(/[^0-9]/g, ''),
        type: 'text',
        text: { body },
      }),
    });
  }
}
```

### 2. `notifications.service.ts` (modificar)

Reemplazar el stub de `deliver()` para el canal `whatsapp`:

```typescript
case "whatsapp":
  await this.whatsappApi.sendMessage(recipient, message);
  return true;
```

Agregar inyección de `WhatsAppApiService` en el constructor.

### 3. `env.validation.ts` (modificar)

Agregar nuevas variables:

```typescript
WHATSAPP_API_TOKEN: Joi.string().optional(),
WHATSAPP_PHONE_ID: Joi.string().optional(),
WHATSAPP_WEBHOOK_VERIFY: Joi.string().optional(),
```

### 4. `bookings.service.ts` (modificar)

- Hacer que `create()` funcione sin usuario autenticado (público)
- Si no hay `user`, crear/actualizar `Customer` con `customerName`, `customerEmail`, `customerPhone`
- Enviar notificación WhatsApp al cliente cuando se cree la reserva

### 5. `bookings.controller.ts` (modificar)

```typescript
@Public()   // ← Agregar
@Post()
create(@Body() body: CreateBookingDto, @Request() req: AuthenticatedRequest) {
  return this.bookingsService.create(body, req.user);
}
```

---

## Mensajes

### Mensaje al cliente (confirmación)

```
✅ *Reserva Confirmada - Kusi Q'umir*

Hola {{nombre}},
Hemos recibido tu reserva para {{tour}}.

📅 Fecha: {{fecha}}
👥 Viajeros: {{viajeros}}
💰 Total: ${{total}}

Un asesor se pondrá en contacto contigo en breve para
confirmar los detalles.

Gracias por confiar en Kusi Q'umir 🏔️
```

### Mensaje a la agencia (notificación interna)

Cuando se implemente un webhook, la agencia puede recibir un mensaje con los datos de la nueva reserva a un número de operaciones.

---

## Webhook (opcional)

Para recibir mensajes entrantes y responder automáticamente:

```
POST /api/v1/whatsapp/webhook
GET  /api/v1/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=...
```

Meta enviará una solicitud `GET` para verificar el webhook. Luego cada mensaje que el cliente envíe al número de la agencia llegará como `POST` al webhook.

---

## Pruebas

### Sin token configurado

Si `WHATSAPP_API_TOKEN` no está definido, `sendMessage()` retorna sin hacer nada.
El sistema sigue funcionando sin errores — solo se persiste la notificación en BD.

### Con token configurado

El mensaje se envía realmente al número del cliente.
Para probar en desarrollo usar el número personal de Meta (sandbox).

---

## Referencias

- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Meta for Developers](https://developers.facebook.com/)
- [WhatsApp Business Account Setup](https://business.facebook.com/wa/manage)
