import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { PaymentsService } from "./payments.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { AuthenticatedRequest } from "../../common/authenticated-request";
import { CreatePaymentDto } from "./dto/create-payment.dto";

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
