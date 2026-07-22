import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { LegalService } from "./legal.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Public } from "../auth/public.decorator";
import { AuthenticatedRequest } from "../../common/authenticated-request";
import { AcceptDocumentDto } from "./dto/accept-document.dto";

@ApiTags("legal")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("legal")
export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  @Public()
  @Get("documents")
  @ApiOperation({ summary: "Listar documentos legales" })
  getDocuments() {
    return this.legalService.getDocuments();
  }

  @Post("accept")
  @Roles("CLIENTE")
  @ApiOperation({ summary: "Aceptar documento legal" })
  acceptDocument(@Body() body: AcceptDocumentDto, @Request() req: AuthenticatedRequest) {
    return this.legalService.acceptDocument(body, req.user);
  }

  @Get("acceptances/:id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Obtener aceptación por ID" })
  getAcceptance(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    return this.legalService.getAcceptance(id, req.user);
  }
}
