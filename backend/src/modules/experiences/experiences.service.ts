import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateExperienceDto, UpdateExperienceDto } from "./experiences.controller";

const experienceListSelect = {
  id: true, slug: true, title: true, summary: true, coverImage: true,
  imageAlt: true, location: true, duration: true, tourId: true,
  featured: true, status: true, publishedAt: true, sortOrder: true,
  createdAt: true, updatedAt: true,
} satisfies Prisma.ExperienceSelect;

@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublic(query: {
    take?: string; cursor?: string; featured?: string; location?: string;
  }) {
    const take = Math.min(Math.max(1, Number(query.take) || 12), 50);
    const where: Prisma.ExperienceWhereInput = {
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
    };
    if (query.featured !== undefined) where.featured = query.featured === "true";
    if (query.location) where.location = { contains: query.location };

    const items = await this.prisma.experience.findMany({
      take: take + 1,
      where,
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { publishedAt: "desc" }],
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      select: experienceListSelect,
    });

    const hasMore = items.length > take;
    if (hasMore) items.pop();
    return { items, nextCursor: hasMore ? items[items.length - 1]!.id : null };
  }

  async findBySlug(slug: string) {
    const experience = await this.prisma.experience.findFirst({
      where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } },
      select: { id: true, slug: true, title: true, summary: true, content: true, coverImage: true, imageAlt: true, location: true, duration: true, tourId: true, featured: true, status: true, publishedAt: true, sortOrder: true, createdAt: true, updatedAt: true, tour: { select: { id: true, name: true, price: true, duration: true } } },
    });
    if (!experience) throw new NotFoundException("Experiencia no encontrada");
    return experience;
  }

  async findAllAdmin() {
    return this.prisma.experience.findMany({
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      select: { id: true, slug: true, title: true, summary: true, content: true, coverImage: true, imageAlt: true, location: true, duration: true, tourId: true, featured: true, status: true, publishedAt: true, sortOrder: true, createdAt: true, updatedAt: true },
    });
  }

  async findOneAdmin(id: string) {
    const exp = await this.prisma.experience.findUnique({
      where: { id },
      select: { id: true, slug: true, title: true, summary: true, content: true, coverImage: true, imageAlt: true, location: true, duration: true, tourId: true, featured: true, status: true, publishedAt: true, sortOrder: true, createdAt: true, updatedAt: true },
    });
    if (!exp) throw new NotFoundException("Experiencia no encontrada");
    return exp;
  }

  create(data: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: data as any,
      select: { id: true, slug: true, title: true, summary: true, content: true, coverImage: true, imageAlt: true, location: true, duration: true, tourId: true, featured: true, status: true, publishedAt: true, sortOrder: true, createdAt: true, updatedAt: true },
    });
  }

  async update(id: string, data: UpdateExperienceDto) {
    await this.findOneAdmin(id);
    return this.prisma.experience.update({
      where: { id },
      data: data as any,
      select: { id: true, slug: true, title: true, summary: true, content: true, coverImage: true, imageAlt: true, location: true, duration: true, tourId: true, featured: true, status: true, publishedAt: true, sortOrder: true, createdAt: true, updatedAt: true },
    });
  }

  async remove(id: string) {
    await this.findOneAdmin(id);
    return this.prisma.experience.delete({
      where: { id },
      select: { id: true, slug: true, title: true },
    });
  }
}
