import {
  Controller, Get, Post, Body, Param, UseGuards,
  Patch, Delete, Query, UseInterceptors,
} from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ToursService } from "./tours.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Public } from "../auth/public.decorator";

class CreateTourDto {
  @IsNotEmpty() @IsString() name!: string;
  @IsNotEmpty() @IsString() description!: string;
  @IsNumber() @Min(0) price!: number;
  @IsNotEmpty() @IsString() duration!: string;
  @IsOptional() @IsString() images?: string;
  @IsOptional() @IsString() difficulty?: string;
  @IsOptional() @IsString() itinerary?: string;
  @IsOptional() @IsString() includes?: string;
  @IsOptional() @IsString() excludes?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsBoolean() availability?: boolean;
  @IsOptional() @IsString() providerId?: string;
}

class UpdateTourDto {
  @IsOptional() @IsNotEmpty() @IsString() name?: string;
  @IsOptional() @IsNotEmpty() @IsString() description?: string;
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsNotEmpty() @IsString() duration?: string;
  @IsOptional() @IsString() images?: string;
  @IsOptional() @IsString() difficulty?: string;
  @IsOptional() @IsString() itinerary?: string;
  @IsOptional() @IsString() includes?: string;
  @IsOptional() @IsString() excludes?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsBoolean() availability?: boolean;
  @IsOptional() @IsString() providerId?: string;
}

class FindAllToursQuery {
  @IsOptional() @IsString() take?: string;
  @IsOptional() @IsString() cursor?: string;
  @IsOptional() @IsString() availability?: string;
  @IsOptional() @IsString() difficulty?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() minPrice?: string;
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
