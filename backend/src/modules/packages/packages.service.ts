import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.package.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, description: true, price: true, featured: true, durationDays: true, discount: true, imageUrl: true, included: true, excluded: true, createdAt: true, tours: { select: { id: true, name: true, adultPrice: true, durationText: true } } },
    });
  }

  findOne(id: string) {
    return this.prisma.package.findUnique({
      where: { id },
      select: { id: true, name: true, description: true, price: true, featured: true, durationDays: true, discount: true, imageUrl: true, included: true, excluded: true, createdAt: true, tours: { select: { id: true, name: true, adultPrice: true, durationText: true } } },
    });
  }

  create(payload: {
    name: string;
    description: string;
    tours: string[];
    price: number;
    featured?: boolean;
    durationDays?: number;
    discount?: number;
    imageUrl?: string;
    included?: string;
    excluded?: string;
  }) {
    return this.prisma.package.create({
      data: {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        featured: payload.featured ?? false,
        durationDays: payload.durationDays,
        discount: payload.discount,
        imageUrl: payload.imageUrl,
        included: payload.included,
        excluded: payload.excluded,
        tours: {
          connect: payload.tours.map((tourId) => ({ id: tourId })),
        },
      },
      select: { id: true, name: true, description: true, price: true, featured: true, durationDays: true, discount: true, imageUrl: true, included: true, excluded: true, createdAt: true, tours: { select: { id: true, name: true, adultPrice: true, durationText: true } } },
    });
  }

  update(
    id: string,
    payload: {
      name?: string;
      description?: string;
      tours?: string[];
      price?: number;
      featured?: boolean;
      durationDays?: number;
      discount?: number;
      imageUrl?: string;
      included?: string;
      excluded?: string;
    },
  ) {
    const data: Record<string, unknown> = {};

    if (payload.name !== undefined) data.name = payload.name;
    if (payload.description !== undefined) data.description = payload.description;
    if (payload.price !== undefined) data.price = payload.price;
    if (payload.featured !== undefined) data.featured = payload.featured;
    if (payload.durationDays !== undefined) data.durationDays = payload.durationDays;
    if (payload.discount !== undefined) data.discount = payload.discount;
    if (payload.imageUrl !== undefined) data.imageUrl = payload.imageUrl;
    if (payload.included !== undefined) data.included = payload.included;
    if (payload.excluded !== undefined) data.excluded = payload.excluded;

    if (payload.tours) {
      data.tours = {
        set: payload.tours.map((tourId) => ({ id: tourId })),
      };
    }

    return this.prisma.package.update({
      where: { id },
      data: data as any,
      select: { id: true, name: true, description: true, price: true, featured: true, durationDays: true, discount: true, imageUrl: true, included: true, excluded: true, createdAt: true, tours: { select: { id: true, name: true, adultPrice: true, durationText: true } } },
    });
  }

  remove(id: string) {
    return this.prisma.package.delete({
      where: { id },
      select: { id: true, name: true },
    });
  }
}