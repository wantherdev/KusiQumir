import {
  Controller, Get, Post, Body, Param, UseGuards,
  Patch, Delete, Query, UseInterceptors,
} from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsEnum } from "class-validator";
import { ArticlesService } from "./articles.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Public } from "../auth/public.decorator";

class CreateArticleDto {
  @IsNotEmpty() @IsString() title!: string;
  @IsNotEmpty() @IsString() excerpt!: string;
  @IsNotEmpty() @IsString() content!: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() imageAlt?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() tags?: string;
  @IsOptional() @IsEnum(["DRAFT", "PUBLISHED"]) status?: string;
}

class UpdateArticleDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() imageAlt?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() tags?: string;
  @IsOptional() @IsEnum(["DRAFT", "PUBLISHED"]) status?: string;
}

@ApiTags("articles")
@UseInterceptors(CacheInterceptor)
@Controller()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Public()
  @Get("articles")
  @ApiOperation({ summary: "Listar artículos publicados" })
  findAll(@Query() query: Record<string, string>) {
    return this.articlesService.findAllPublic(query);
  }

  @Public()
  @Get("articles/:slug")
  @ApiOperation({ summary: "Obtener artículo por slug" })
  findBySlug(@Param("slug") slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  @Post("admin/articles")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Crear artículo (admin)" })
  create(@Body() body: CreateArticleDto) {
    return this.articlesService.create(body as any);
  }

  @Get("admin/articles")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Listar todos los artículos (admin)" })
  findAllAdmin() {
    return this.articlesService.findAllAdmin();
  }

  @Get("admin/articles/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtener artículo por ID (admin)" })
  findOneAdmin(@Param("id") id: string) {
    return this.articlesService.findOneAdmin(id);
  }

  @Patch("admin/articles/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Actualizar artículo (admin)" })
  update(@Param("id") id: string, @Body() body: UpdateArticleDto) {
    return this.articlesService.update(id, body as any);
  }

  @Delete("admin/articles/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Eliminar artículo (admin)" })
  remove(@Param("id") id: string) {
    return this.articlesService.remove(id);
  }
}
