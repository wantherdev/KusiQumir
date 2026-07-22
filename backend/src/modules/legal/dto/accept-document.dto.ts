import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsIP } from "class-validator";

export class AcceptDocumentDto {
  @ApiProperty({ description: "ID del documento legal", required: true })
  @IsNotEmpty()
  documentId!: string;

  @ApiProperty({ description: "ID del cliente", required: true })
  @IsNotEmpty()
  clientId!: string;

  @ApiProperty({ description: "Dirección IP del cliente", required: true })
  @IsIP()
  ip!: string;

  @ApiProperty({ description: "Versión del documento", required: true })
  @IsNotEmpty()
  version!: string;
}
