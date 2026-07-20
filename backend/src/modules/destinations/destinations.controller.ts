import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { PrismaService } from "../../prisma/prisma.service";
import { Public } from "../auth/public.decorator";

@ApiTags("destinations")
@Controller("destinations")
export class DestinationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Listar destinos" })
  findAll() {
    return this.prisma.destination.findMany({ orderBy: { name: "asc" } });
  }
}
