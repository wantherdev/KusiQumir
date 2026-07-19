import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ApiProperty, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { IsNotEmpty, IsIn } from "class-validator";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

class SendNotificationDto {
  @ApiProperty({ description: "Canal de notificación", required: true, enum: ["email", "whatsapp", "sms", "push"] })
  @IsIn(["email", "whatsapp", "sms", "push"])
  channel!: "email" | "whatsapp" | "sms" | "push";

  @ApiProperty({ description: "Destinatario de la notificación", required: true })
  @IsNotEmpty()
  recipient!: string;

  @ApiProperty({ description: "Mensaje de la notificación", required: true })
  @IsNotEmpty()
  message!: string;
}

@ApiTags("notifications")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post("send")
  @ApiOperation({ summary: "Enviar notificación" })
  send(@Body() body: SendNotificationDto) {
    return this.notificationsService.send(body);
  }
}
