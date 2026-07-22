import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsIn } from "class-validator";

export class SendNotificationDto {
  @ApiProperty({
    description: "Canal de notificación",
    required: true,
    enum: ["email", "whatsapp", "sms", "push"],
  })
  @IsIn(["email", "whatsapp", "sms", "push"])
  channel!: "email" | "whatsapp" | "sms" | "push";

  @ApiProperty({ description: "Destinatario de la notificación", required: true })
  @IsNotEmpty()
  recipient!: string;

  @ApiProperty({ description: "Mensaje de la notificación", required: true })
  @IsNotEmpty()
  message!: string;
}
