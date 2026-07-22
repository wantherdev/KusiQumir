import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateMyProfileDto {
  @ApiProperty({ description: "Nombre del cliente", required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: "Teléfono del cliente", required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: "Nacionalidad del cliente", required: false })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ description: "Pasaporte del cliente", required: false })
  @IsOptional()
  @IsString()
  passport?: string;

  @ApiProperty({ description: "Preferencias del cliente", required: false })
  @IsOptional()
  @IsString()
  preferences?: string;
}
