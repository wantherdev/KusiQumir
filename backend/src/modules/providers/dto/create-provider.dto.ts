import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

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
}
