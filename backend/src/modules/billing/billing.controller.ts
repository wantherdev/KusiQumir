import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { BillingService } from "./billing.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

class CreateInvoiceDto {
  @IsNotEmpty()
  bookingId!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsNotEmpty()
  currency!: string;

  @IsNotEmpty()
  customerId!: string;
}

@ApiTags("billing")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get("invoices")
  @ApiOperation({ summary: "Listar facturas" })
  getInvoices() {
    return this.billingService.getInvoices();
  }

  @Post("invoices")
  @ApiOperation({ summary: "Crear factura electrónica" })
  createInvoice(@Body() body: CreateInvoiceDto) {
    return this.billingService.createInvoice(body);
  }

  @Get("invoices/:id")
  @ApiOperation({ summary: "Obtener factura por ID" })
  getInvoice(@Param("id") id: string) {
    return this.billingService.getInvoice(id);
  }
}
