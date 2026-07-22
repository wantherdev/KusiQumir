import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FindAllBookingsQueryDto {
  @ApiProperty({ description: "Límite de resultados", required: false })
  @IsOptional() @IsString() take?: string;

  @ApiProperty({ description: "Cursor para paginación", required: false })
  @IsOptional() @IsString() cursor?: string;

  @ApiProperty({ description: "Filtrar por estado", required: false })
  @IsOptional() @IsString() status?: string;

  @ApiProperty({ description: "Filtrar por cliente", required: false })
  @IsOptional() @IsString() customerId?: string;

  @ApiProperty({ description: "Fecha desde", required: false })
  @IsOptional() @IsString() dateFrom?: string;

  @ApiProperty({ description: "Fecha hasta", required: false })
  @IsOptional() @IsString() dateTo?: string;
}
