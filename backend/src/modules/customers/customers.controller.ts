import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CustomersService } from "./customers.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { AuthenticatedRequest } from "../../common/authenticated-request";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateMyProfileDto } from "./dto/update-my-profile.dto";

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
