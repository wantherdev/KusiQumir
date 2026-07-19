import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly maxRetries = Number(process.env["PRISMA_MAX_RETRIES"]) || 3;
  private readonly retryDelay = Number(process.env["PRISMA_RETRY_DELAY"]) || 1000;

  async onModuleInit() {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        await this.$connect();
        this.logger.log("Conexión a base de datos establecida");
        return;
      } catch (error) {
        this.logger.error(
          `Intento ${attempt}/${this.maxRetries} de conectar a BD falló`,
          error instanceof Error ? error.message : undefined,
        );
        if (attempt === this.maxRetries)
          throw new InternalServerErrorException(
            "Error al conectar con la base de datos",
          );
                await new Promise((r) => setTimeout(r, this.retryDelay * attempt));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log("Conexión a base de datos cerrada");
  }
}
