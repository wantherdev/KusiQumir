import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreatePaymentDto {
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
