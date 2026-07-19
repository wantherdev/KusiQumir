import {
  Controller, Get, Post, Body, Param, UseGuards,
  Patch, Delete, Query, UseInterceptors,
} from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { ApiProperty, ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ToursService } from "./tours.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Public } from "../auth/public.decorator";

class CreateTourDto {
  @ApiProperty({ description: "Slug único del tour", required: true })
  @IsNotEmpty() @IsString() slug!: string;
  @ApiProperty({ description: "Nombre del tour", required: true })
  @IsNotEmpty() @IsString() name!: string;
  @ApiProperty({ description: "Subtítulo del tour", required: false })
  @IsOptional() @IsString() subtitle?: string;
  @ApiProperty({ description: "Descripción corta", required: false })
  @IsOptional() @IsString() shortDescription?: string;
  @ApiProperty({ description: "Descripción completa", required: true })
  @IsNotEmpty() @IsString() description!: string;
  @ApiProperty({ description: "Categoría", required: true })
  @IsNotEmpty() @IsString() category!: string;
  @ApiProperty({ description: "Tipo de tour", required: true })
  @IsNotEmpty() @IsString() tourType!: string;
  @ApiProperty({ description: "Días de duración", required: true })
  @IsNumber() @Min(1) durationDays!: number;
  @ApiProperty({ description: "Horas adicionales", required: true })
  @IsNumber() @Min(0) durationHours!: number;
  @ApiProperty({ description: "Texto de duración (ej: 4 días / 3 noches)", required: true })
  @IsNotEmpty() @IsString() durationText!: string;
  @ApiProperty({ description: "País", required: true })
  @IsNotEmpty() @IsString() country!: string;
  @ApiProperty({ description: "Región/Departamento", required: true })
  @IsNotEmpty() @IsString() region!: string;
  @ApiProperty({ description: "Ciudad", required: true })
  @IsNotEmpty() @IsString() city!: string;
  @ApiProperty({ description: "Punto de encuentro", required: false })
  @IsOptional() @IsString() meetingPoint?: string;
  @ApiProperty({ description: "Punto de finalización", required: false })
  @IsOptional() @IsString() endingPoint?: string;
  @ApiProperty({ description: "Incluye recogida", required: false })
  @IsOptional() @IsBoolean() pickup?: boolean;
  @ApiProperty({ description: "Hora de inicio", required: false })
  @IsOptional() @IsString() startTime?: string;
  @ApiProperty({ description: "Hora de fin", required: false })
  @IsOptional() @IsString() endTime?: string;
  @ApiProperty({ description: "Dificultad", required: false })
  @IsOptional() @IsString() difficulty?: string;
  @ApiProperty({ description: "Altitud mínima (m)", required: false })
  @IsOptional() @IsNumber() @Min(0) altitudeMin?: number;
  @ApiProperty({ description: "Altitud máxima (m)", required: false })
  @IsOptional() @IsNumber() @Min(0) altitudeMax?: number;
  @ApiProperty({ description: "Tipo de grupo", required: false })
  @IsOptional() @IsString() groupType?: string;
  @ApiProperty({ description: "Destacado", required: false })
  @IsOptional() @IsBoolean() featured?: boolean;
  @ApiProperty({ description: "Estado (published/draft/archived)", required: false })
  @IsOptional() @IsString() status?: string;
  @ApiProperty({ description: "Imagen principal", required: false })
  @IsOptional() @IsString() coverImage?: string;
  @ApiProperty({ description: "Video URL", required: false })
  @IsOptional() @IsString() video?: string;
  @ApiProperty({ description: "Moneda", required: false })
  @IsOptional() @IsString() currency?: string;
  @ApiProperty({ description: "Precio adulto", required: true })
  @IsNumber() @Min(0) adultPrice!: number;
  @ApiProperty({ description: "Precio niño", required: false })
  @IsOptional() @IsNumber() @Min(0) childPrice?: number;
  @ApiProperty({ description: "Descuento", required: false })
  @IsOptional() @IsNumber() @Min(0) discount?: number;
  @ApiProperty({ description: "SEO Title", required: false })
  @IsOptional() @IsString() seoTitle?: string;
  @ApiProperty({ description: "SEO Description", required: false })
  @IsOptional() @IsString() seoDescription?: string;
  @ApiProperty({ description: "SEO Keywords (JSON array)", required: false })
  @IsOptional() seoKeywords?: any;
  @ApiProperty({ description: "Provider ID", required: false })
  @IsOptional() @IsString() providerId?: string;
  @ApiProperty({ description: "URL fuente", required: false })
  @IsOptional() @IsString() sourceUrl?: string;
  @ApiProperty({ description: "Idiomas", required: false, type: [Object] })
  @IsOptional() languages?: { create: { language: string }[] };
  @ApiProperty({ description: "Destacados", required: false, type: [Object] })
  @IsOptional() highlights?: { create: { title: string; description?: string; icon?: string }[] };
  @ApiProperty({ description: "Itinerario", required: false, type: [Object] })
  @IsOptional() itinerary?: { create: { day: number; order: number; time?: string; title: string; description: string; location?: string; duration?: number }[] };
  @ApiProperty({ description: "Destinos", required: false, type: [Object] })
  @IsOptional() destinations?: { create: { name: string; type?: string; description?: string; latitude?: number; longitude?: number; altitude?: number; visitTime?: number }[] };
  @ApiProperty({ description: "Incluye", required: false, type: [Object] })
  @IsOptional() includes?: { create: { title: string; description?: string }[] };
  @ApiProperty({ description: "No incluye", required: false, type: [Object] })
  @IsOptional() notIncludes?: { create: { title: string; description?: string }[] };
  @ApiProperty({ description: "Recomendaciones", required: false, type: [Object] })
  @IsOptional() recommendations?: { create: { title?: string; description: string }[] };
  @ApiProperty({ description: "Requisitos", required: false, type: [Object] })
  @IsOptional() requirements?: { create: { requirement: string }[] };
  @ApiProperty({ description: "Qué llevar", required: false, type: [Object] })
  @IsOptional() whatToBring?: { create: { item: string }[] };
  @ApiProperty({ description: "FAQs", required: false, type: [Object] })
  @IsOptional() faqs?: { create: { question: string; answer: string }[] };
  @ApiProperty({ description: "Imágenes", required: false, type: [Object] })
  @IsOptional() images?: { create: { url: string; alt?: string; featured?: boolean; order?: number }[] };
}

class UpdateTourDto {
  @ApiProperty({ description: "Slug único", required: false })
  @IsOptional() @IsNotEmpty() @IsString() slug?: string;
  @ApiProperty({ description: "Nombre del tour", required: false })
  @IsOptional() @IsNotEmpty() @IsString() name?: string;
  @ApiProperty({ description: "Subtítulo", required: false })
  @IsOptional() @IsString() subtitle?: string;
  @ApiProperty({ description: "Descripción corta", required: false })
  @IsOptional() @IsString() shortDescription?: string;
  @ApiProperty({ description: "Descripción completa", required: false })
  @IsOptional() @IsString() description?: string;
  @ApiProperty({ description: "Categoría", required: false })
  @IsOptional() @IsString() category?: string;
  @ApiProperty({ description: "Tipo de tour", required: false })
  @IsOptional() @IsString() tourType?: string;
  @ApiProperty({ description: "Días de duración", required: false })
  @IsOptional() @IsNumber() @Min(1) durationDays?: number;
  @ApiProperty({ description: "Horas adicionales", required: false })
  @IsOptional() @IsNumber() @Min(0) durationHours?: number;
  @ApiProperty({ description: "Texto de duración", required: false })
  @IsOptional() @IsString() durationText?: string;
  @ApiProperty({ description: "País", required: false })
  @IsOptional() @IsString() country?: string;
  @ApiProperty({ description: "Región", required: false })
  @IsOptional() @IsString() region?: string;
  @ApiProperty({ description: "Ciudad", required: false })
  @IsOptional() @IsString() city?: string;
  @ApiProperty({ description: "Punto de encuentro", required: false })
  @IsOptional() @IsString() meetingPoint?: string;
  @ApiProperty({ description: "Punto final", required: false })
  @IsOptional() @IsString() endingPoint?: string;
  @ApiProperty({ description: "Incluye recogida", required: false })
  @IsOptional() @IsBoolean() pickup?: boolean;
  @ApiProperty({ description: "Hora inicio", required: false })
  @IsOptional() @IsString() startTime?: string;
  @ApiProperty({ description: "Hora fin", required: false })
  @IsOptional() @IsString() endTime?: string;
  @ApiProperty({ description: "Dificultad", required: false })
  @IsOptional() @IsString() difficulty?: string;
  @ApiProperty({ description: "Altitud mínima", required: false })
  @IsOptional() @IsNumber() @Min(0) altitudeMin?: number;
  @ApiProperty({ description: "Altitud máxima", required: false })
  @IsOptional() @IsNumber() @Min(0) altitudeMax?: number;
  @ApiProperty({ description: "Tipo de grupo", required: false })
  @IsOptional() @IsString() groupType?: string;
  @ApiProperty({ description: "Destacado", required: false })
  @IsOptional() @IsBoolean() featured?: boolean;
  @ApiProperty({ description: "Estado", required: false })
  @IsOptional() @IsString() status?: string;
  @ApiProperty({ description: "Imagen principal", required: false })
  @IsOptional() @IsString() coverImage?: string;
  @ApiProperty({ description: "Video", required: false })
  @IsOptional() @IsString() video?: string;
  @ApiProperty({ description: "Moneda", required: false })
  @IsOptional() @IsString() currency?: string;
  @ApiProperty({ description: "Precio adulto", required: false })
  @IsOptional() @IsNumber() @Min(0) adultPrice?: number;
  @ApiProperty({ description: "Precio niño", required: false })
  @IsOptional() @IsNumber() @Min(0) childPrice?: number;
  @ApiProperty({ description: "Descuento", required: false })
  @IsOptional() @IsNumber() @Min(0) discount?: number;
  @ApiProperty({ description: "SEO Title", required: false })
  @IsOptional() @IsString() seoTitle?: string;
  @ApiProperty({ description: "SEO Description", required: false })
  @IsOptional() @IsString() seoDescription?: string;
  @ApiProperty({ description: "SEO Keywords", required: false })
  @IsOptional() seoKeywords?: any;
  @ApiProperty({ description: "Provider ID", required: false })
  @IsOptional() @IsString() providerId?: string;
  @ApiProperty({ description: "URL fuente", required: false })
  @IsOptional() @IsString() sourceUrl?: string;
}

class FindAllToursQuery {
  @ApiProperty({ description: "Límite de resultados", required: false })
  @IsOptional() @IsString() take?: string;
  @ApiProperty({ description: "Cursor para paginación", required: false })
  @IsOptional() @IsString() cursor?: string;
  @ApiProperty({ description: "Filtrar por estado", required: false })
  @IsOptional() @IsString() status?: string;
  @ApiProperty({ description: "Filtrar por dificultad", required: false })
  @IsOptional() @IsString() difficulty?: string;
  @ApiProperty({ description: "Filtrar por país", required: false })
  @IsOptional() @IsString() country?: string;
  @ApiProperty({ description: "Filtrar por región", required: false })
  @IsOptional() @IsString() region?: string;
  @ApiProperty({ description: "Filtrar por ciudad", required: false })
  @IsOptional() @IsString() city?: string;
  @ApiProperty({ description: "Precio mínimo", required: false })
  @IsOptional() @IsString() minPrice?: string;
  @ApiProperty({ description: "Precio máximo", required: false })
  @IsOptional() @IsString() maxPrice?: string;
}

@ApiTags("tours")
@Controller("tours")
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Listar tours públicos" })
  @ApiQuery({ name: "take", required: false })
  @ApiQuery({ name: "cursor", required: false })
  @ApiQuery({ name: "status", required: false })
  @ApiQuery({ name: "difficulty", required: false })
  @ApiQuery({ name: "country", required: false })
  @ApiQuery({ name: "region", required: false })
  @ApiQuery({ name: "city", required: false })
  @ApiQuery({ name: "minPrice", required: false })
  @ApiQuery({ name: "maxPrice", required: false })
  findAll(@Query() query: any) {
    return this.toursService.findAllPublic(query);
  }

  @Public()
  @Get("slug/:slug")
  @ApiOperation({ summary: "Obtener tour por slug" })
  findBySlug(@Param("slug") slug: string) {
    return this.toursService.findBySlug(slug);
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Obtener tour por ID" })
  findOne(@Param("id") id: string) {
    return this.toursService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Crear tour (admin)" })
  create(@Body() body: CreateTourDto) {
    return this.toursService.create(body);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Actualizar tour (admin)" })
  update(@Param("id") id: string, @Body() body: UpdateTourDto) {
    return this.toursService.update(id, body);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Eliminar tour (admin)" })
  remove(@Param("id") id: string) {
    return this.toursService.remove(id);
  }
}