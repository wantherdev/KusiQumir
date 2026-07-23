import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ClaimsService } from "./claims.service";
import { Public } from "../auth/public.decorator";
import { CreateClaimDto } from "./dto/create-claim.dto";

@ApiTags("claims")
@Controller("claims")
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: "Enviar reclamo (Libro de Reclamaciones)" })
  create(@Body() body: CreateClaimDto) {
    return this.claimsService.create(body);
  }
}
