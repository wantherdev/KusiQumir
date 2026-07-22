import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateOperationDto {
  @ApiProperty({ description: "ID de la reserva", required: true })
  @IsNotEmpty()
  bookingId!: string;

  @ApiProperty({ description: "ID del guía asignado", required: false })
  @IsOptional()
  guideId?: string;

  @ApiProperty({ description: "Transporte de la operación", required: true })
  @IsNotEmpty()
  transport!: string;

  @ApiProperty({ description: "Hora de recogida", required: true })
  @IsNotEmpty()
  pickupTime!: string;
}
