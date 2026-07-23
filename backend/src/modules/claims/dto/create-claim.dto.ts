import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsOptional } from "class-validator";

export class CreateClaimDto {
  @ApiProperty({ description: "Nombre completo", required: true })
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({ description: "Documento de identidad", required: true })
  @IsNotEmpty()
  documento!: string;

  @ApiProperty({ description: "Correo electrónico", required: true })
  @IsEmail()
  @IsNotEmpty()
  correo!: string;

  @ApiProperty({ description: "Teléfono", required: false })
  @IsOptional()
  telefono?: string;

  @ApiProperty({ description: "Servicio contratado", required: false })
  @IsOptional()
  servicio?: string;

  @ApiProperty({ description: "Código de reserva", required: false })
  @IsOptional()
  reserva?: string;

  @ApiProperty({ description: "Fecha del servicio", required: false })
  @IsOptional()
  fechaServicio?: string;

  @ApiProperty({ description: "Motivo del reclamo", required: true })
  @IsNotEmpty()
  motivo!: string;

  @ApiProperty({ description: "Descripción detallada", required: true })
  @IsNotEmpty()
  descripcion!: string;

  @ApiProperty({ description: "Documentos adjuntos", required: false })
  @IsOptional()
  documentos?: string;

  @ApiProperty({ description: "Permitir contacto", required: false })
  @IsOptional()
  permitirContacto?: boolean;
}
