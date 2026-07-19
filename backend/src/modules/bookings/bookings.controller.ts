import {
  Controller, Get, Post, Body, Param, UseGuards,
  Request, Patch, Query,
} from "@nestjs/common";
import { ApiProperty, ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import {
  IsNotEmpty, IsNumber, Min, IsOptional, ValidateIf, IsString, IsEmail,
} from "class-validator";
import { BookingsService } from "./bookings.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { AuthenticatedRequest } from "../../common/authenticated-request";

class CreateBookingDto {
  @ApiProperty({ description: "ID del tour", required: false })
  @ValidateIf((o) => !o.packageId)
  @IsNotEmpty()
  tourId?: string;

  @ApiProperty({ description: "ID del paquete", required: false })
  @ValidateIf((o) => !o.tourId)
  @IsNotEmpty()
  packageId?: string;

  @ApiProperty({ description: "Número de viajeros", required: true })
  @IsNumber()
  @Min(1)
  travelers!: number;

  @ApiProperty({ description: "Nombre del cliente", required: false })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({ description: "Correo del cliente", required: false })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiProperty({ description: "Teléfono del cliente", required: false })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({ description: "Fecha de inicio", required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ description: "Notas adicionales", required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

class FindAllBookingsQuery {
  @ApiProperty({ description: "Límite de resultados", required: false })
  @IsOptional() @IsString() take?: string;
  @ApiProperty({ description: "Cursor para paginación", required: false })
  @IsOptional() @IsString() cursor?: string;
  @ApiProperty({ description: "Filtrar por estado", required: false })
  @IsOptional() @IsString() status?: string;
  @ApiProperty({ description: "Filtrar por cliente", required: false })
  @IsOptional() @IsString() customerId?: string;
  @ApiProperty({ description: "Fecha desde", required: false })
  @IsOptional() @IsString() dateFrom?: string;
  @ApiProperty({ description: "Fecha hasta", required: false })
  @IsOptional() @IsString() dateTo?: string;
}

@ApiTags("bookings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Listar reservas (admin)" })
  @ApiQuery({ name: "take", required: false })
  @ApiQuery({ name: "cursor", required: false })
  @ApiQuery({ name: "status", required: false })
  @ApiQuery({ name: "customerId", required: false })
  findAllAdmin(@Query() query: FindAllBookingsQuery) {
    return this.bookingsService.findAllAdmin(query);
  }

  @Get("me")
  @Roles("ADMIN", "CLIENTE")
  @ApiOperation({ summary: "Mis reservas" })
  findAllMy(@Request() req: AuthenticatedRequest) {
    return this.bookingsService.findAllMy(req.user.email);
  }

  @Post()
  @Roles("ADMIN", "CLIENTE")
  @ApiOperation({ summary: "Crear reserva" })
  create(@Body() body: CreateBookingDto, @Request() req: AuthenticatedRequest) {
    return this.bookingsService.create(body, req.user);
  }

  @Get(":id")
  @Roles("ADMIN", "CLIENTE")
  @ApiOperation({ summary: "Obtener reserva por ID" })
  findOne(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    return this.bookingsService.findOne(id, req.user);
  }

  @Post(":id/cancel")
  @Roles("ADMIN", "CLIENTE")
  @ApiOperation({ summary: "Cancelar reserva" })
  cancel(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    return this.bookingsService.cancel(id, req.user);
  }

  @Patch(":id/status")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Actualizar estado de reserva (admin)" })
  updateStatus(@Param("id") id: string, @Body("status") status: string) {
    return this.bookingsService.updateStatus(id, status);
  }
}
