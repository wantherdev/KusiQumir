import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from "@nestjs/common";
import { ApiProperty, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CustomersService } from "./customers.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { AuthenticatedRequest } from "../../common/authenticated-request";

class CreateCustomerDto {
  @ApiProperty({ description: "Nombre del cliente", required: true })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: "Correo electrónico del cliente", required: true })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: "Nacionalidad del cliente", required: false })
  @IsOptional()
  nationality?: string;
}

class UpdateMyProfileDto {
  @ApiProperty({ description: "Nombre del cliente", required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: "Teléfono del cliente", required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: "Nacionalidad del cliente", required: false })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ description: "Pasaporte del cliente", required: false })
  @IsOptional()
  @IsString()
  passport?: string;

  @ApiProperty({ description: "Preferencias del cliente", required: false })
  @IsOptional()
  @IsString()
  preferences?: string;
}

@ApiTags("customers")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("customers")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Listar clientes" })
  findAll() {
    return this.customersService.findAll();
  }

  @Post()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Crear cliente" })
  create(@Body() body: CreateCustomerDto) {
    return this.customersService.create(body);
  }

  @Get("me")
  @Roles("ADMIN", "CLIENTE")
  @ApiOperation({ summary: "Mi perfil de cliente" })
  findMyProfile(@Req() req: AuthenticatedRequest) {
    return this.customersService.findByEmail(req.user.email);
  }

  @Patch("me")
  @Roles("ADMIN", "CLIENTE")
  @ApiOperation({ summary: "Actualizar mi perfil de cliente" })
  updateMyProfile(@Body() body: UpdateMyProfileDto, @Req() req: AuthenticatedRequest) {
    return this.customersService.updateByEmail(req.user.email, body);
  }

  @Get(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Obtener cliente por ID" })
  findOne(@Param("id") id: string) {
    return this.customersService.findOne(id);
  }
}
