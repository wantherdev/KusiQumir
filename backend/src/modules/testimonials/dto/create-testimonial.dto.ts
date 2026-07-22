import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional, IsBoolean, IsArray, IsInt } from "class-validator";

export class CreateTestimonialDto {
  @ApiProperty({ description: "Nombre del autor", required: true })
  @IsNotEmpty() @IsString() name!: string;

  @ApiProperty({ description: "Rol del autor (ej: Viajera frecuente)", required: false })
  @IsOptional() @IsString() role?: string;

  @ApiProperty({ description: "Contenido del testimonio", required: true })
  @IsNotEmpty() @IsString() content!: string;

  @ApiProperty({ description: "Correo electrónico del autor (opcional)", required: false })
  @IsOptional() @IsString() email?: string;

  @ApiProperty({ description: "URL del avatar", required: false })
  @IsOptional() @IsString() avatar?: string;

  @ApiProperty({ description: "Calificación (1-5)", required: true })
  @IsNumber() @Min(1) @Max(5) rating!: number;

  @ApiProperty({ description: "Tags de referencia", required: false, type: [String] })
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];

  @ApiProperty({ description: "Destacado en homepage", required: false })
  @IsOptional() @IsBoolean() featured?: boolean;

  @ApiProperty({ description: "Orden de aparición", required: false })
  @IsOptional() @IsInt() sortOrder?: number;

  @ApiProperty({ description: "Activo (requiere revisión admin)", required: false })
  @IsOptional() @IsBoolean() active?: boolean;

  @ApiProperty({ description: "ID del tour relacionado (opcional)", required: false })
  @IsOptional() @IsString() tourId?: string;

  @ApiProperty({ description: "Metadatos de consentimiento (privacidad, publicación, etc.)", required: false })
  @IsOptional() consent?: Record<string, unknown>;
}
