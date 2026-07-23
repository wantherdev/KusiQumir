import { Controller, Get, Post, Patch, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { OperationsService } from "./operations.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CreateOperationDto } from "./dto/create-operation.dto";
import { UpdateOperationDto } from "./dto/update-operation.dto";

@ApiTags("operations")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("operations")
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get()
  @ApiOperation({ summary: "Listar operaciones" })
  findAll() {
    return this.operationsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: "Crear operación de reserva" })
  create(@Body() body: CreateOperationDto) {
    return this.operationsService.create(body);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener operación por ID" })
  findOne(@Param("id") id: string) {
    return this.operationsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar operación" })
  update(@Param("id") id: string, @Body() body: UpdateOperationDto) {
    return this.operationsService.update(id, body);
  }
}
