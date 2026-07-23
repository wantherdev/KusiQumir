import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { GuidesService } from "./guides.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CreateGuideDto } from "./dto/create-guide.dto";
import { UpdateGuideDto } from "./dto/update-guide.dto";

@ApiTags("guides")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("guides")
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Listar guías turísticos" })
  findAll() {
    return this.guidesService.findAll();
  }

  @Post()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Crear guía turístico" })
  create(@Body() body: CreateGuideDto) {
    return this.guidesService.create(body);
  }

  @Get(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Obtener guía por ID" })
  findOne(@Param("id") id: string) {
    return this.guidesService.findOne(id);
  }

  @Patch(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Actualizar guía turístico" })
  update(@Param("id") id: string, @Body() body: UpdateGuideDto) {
    return this.guidesService.update(id, body);
  }

  @Delete(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Eliminar guía turístico" })
  remove(@Param("id") id: string) {
    return this.guidesService.remove(id);
  }
}
