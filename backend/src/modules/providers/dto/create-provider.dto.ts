import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateProviderDto {
  @ApiProperty({ description: "Nombre del proveedor", required: true })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: "Tipo de proveedor", required: true })
  @IsNotEmpty()
  type!: string;

  @ApiProperty({ description: "Contacto del proveedor", required: true })
  @IsNotEmpty()
  contact!: string;

  @ApiProperty({ description: "Detalles del contrato", required: false })
  @IsOptional()
  contract?: string;

  @ApiProperty({ description: "Comisión", required: false })
  @IsOptional()
  commission?: string;

  @ApiProperty({ description: "Servicios que ofrece", required: false })
  @IsOptional()
  services?: string;
}
