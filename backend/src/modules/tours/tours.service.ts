import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

const tourListSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  duration: true,
  difficulty: true,
  images: true,
  location: true,
  availability: true,
  createdAt: true,
} satisfies Prisma.TourSelect;

const tourDetailSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  duration: true,
  difficulty: true,
  images: true,
  itinerary: true,
  includes: true,
  excludes: true,
  location: true,
  availability: true,
  providerId: true,
  createdAt: true,
} satisfies Prisma.TourSelect;

@Injectable()
export class ToursService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublic(query: {
    take?: string;
    cursor?: string;
    availability?: string;
    difficulty?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
  }) {
    const take = Math.min(Math.max(1, Number(query.take) || 20), 100);

    const where: Prisma.TourWhereInput = { deletedAt: null };

    if (query.availability !== undefined) {
      where.availability = query.availability === "true";
    }
    if (query.difficulty) {
      where.difficulty = query.difficulty;
    }
    if (query.location) {
      where.location = { contains: query.location };
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {} as Prisma.FloatFilter;
      if (query.minPrice !== undefined) {
        (where.price as Prisma.FloatFilter).gte = Number(query.minPrice);
      }
      if (query.maxPrice !== undefined) {
        (where.price as Prisma.FloatFilter).lte = Number(query.maxPrice);
      }
    }

    const items = await this.prisma.tour.findMany({
      take: take + 1,
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      select: tourListSelect,
    });

    const hasMore = items.length > take;
    if (hasMore) items.pop();

    return { items, nextCursor: hasMore ? items[items.length - 1]!.id : null };
  }

  async findAllAdmin() {
    return this.prisma.tour.findMany({
      orderBy: { createdAt: "desc" },
      select: tourDetailSelect,
    });
  }

  async findOne(id: string) {
    const tour = await this.prisma.tour.findFirst({
      where: { id, deletedAt: null },
      select: tourDetailSelect,
    });
    if (!tour) {
      throw new NotFoundException("Tour no encontrado");
    }
    return tour;
  }

  async findOneAdmin(id: string) {
    const tour = await this.prisma.tour.findUnique({
      where: { id },
      select: tourDetailSelect,
    });
    if (!tour) {
      throw new NotFoundException("Tour no encontrado");
    }
    return tour;
  }

  create(payload: TourPayload) {
    return this.prisma.tour.create({ data: payload, select: tourDetailSelect });
  }

  async update(id: string, payload: Partial<TourPayload>) {
    await this.findOneAdmin(id);
    return this.prisma.tour.update({
      where: { id },
      data: payload,
      select: tourDetailSelect,
    });
  }

  async remove(id: string) {
    await this.findOneAdmin(id);
    return this.prisma.tour.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

interface TourPayload {
  name: string;
  description: string;
  price: number;
  duration: string;
  images?: string;
  difficulty?: string;
  itinerary?: string;
  includes?: string;
  excludes?: string;
  location?: string;
  availability?: boolean;
  providerId?: string;
}
