import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateOperationDto {
  @ApiProperty({ description: "ID del guía asignado", required: false })
  @IsOptional()
  guideId?: string;

  @ApiProperty({ description: "Transporte de la operación", required: false })
  @IsOptional()
  transport?: string;

  @ApiProperty({ description: "Hora de recogida", required: false })
  @IsOptional()
  pickupTime?: string;

  @ApiProperty({ description: "Estado de la operación", required: false })
  @IsOptional()
  status?: string;
}
