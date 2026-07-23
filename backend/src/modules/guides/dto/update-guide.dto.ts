import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ArrayNotEmpty, IsNotEmpty, IsString, IsBoolean, IsNumber, Min, Max, IsOptional } from "class-validator";

export class UpdateGuideDto {
  @ApiProperty({ description: "Nombre del guía", required: false })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ description: "Idiomas del guía", required: false })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  languages?: string[];

  @ApiProperty({ description: "Credencial del guía", required: false })
  @IsOptional()
  @IsNotEmpty()
  credential?: string;

  @ApiProperty({ description: "Disponible", required: false })
  @IsOptional()
  @IsBoolean()
  availability?: boolean;

  @ApiProperty({ description: "Valoración (0-5)", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;
}
