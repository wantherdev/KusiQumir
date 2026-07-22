import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ description: "Correo electrónico del usuario", required: true })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: "Contraseña del usuario", required: true })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
