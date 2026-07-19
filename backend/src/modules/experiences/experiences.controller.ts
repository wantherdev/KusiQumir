import {
  Controller, Get, Post, Body, Param, UseGuards,
  Patch, Delete, Query, UseInterceptors,
} from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsEnum } from "class-validator";
import { ExperiencesService } from "./experiences.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Public } from "../auth/public.decorator";

class CreateExperienceDto {
  @IsNotEmpty() @IsString() title!: string;
  @IsNotEmpty() @IsString() summary!: string;
  @IsNotEmpty() @IsString() content!: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() imageAlt?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() duration?: string;
  @IsOptional() @IsString() tourId?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsEnum(["DRAFT", "PUBLISHED"]) status?: string;
}

class UpdateExperienceDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() imageAlt?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() duration?: string;
  @IsOptional() @IsString() tourId?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsEnum(["DRAFT", "PUBLISHED"]) status?: string;
}

@ApiTags("experiences")
@UseInterceptors(CacheInterceptor)
@Controller()
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Public()
  @Get("experiences")
  @ApiOperation({ summary: "Listar experiencias publicadas" })
  findAll(@Query() query: Record<string, string>) {
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
    return this.experiencesService.create(body as any);
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
    return this.experiencesService.update(id, body as any);
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
