import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min, IsOptional, ValidateIf, IsString, IsEmail } from "class-validator";

export class CreateBookingDto {
  @ApiProperty({ description: "ID del tour", required: false })
  @ValidateIf((o) => !o.packageId)
  @IsNotEmpty()
  tourId?: string;

  @ApiProperty({ description: "ID del paquete", required: false })
  @ValidateIf((o) => !o.tourId)
  @IsNotEmpty()
  packageId?: string;

  @ApiProperty({ description: "Número de viajeros", required: true })
  @IsNumber()
  @Min(1)
  travelers!: number;

  @ApiProperty({ description: "Nombre del cliente", required: false })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({ description: "Correo del cliente", required: false })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiProperty({ description: "Teléfono del cliente", required: false })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({ description: "Fecha de inicio", required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ description: "Notas adicionales", required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
