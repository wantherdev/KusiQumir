import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FindAllToursQueryDto {
  @ApiProperty({ description: "Límite de resultados", required: false })
  @IsOptional() @IsString() take?: string;
  @ApiProperty({ description: "Cursor para paginación", required: false })
  @IsOptional() @IsString() cursor?: string;
  @ApiProperty({ description: "Filtrar por dificultad", required: false })
  @IsOptional() @IsString() difficulty?: string;
}
