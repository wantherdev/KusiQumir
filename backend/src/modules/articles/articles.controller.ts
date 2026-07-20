import {
  Controller, Get, Post, Body, Param, UseGuards,
  Patch, Delete, Query, UseInterceptors,
} from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { ApiProperty, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsEnum } from "class-validator";
import { ArticlesService } from "./articles.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Public } from "../auth/public.decorator";

export class CreateArticleDto {
  @ApiProperty({ description: "Título del artículo", required: true })
  @IsNotEmpty() @IsString() title!: string;
  @ApiProperty({ description: "Extracto del artículo", required: true })
  @IsNotEmpty() @IsString() excerpt!: string;
  @ApiProperty({ description: "Contenido del artículo", required: true })
  @IsNotEmpty() @IsString() content!: string;
  @ApiProperty({ description: "Slug del artículo", required: false })
  @IsOptional() @IsString() slug?: string;
  @ApiProperty({ description: "URL de la imagen de portada", required: false })
  @IsOptional() @IsString() coverImage?: string;
  @ApiProperty({ description: "Texto alternativo de la imagen", required: false })
  @IsOptional() @IsString() imageAlt?: string;
  @ApiProperty({ description: "Categoría del artículo", required: false })
  @IsOptional() @IsString() category?: string;
  @ApiProperty({ description: "Tags del artículo", required: false })
  @IsOptional() @IsString() tags?: string;
  @ApiProperty({ description: "Estado del artículo", required: false })
  @IsOptional() @IsEnum(["DRAFT", "PUBLISHED", "ARCHIVED"]) status?: string;
}

export class UpdateArticleDto {
  @ApiProperty({ description: "Título del artículo", required: false })
  @IsOptional() @IsString() title?: string;
  @ApiProperty({ description: "Extracto del artículo", required: false })
  @IsOptional() @IsString() excerpt?: string;
  @ApiProperty({ description: "Contenido del artículo", required: false })
  @IsOptional() @IsString() content?: string;
  @ApiProperty({ description: "Slug del artículo", required: false })
  @IsOptional() @IsString() slug?: string;
  @ApiProperty({ description: "URL de la imagen de portada", required: false })
  @IsOptional() @IsString() coverImage?: string;
  @ApiProperty({ description: "Texto alternativo de la imagen", required: false })
  @IsOptional() @IsString() imageAlt?: string;
  @ApiProperty({ description: "Categoría del artículo", required: false })
  @IsOptional() @IsString() category?: string;
  @ApiProperty({ description: "Tags del artículo", required: false })
  @IsOptional() @IsString() tags?: string;
  @ApiProperty({ description: "Estado del artículo", required: false })
  @IsOptional() @IsEnum(["DRAFT", "PUBLISHED", "ARCHIVED"]) status?: string;
}

class FindAllArticlesQuery {
  @ApiProperty({ description: "Límite de resultados", required: false })
  @IsOptional() @IsString() take?: string;
  @ApiProperty({ description: "Cursor para paginación", required: false })
  @IsOptional() @IsString() cursor?: string;
  @ApiProperty({ description: "Filtrar por categoría", required: false })
  @IsOptional() @IsString() category?: string;
}

@ApiTags("articles")
@UseInterceptors(CacheInterceptor)
@Controller()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Public()
  @Get("articles")
  @ApiOperation({ summary: "Listar artículos publicados" })
  findAll(@Query() query: FindAllArticlesQuery) {
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
    return this.articlesService.create(body);
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
    return this.articlesService.update(id, body);
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
