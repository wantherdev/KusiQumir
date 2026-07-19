import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { ApiProperty, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { ProvidersService } from "./providers.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

class CreateProviderDto {
  @ApiProperty({ description: "Nombre del proveedor", required: true })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: "Tipo de proveedor", required: true })
  @IsNotEmpty()
  type!: string;

  @ApiProperty({ description: "Contacto del proveedor", required: true })
  @IsNotEmpty()
  contact!: string;
}

@ApiTags("providers")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("providers")
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Listar proveedores" })
  findAll() {
    return this.providersService.findAll();
  }

  @Post()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Crear proveedor" })
  create(@Body() body: CreateProviderDto) {
    return this.providersService.create(body);
  }

  @Get(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Obtener proveedor por ID" })
  findOne(@Param("id") id: string) {
    return this.providersService.findOne(id);
  }
}
