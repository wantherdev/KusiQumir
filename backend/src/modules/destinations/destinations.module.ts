import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { DestinationsController } from "./destinations.controller";

@Module({
  imports: [PrismaModule],
  controllers: [DestinationsController],
})
export class DestinationsModule {}
