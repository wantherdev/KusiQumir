import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateBookingStatusDto {
  @ApiProperty({
    description: "Nuevo estado de la reserva",
    required: true,
    enum: ["PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"],
  })
  @IsNotEmpty()
  @IsString()
  status!: string;
}
