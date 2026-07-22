import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateCustomerDto {
  @ApiProperty({ description: "Nombre del cliente", required: true })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: "Correo electrónico del cliente", required: true })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: "Nacionalidad del cliente", required: false })
  @IsOptional()
  nationality?: string;
}
