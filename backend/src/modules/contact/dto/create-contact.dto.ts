import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsOptional } from "class-validator";

export class CreateContactDto {
  @ApiProperty({ description: "Nombre completo", required: true })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: "Correo electrónico", required: true })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: "Teléfono", required: false })
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: "Mensaje", required: true })
  @IsNotEmpty()
  message!: string;
}
