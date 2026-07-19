import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  send(payload: {
    channel: "email" | "whatsapp" | "sms" | "push";
    recipient: string;
    message: string;
  }) {
    return this.prisma.notification.create({
      data: {
        channel: payload.channel,
        recipient: payload.recipient,
        message: payload.message,
      },
    });
  }
}
