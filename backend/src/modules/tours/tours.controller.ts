import {
  Controller, Get, Post, Body, Param, UseGuards,
  Patch, Delete, Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { ToursService } from "./tours.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Public } from "../auth/public.decorator";
import { CreateTourDto } from "./dto/create-tour.dto";
import { UpdateTourDto } from "./dto/update-tour.dto";
import { FindAllToursQueryDto } from "./dto/find-all-tours-query.dto";

@ApiTags("tours")
@Controller("tours")
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Listar tours públicos" })
  @ApiQuery({ name: "take", required: false })
  @ApiQuery({ name: "cursor", required: false })
  @ApiQuery({ name: "difficulty", required: false })
  findAll(@Query() query: FindAllToursQueryDto) {
    return this.toursService.findAllPublic(query);
  }

  @Get("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Listar todos los tours (admin)" })
  findAllAdmin() {
    return this.toursService.findAllAdmin();
  }

  @Public()
  @Get("slug/:slug")
  @ApiOperation({ summary: "Obtener tour por slug" })
  findBySlug(@Param("slug") slug: string) {
    return this.toursService.findBySlug(slug);
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Obtener tour por ID" })
  findOne(@Param("id") id: string) {
    return this.toursService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Crear tour (admin)" })
  create(@Body() body: CreateTourDto) {
    return this.toursService.create(body as any);
  }

  @Post("bulk")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Crear tours en masa desde un arreglo JSON (admin)" })
  createBulk(@Body() body: { tours: CreateTourDto[] }) {
    return this.toursService.bulkCreate(body.tours as any);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Actualizar tour (admin)" })
  update(@Param("id") id: string, @Body() body: UpdateTourDto) {
    return this.toursService.update(id, body as any);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Eliminar tour (admin)" })
  remove(@Param("id") id: string) {
    return this.toursService.remove(id);
  }
}
