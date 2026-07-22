import {
  Controller, Get, Post, Body, Param, UseGuards,
  Request, Patch, Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { BookingsService } from "./bookings.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { AuthenticatedRequest } from "../../common/authenticated-request";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingStatusDto } from "./dto/update-booking-status.dto";
import { FindAllBookingsQueryDto } from "./dto/find-all-bookings-query.dto";

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
  findAllAdmin(@Query() query: FindAllBookingsQueryDto) {
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
  updateStatus(@Param("id") id: string, @Body() body: UpdateBookingStatusDto) {
    return this.bookingsService.updateStatus(id, body.status);
  }
}
