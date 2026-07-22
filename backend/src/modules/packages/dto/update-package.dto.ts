import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ArrayNotEmpty, IsNotEmpty, IsNumber, IsString, Min, IsOptional } from "class-validator";

export class UpdatePackageDto {
  @ApiProperty({ description: "Nombre del paquete", required: false })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ description: "Descripción del paquete", required: false })
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ description: "IDs de los tours incluidos", required: false })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  tours?: string[];

  @ApiProperty({ description: "Precio del paquete", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ description: "Destacado", required: false })
  @IsOptional()
  featured?: boolean;

  @ApiProperty({ description: "Duración en días", required: false })
  @IsOptional()
  @IsNumber()
  durationDays?: number;

  @ApiProperty({ description: "Descuento", required: false })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({ description: "URL de la imagen", required: false })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: "Incluye", required: false })
  @IsOptional()
  included?: string;

  @ApiProperty({ description: "Excluye", required: false })
  @IsOptional()
  excluded?: string;

  @ApiProperty({ description: "Slug URL", required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ description: "SEO Title", required: false })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiProperty({ description: "SEO Description", required: false })
  @IsOptional()
  @IsString()
  seoDescription?: string;
}
