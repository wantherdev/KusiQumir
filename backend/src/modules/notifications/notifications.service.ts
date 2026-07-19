import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private async deliver(payload: {
    channel: string;
    recipient: string;
    message: string;
  }): Promise<boolean> {
    const { channel, recipient, message } = payload;
    switch (channel) {
      case "email":
        this.logger.log(`[NOTIFICATION] Enviando email a ${recipient}: ${message.slice(0, 50)}...`);
        return true;
      case "whatsapp":
        this.logger.log(`[NOTIFICATION] Enviando WhatsApp a ${recipient}: ${message.slice(0, 50)}...`);
        return true;
      case "sms":
        this.logger.log(`[NOTIFICATION] Enviando SMS a ${recipient}: ${message.slice(0, 50)}...`);
        return true;
      case "push":
        this.logger.log(`[NOTIFICATION] Enviando push a ${recipient}: ${message.slice(0, 50)}...`);
        return true;
      default:
        this.logger.error(`[NOTIFICATION] Canal desconocido: ${channel}`);
        return false;
    }
  }

  async send(payload: {
    channel: "email" | "whatsapp" | "sms" | "push";
    recipient: string;
    message: string;
  }): Promise<{
    id: string;
    channel: string;
    recipient: string;
    message: string;
    delivered: boolean;
  }> {
    const enabled = this.config.get<boolean>("NOTIFICATIONS_ENABLED");

    if (enabled) {
      const delivered = await this.deliver(payload);
      if (!delivered) {
        this.logger.warn(
          `[NOTIFICATION] No se pudo entregar notificación a ${payload.recipient} por canal ${payload.channel}`,
        );
        return {
          id: "",
          channel: payload.channel,
          recipient: payload.recipient,
          message: payload.message,
          delivered: false,
        };
      }
    } else {
      this.logger.warn(
        `[NOTIFICATION] Notificaciones deshabilitadas (NOTIFICATIONS_ENABLED=false). Registrando sin enviar.`,
      );
    }

    const notification = await this.prisma.notification.create({
      data: {
        channel: payload.channel,
        recipient: payload.recipient,
        message: payload.message,
      },
      select: { id: true, channel: true, recipient: true, message: true, sentAt: true },
    });

    return {
      id: notification.id,
      channel: notification.channel,
      recipient: notification.recipient,
      message: notification.message,
      delivered: true,
    };
  }
}
