import {
  Controller, Get, Post, Body, Param, UseGuards,
  Patch, Delete,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { TestimonialsService } from "./testimonials.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Public } from "../auth/public.decorator";
import { CreateTestimonialDto } from "./dto/create-testimonial.dto";
import { UpdateTestimonialDto } from "./dto/update-testimonial.dto";

@ApiTags("testimonials")
@Controller("testimonials")
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Public()
  @Get("featured")
  @ApiOperation({ summary: "Listar testimonios destacados (público)" })
  findFeatured() {
    return this.testimonialsService.findFeatured();
  }

  @Public()
  @Get("tags")
  @ApiOperation({ summary: "Listar todos los tags disponibles" })
  getTags() {
    return this.testimonialsService.getAllTags();
  }

  @Public()
  @Post()
  @ApiOperation({ summary: "Enviar testimonio desde formulario público (requiere revisión)" })
  createPublic(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create(dto, true);
  }

  @Get("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Listar todos los testimonios (admin)" })
  findAllAdmin() {
    return this.testimonialsService.findAllAdmin();
  }

  @Get("admin/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtener testimonio por ID (admin)" })
  findOneAdmin(@Param("id") id: string) {
    return this.testimonialsService.findOneAdmin(id);
  }

  @Post("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Crear testimonio (admin)" })
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create(dto);
  }

  @Patch("admin/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Actualizar testimonio (admin)" })
  update(@Param("id") id: string, @Body() dto: UpdateTestimonialDto) {
    return this.testimonialsService.update(id, dto);
  }

  @Delete("admin/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Eliminar testimonio (admin)" })
  remove(@Param("id") id: string) {
    return this.testimonialsService.remove(id);
  }
}
