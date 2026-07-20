import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { PrismaService } from "../../prisma/prisma.service";
import { Public } from "../auth/public.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { IsString, IsOptional } from "class-validator";

class CreateCategoryDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Listar categorías" })
  findAll() {
    return this.prisma.category.findMany({ orderBy: { name: "asc" } });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: "Crear categoría" })
  async create(@Body() dto: CreateCategoryDto) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9áéíóúñü\s-]/g, "").replace(/[\s]+/g, "-").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
    return this.prisma.category.create({ data: { name: dto.name, slug, description: dto.description } });
  }
}
