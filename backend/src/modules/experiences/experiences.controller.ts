import {
  Controller, Get, Post, Body, Param, UseGuards,
  Patch, Delete, Query, UseInterceptors,
} from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { ApiProperty, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsEnum } from "class-validator";
import { ExperiencesService } from "./experiences.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Public } from "../auth/public.decorator";

export class CreateExperienceDto {
  @ApiProperty({ description: "Título de la experiencia", required: true })
  @IsNotEmpty() @IsString() title!: string;
  @ApiProperty({ description: "Resumen de la experiencia", required: true })
  @IsNotEmpty() @IsString() summary!: string;
  @ApiProperty({ description: "Contenido de la experiencia", required: true })
  @IsNotEmpty() @IsString() content!: string;
  @ApiProperty({ description: "Slug de la experiencia", required: false })
  @IsOptional() @IsString() slug?: string;
  @ApiProperty({ description: "URL de la imagen de portada", required: false })
  @IsOptional() @IsString() coverImage?: string;
  @ApiProperty({ description: "Texto alternativo de la imagen", required: false })
  @IsOptional() @IsString() imageAlt?: string;
  @ApiProperty({ description: "Ubicación de la experiencia", required: false })
  @IsOptional() @IsString() location?: string;
  @ApiProperty({ description: "Duración de la experiencia", required: false })
  @IsOptional() @IsString() duration?: string;
  @ApiProperty({ description: "ID del tour relacionado", required: false })
  @IsOptional() @IsString() tourId?: string;
  @ApiProperty({ description: "Destacado", required: false })
  @IsOptional() @IsBoolean() featured?: boolean;
  @ApiProperty({ description: "Estado de la experiencia", required: false })
  @IsOptional() @IsEnum(["DRAFT", "PUBLISHED"]) status?: string;
}

export class UpdateExperienceDto {
  @ApiProperty({ description: "Título de la experiencia", required: false })
  @IsOptional() @IsString() title?: string;
  @ApiProperty({ description: "Resumen de la experiencia", required: false })
  @IsOptional() @IsString() summary?: string;
  @ApiProperty({ description: "Contenido de la experiencia", required: false })
  @IsOptional() @IsString() content?: string;
  @ApiProperty({ description: "Slug de la experiencia", required: false })
  @IsOptional() @IsString() slug?: string;
  @ApiProperty({ description: "URL de la imagen de portada", required: false })
  @IsOptional() @IsString() coverImage?: string;
  @ApiProperty({ description: "Texto alternativo de la imagen", required: false })
  @IsOptional() @IsString() imageAlt?: string;
  @ApiProperty({ description: "Ubicación de la experiencia", required: false })
  @IsOptional() @IsString() location?: string;
  @ApiProperty({ description: "Duración de la experiencia", required: false })
  @IsOptional() @IsString() duration?: string;
  @ApiProperty({ description: "ID del tour relacionado", required: false })
  @IsOptional() @IsString() tourId?: string;
  @ApiProperty({ description: "Destacado", required: false })
  @IsOptional() @IsBoolean() featured?: boolean;
  @ApiProperty({ description: "Estado de la experiencia", required: false })
  @IsOptional() @IsEnum(["DRAFT", "PUBLISHED"]) status?: string;
}

class FindAllExperiencesQuery {
  @ApiProperty({ description: "Límite de resultados", required: false })
  @IsOptional() @IsString() take?: string;
  @ApiProperty({ description: "Cursor para paginación", required: false })
  @IsOptional() @IsString() cursor?: string;
  @ApiProperty({ description: "Filtrar por destacado", required: false })
  @IsOptional() @IsString() featured?: string;
  @ApiProperty({ description: "Filtrar por ubicación", required: false })
  @IsOptional() @IsString() location?: string;
}

@ApiTags("experiences")
@UseInterceptors(CacheInterceptor)
@Controller()
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Public()
  @Get("experiences")
  @ApiOperation({ summary: "Listar experiencias publicadas" })
  findAll(@Query() query: FindAllExperiencesQuery) {
    return this.experiencesService.findAllPublic(query);
  }

  @Public()
  @Get("experiences/:slug")
  @ApiOperation({ summary: "Obtener experiencia por slug" })
  findBySlug(@Param("slug") slug: string) {
    return this.experiencesService.findBySlug(slug);
  }

  @Post("admin/experiences")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Crear experiencia (admin)" })
  create(@Body() body: CreateExperienceDto) {
    return this.experiencesService.create(body);
  }

  @Get("admin/experiences")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Listar experiencias (admin)" })
  findAllAdmin() {
    return this.experiencesService.findAllAdmin();
  }

  @Get("admin/experiences/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtener experiencia por ID (admin)" })
  findOneAdmin(@Param("id") id: string) {
    return this.experiencesService.findOneAdmin(id);
  }

  @Patch("admin/experiences/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Actualizar experiencia (admin)" })
  update(@Param("id") id: string, @Body() body: UpdateExperienceDto) {
    return this.experiencesService.update(id, body);
  }

  @Delete("admin/experiences/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Eliminar experiencia (admin)" })
  remove(@Param("id") id: string) {
    return this.experiencesService.remove(id);
  }
}
