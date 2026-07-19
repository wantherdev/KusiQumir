import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";
import { Public } from "../auth/public.decorator";
import { PrismaService } from "../../prisma/prisma.service";

@SkipThrottle()
@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Health check global del sistema" })
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: "ok",
        database: "connected",
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: "error",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      };
    }
  }
}
