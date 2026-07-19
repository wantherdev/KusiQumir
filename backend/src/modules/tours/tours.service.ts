import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

const tourListSelect = {
  id: true,
  slug: true,
  name: true,
  subtitle: true,
  shortDescription: true,
  adultPrice: true,
  childPrice: true,
  discount: true,
  currency: true,
  durationDays: true,
  durationHours: true,
  durationText: true,
  difficulty: true,
  coverImage: true,
  country: true,
  region: true,
  city: true,
  featured: true,
  status: true,
  createdAt: true,
} satisfies Prisma.TourSelect;

const tourDetailSelect = {
  id: true,
  slug: true,
  name: true,
  subtitle: true,
  shortDescription: true,
  description: true,
  adultPrice: true,
  childPrice: true,
  discount: true,
  currency: true,
  durationDays: true,
  durationHours: true,
  durationText: true,
  difficulty: true,
  coverImage: true,
  video: true,
  country: true,
  region: true,
  city: true,
  meetingPoint: true,
  endingPoint: true,
  pickup: true,
  startTime: true,
  endTime: true,
  altitudeMin: true,
  altitudeMax: true,
  groupType: true,
  featured: true,
  status: true,
  seoTitle: true,
  seoDescription: true,
  seoKeywords: true,
  providerId: true,
  createdAt: true,
  updatedAt: true,
  languages: true,
  highlights: true,
  itinerary: true,
  destinations: true,
  includes: true,
  notIncludes: true,
  recommendations: true,
  requirements: true,
  whatToBring: true,
  faqs: true,
  images: true,
  provider: true,
  packages: true,
} satisfies Prisma.TourSelect;

@Injectable()
export class ToursService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublic(query: {
    take?: string;
    cursor?: string;
    status?: string;
    difficulty?: string;
    country?: string;
    region?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
  }) {
    const take = Math.min(Math.max(1, Number(query.take) || 20), 100);

    const where: Prisma.TourWhereInput = {
      status: "published",
    };

    if (query.status) {
      where.status = query.status;
    }
    if (query.difficulty) {
      where.difficulty = query.difficulty;
    }
    if (query.country) {
      where.country = { contains: query.country, mode: "insensitive" };
    }
    if (query.region) {
      where.region = { contains: query.region, mode: "insensitive" };
    }
    if (query.city) {
      where.city = { contains: query.city, mode: "insensitive" };
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.adultPrice = {} as Prisma.FloatFilter;
      if (query.minPrice !== undefined) {
        (where.adultPrice as Prisma.FloatFilter).gte = Number(query.minPrice);
      }
      if (query.maxPrice !== undefined) {
        (where.adultPrice as Prisma.FloatFilter).lte = Number(query.maxPrice);
      }
    }

    const items = await this.prisma.tour.findMany({
      take: take + 1,
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
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
      where: { id, status: "published" },
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

  async findBySlug(slug: string) {
    const tour = await this.prisma.tour.findFirst({
      where: { slug, status: "published" },
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
      data: { status: "archived" },
    });
  }
}

interface TourPayload {
  slug: string;
  name: string;
  subtitle?: string;
  shortDescription?: string;
  description: string;
  category: string;
  tourType: string;
  durationDays: number;
  durationHours: number;
  durationText: string;
  country: string;
  region: string;
  city: string;
  meetingPoint?: string;
  endingPoint?: string;
  pickup?: boolean;
  startTime?: string;
  endTime?: string;
  difficulty?: string;
  altitudeMin?: number;
  altitudeMax?: number;
  groupType?: string;
  featured?: boolean;
  status?: string;
  coverImage?: string;
  video?: string;
  currency?: string;
  adultPrice?: number;
  childPrice?: number;
  discount?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: Prisma.InputJsonValue;
  providerId?: string;
  sourceUrl?: string;
  languages?: Prisma.TourLanguageCreateNestedManyWithoutTourInput;
  highlights?: Prisma.HighlightCreateNestedManyWithoutTourInput;
  itinerary?: Prisma.ItineraryCreateNestedManyWithoutTourInput;
  destinations?: Prisma.DestinationCreateNestedManyWithoutTourInput;
  includes?: Prisma.IncludeCreateNestedManyWithoutTourInput;
  notIncludes?: Prisma.NotIncludeCreateNestedManyWithoutTourInput;
  recommendations?: Prisma.RecommendationCreateNestedManyWithoutTourInput;
  requirements?: Prisma.RequirementCreateNestedManyWithoutTourInput;
  whatToBring?: Prisma.WhatToBringCreateNestedManyWithoutTourInput;
  faqs?: Prisma.FAQItemCreateNestedManyWithoutTourInput;
  images?: Prisma.ImageCreateNestedManyWithoutTourInput;
}