import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTestimonialDto } from "./dto/create-testimonial.dto";
import { UpdateTestimonialDto } from "./dto/update-testimonial.dto";

@Injectable()
export class TestimonialsService {
  constructor(private readonly prisma: PrismaService) {}

  findAllAdmin() {
    return this.prisma.testimonial.findMany({
      orderBy: { sortOrder: "asc" },
      include: { tour: { select: { id: true, title: true } } },
    });
  }

  findFeatured() {
    return this.prisma.testimonial.findMany({
      where: { featured: true, active: true },
      orderBy: { sortOrder: "asc" },
      include: { tour: { select: { id: true, title: true, slug: true } } },
    });
  }

  findOneAdmin(id: string) {
    return this.prisma.testimonial.findUnique({
      where: { id },
      include: { tour: { select: { id: true, title: true, slug: true } } },
    });
  }

  async create(dto: CreateTestimonialDto, isPublic = false) {
    return this.prisma.testimonial.create({
      data: {
        name: dto.name,
        role: dto.role,
        content: dto.content,
        email: dto.email,
        avatar: dto.avatar,
        rating: dto.rating,
        tags: dto.tags ?? [],
        featured: isPublic ? false : (dto.featured ?? false),
        sortOrder: dto.sortOrder ?? 0,
        active: isPublic ? false : (dto.active ?? true),
        tourId: dto.tourId,
        consent: dto.consent as any,
      },
      include: { tour: { select: { id: true, title: true } } },
    });
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    const existing = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Testimonio no encontrado");

    return this.prisma.testimonial.update({
      where: { id },
      data: {
        name: dto.name,
        role: dto.role,
        content: dto.content,
        avatar: dto.avatar,
        rating: dto.rating,
        tags: dto.tags,
        featured: dto.featured,
        sortOrder: dto.sortOrder,
        active: dto.active,
        tourId: dto.tourId,
      },
      include: { tour: { select: { id: true, title: true } } },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Testimonio no encontrado");

    return this.prisma.testimonial.delete({ where: { id } });
  }

  getDefaultTags() {
    return [
      "Agencia KusiQumir",
      "City Tour",
      "Camino Inca",
      "Guía",
      "Transporte",
      "Alojamiento",
      "Experiencia General",
    ];
  }

  async getAllTags() {
    const testimonials = await this.prisma.testimonial.findMany({
      select: { tags: true },
    });
    const dbTags = [...new Set(testimonials.flatMap((t) => t.tags))];
    const defaults = this.getDefaultTags();
    return [...new Set([...defaults, ...dbTags])];
  }
}
