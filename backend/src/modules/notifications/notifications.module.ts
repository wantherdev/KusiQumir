import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { WhatsAppService } from "./whatsapp.service";

@Module({
  imports: [ConfigModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, WhatsAppService],
  exports: [WhatsAppService, NotificationsService],
})
export class NotificationsModule {}
