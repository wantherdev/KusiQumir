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
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
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
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  description!: string;

  @IsArray()
  @ArrayNotEmpty()
  tours!: string[];

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  featured?: boolean;

  @IsOptional()
  @IsNumber()
  durationDays?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  included?: string;

  @IsOptional()
  excluded?: string;
}

class UpdatePackageDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  tours?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  featured?: boolean;

  @IsOptional()
  @IsNumber()
  durationDays?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  included?: string;

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
