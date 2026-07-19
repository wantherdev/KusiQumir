import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { OperationsService } from "./operations.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

class CreateOperationDto {
  @IsNotEmpty()
  bookingId!: string;

  @IsOptional()
  guideId?: string;

  @IsNotEmpty()
  transport!: string;

  @IsNotEmpty()
  pickupTime!: string;
}

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
}
