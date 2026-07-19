import {
  Controller, Get, Post, Body, Param, UseGuards,
  Request, Patch, Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import {
  IsNotEmpty, IsNumber, Min, IsOptional, ValidateIf, IsString, IsEmail,
} from "class-validator";
import { BookingsService } from "./bookings.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { AuthenticatedRequest } from "../../common/authenticated-request";

class CreateBookingDto {
  @ValidateIf((o) => !o.packageId)
  @IsNotEmpty()
  tourId?: string;

  @ValidateIf((o) => !o.tourId)
  @IsNotEmpty()
  packageId?: string;

  @IsNumber()
  @Min(1)
  travelers!: number;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

class FindAllBookingsQuery {
  @IsOptional() @IsString() take?: string;
  @IsOptional() @IsString() cursor?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() customerId?: string;
  @IsOptional() @IsString() dateFrom?: string;
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
