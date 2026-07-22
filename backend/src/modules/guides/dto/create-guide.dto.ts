import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ArrayNotEmpty, IsNotEmpty, IsString } from "class-validator";

export class CreateGuideDto {
  @ApiProperty({ description: "Nombre del guía", required: true })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: "Idiomas del guía", required: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  languages!: string[];

  @ApiProperty({ description: "Credencial del guía", required: true })
  @IsNotEmpty()
  credential!: string;
}
