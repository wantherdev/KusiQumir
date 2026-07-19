import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiProperty, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { PaymentsService } from "./payments.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { AuthenticatedRequest } from "../../common/authenticated-request";

class CreatePaymentDto {
  @ApiProperty({ description: "ID de la reserva", required: true })
  @IsNotEmpty()
  bookingId!: string;

  @ApiProperty({ description: "Monto del pago", required: true })
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty({ description: "Moneda del pago", required: true })
  @IsNotEmpty()
  currency!: string;
}

@ApiTags("payments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Listar pagos" })
  findAll(@Request() req: AuthenticatedRequest) {
    return this.paymentsService.findAll(req.user);
  }

  @Post()
  @Roles("ADMIN", "CLIENTE")
  @ApiOperation({ summary: "Registrar pago" })
  create(@Body() body: CreatePaymentDto, @Request() req: AuthenticatedRequest) {
    return this.paymentsService.create(body, req.user);
  }

  @Get(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Obtener pago por ID" })
  findOne(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    return this.paymentsService.findOne(id, req.user);
  }
}
