import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { IsNotEmpty, IsIn } from "class-validator";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

class SendNotificationDto {
  @IsIn(["email", "whatsapp", "sms", "push"])
  channel!: "email" | "whatsapp" | "sms" | "push";

  @IsNotEmpty()
  recipient!: string;

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
