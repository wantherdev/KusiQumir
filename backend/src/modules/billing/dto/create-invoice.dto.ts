import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateInvoiceDto {
  @ApiProperty({ description: "ID de la reserva", required: true })
  @IsNotEmpty()
  bookingId!: string;

  @ApiProperty({ description: "Monto de la factura", required: true })
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty({ description: "Moneda de la factura", required: true })
  @IsNotEmpty()
  currency!: string;

  @ApiProperty({ description: "ID del cliente", required: true })
  @IsNotEmpty()
  customerId!: string;
}
