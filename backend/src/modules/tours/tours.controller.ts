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
  @ApiProperty({ description: "Nombre del tour", required: true })
  @IsNotEmpty() @IsString() name!: string;
  @ApiProperty({ description: "Descripción del tour", required: true })
  @IsNotEmpty() @IsString() description!: string;
  @ApiProperty({ description: "Precio del tour", required: true })
  @IsNumber() @Min(0) price!: number;
  @ApiProperty({ description: "Duración del tour", required: true })
  @IsNotEmpty() @IsString() duration!: string;
  @ApiProperty({ description: "Imágenes del tour", required: false })
  @IsOptional() @IsString() images?: string;
  @ApiProperty({ description: "Dificultad del tour", required: false })
  @IsOptional() @IsString() difficulty?: string;
  @ApiProperty({ description: "Itinerario del tour", required: false })
  @IsOptional() @IsString() itinerary?: string;
  @ApiProperty({ description: "Incluye", required: false })
  @IsOptional() @IsString() includes?: string;
  @ApiProperty({ description: "Excluye", required: false })
  @IsOptional() @IsString() excludes?: string;
  @ApiProperty({ description: "Ubicación del tour", required: false })
  @IsOptional() @IsString() location?: string;
  @ApiProperty({ description: "Disponibilidad", required: false })
  @IsOptional() @IsBoolean() availability?: boolean;
  @ApiProperty({ description: "ID del proveedor", required: false })
  @IsOptional() @IsString() providerId?: string;
}

class UpdateTourDto {
  @ApiProperty({ description: "Nombre del tour", required: false })
  @IsOptional() @IsNotEmpty() @IsString() name?: string;
  @ApiProperty({ description: "Descripción del tour", required: false })
  @IsOptional() @IsNotEmpty() @IsString() description?: string;
  @ApiProperty({ description: "Precio del tour", required: false })
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @ApiProperty({ description: "Duración del tour", required: false })
  @IsOptional() @IsNotEmpty() @IsString() duration?: string;
  @ApiProperty({ description: "Imágenes del tour", required: false })
  @IsOptional() @IsString() images?: string;
  @ApiProperty({ description: "Dificultad del tour", required: false })
  @IsOptional() @IsString() difficulty?: string;
  @ApiProperty({ description: "Itinerario del tour", required: false })
  @IsOptional() @IsString() itinerary?: string;
  @ApiProperty({ description: "Incluye", required: false })
  @IsOptional() @IsString() includes?: string;
  @ApiProperty({ description: "Excluye", required: false })
  @IsOptional() @IsString() excludes?: string;
  @ApiProperty({ description: "Ubicación del tour", required: false })
  @IsOptional() @IsString() location?: string;
  @ApiProperty({ description: "Disponibilidad", required: false })
  @IsOptional() @IsBoolean() availability?: boolean;
  @ApiProperty({ description: "ID del proveedor", required: false })
  @IsOptional() @IsString() providerId?: string;
}

class FindAllToursQuery {
  @ApiProperty({ description: "Límite de resultados", required: false })
  @IsOptional() @IsString() take?: string;
  @ApiProperty({ description: "Cursor para paginación", required: false })
  @IsOptional() @IsString() cursor?: string;
  @ApiProperty({ description: "Filtrar por disponibilidad", required: false })
  @IsOptional() @IsString() availability?: string;
  @ApiProperty({ description: "Filtrar por dificultad", required: false })
  @IsOptional() @IsString() difficulty?: string;
  @ApiProperty({ description: "Filtrar por ubicación", required: false })
  @IsOptional() @IsString() location?: string;
  @ApiProperty({ description: "Precio mínimo", required: false })
  @IsOptional() @IsString() minPrice?: string;
  @ApiProperty({ description: "Precio máximo", required: false })
  @IsOptional() @IsString() maxPrice?: string;
}

@ApiTags("tours")
@UseInterceptors(CacheInterceptor)
@Controller("tours")
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Listar tours públicos" })
  @ApiQuery({ name: "take", required: false })
  @ApiQuery({ name: "cursor", required: false })
  @ApiQuery({ name: "availability", required: false })
  @ApiQuery({ name: "difficulty", required: false })
  @ApiQuery({ name: "location", required: false })
  @ApiQuery({ name: "minPrice", required: false })
  @ApiQuery({ name: "maxPrice", required: false })
  findAll(@Query() query: FindAllToursQuery) {
    return this.toursService.findAllPublic(query);
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
