import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
} from "@nestjs/common";
import { ApiProperty, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import {
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from "class-validator";
import { PackagesService } from "./packages.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Public } from "../auth/public.decorator";

class CreatePackageDto {
  @ApiProperty({ description: "Nombre del paquete", required: true })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: "Descripción del paquete", required: true })
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: "IDs de los tours incluidos", required: true })
  @IsArray()
  @ArrayNotEmpty()
  tours!: string[];

  @ApiProperty({ description: "Precio del paquete", required: true })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ description: "Destacado", required: false })
  @IsOptional()
  featured?: boolean;

  @ApiProperty({ description: "Duración en días", required: false })
  @IsOptional()
  @IsNumber()
  durationDays?: number;

  @ApiProperty({ description: "Descuento", required: false })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({ description: "URL de la imagen", required: false })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: "Incluye", required: false })
  @IsOptional()
  included?: string;

  @ApiProperty({ description: "Excluye", required: false })
  @IsOptional()
  excluded?: string;
}

class UpdatePackageDto {
  @ApiProperty({ description: "Nombre del paquete", required: false })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ description: "Descripción del paquete", required: false })
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ description: "IDs de los tours incluidos", required: false })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  tours?: string[];

  @ApiProperty({ description: "Precio del paquete", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ description: "Destacado", required: false })
  @IsOptional()
  featured?: boolean;

  @ApiProperty({ description: "Duración en días", required: false })
  @IsOptional()
  @IsNumber()
  durationDays?: number;

  @ApiProperty({ description: "Descuento", required: false })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({ description: "URL de la imagen", required: false })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: "Incluye", required: false })
  @IsOptional()
  included?: string;

  @ApiProperty({ description: "Excluye", required: false })
  @IsOptional()
  excluded?: string;
}

@ApiTags("packages")
@Controller("packages")
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Listar paquetes turísticos" })
  findAll() {
    return this.packagesService.findAll();
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Obtener paquete por ID" })
  findOne(@Param("id") id: string) {
    return this.packagesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Crear paquete turístico" })
  create(@Body() body: CreatePackageDto) {
    return this.packagesService.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Actualizar paquete turístico" })
  update(@Param("id") id: string, @Body() body: UpdatePackageDto) {
    return this.packagesService.update(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Eliminar paquete turístico" })
  remove(@Param("id") id: string) {
    return this.packagesService.remove(id);
  }

}
