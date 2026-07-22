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
import { PackagesService } from "./packages.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Public } from "../auth/public.decorator";
import { CreatePackageDto } from "./dto/create-package.dto";
import { UpdatePackageDto } from "./dto/update-package.dto";

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

  @Get("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Listar paquetes (admin)" })
  findAllAdmin() {
    return this.packagesService.findAll();
  }

  @Post("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Crear paquete turístico" })
  create(@Body() body: CreatePackageDto) {
    return this.packagesService.create(body);
  }

  @Patch("admin/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Actualizar paquete turístico" })
  update(@Param("id") id: string, @Body() body: UpdatePackageDto) {
    return this.packagesService.update(id, body);
  }

  @Delete("admin/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Eliminar paquete turístico" })
  remove(@Param("id") id: string) {
    return this.packagesService.remove(id);
  }
}
