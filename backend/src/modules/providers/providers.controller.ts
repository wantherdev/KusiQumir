import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { ProvidersService } from "./providers.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

class CreateProviderDto {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  type!: string;

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
  @ApiOperation({ summary: "Obtener proveedor por ID" })
  findOne(@Param("id") id: string) {
    return this.providersService.findOne(id);
  }
}
