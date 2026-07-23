import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ContactService } from "./contact.service";
import { Public } from "../auth/public.decorator";
import { CreateContactDto } from "./dto/create-contact.dto";

@ApiTags("contact")
@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: "Enviar mensaje de contacto" })
  create(@Body() body: CreateContactDto) {
    return this.contactService.create(body);
  }
}
