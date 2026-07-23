import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class GuidesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly select = {
    id: true, name: true, languages: true, credential: true,
    availability: true, rating: true, createdAt: true,
  };

  findAll() {
    return this.prisma.guide.findMany({ select: this.select });
  }

  findOne(id: string) {
    return this.prisma.guide.findUnique({ where: { id }, select: this.select });
  }

  create(payload: {
    name: string; languages: string[]; credential: string;
    availability?: boolean; rating?: number;
  }) {
    return this.prisma.guide.create({
      data: {
        name: payload.name,
        languages: payload.languages.join(","),
        credential: payload.credential,
        availability: payload.availability ?? true,
        rating: payload.rating ?? 0,
      },
      select: this.select,
    });
  }

  update(id: string, payload: {
    name?: string; languages?: string[]; credential?: string;
    availability?: boolean; rating?: number;
  }) {
    const data: Record<string, unknown> = {};
    if (payload.name !== undefined) data.name = payload.name;
    if (payload.languages !== undefined) data.languages = payload.languages.join(",");
    if (payload.credential !== undefined) data.credential = payload.credential;
    if (payload.availability !== undefined) data.availability = payload.availability;
    if (payload.rating !== undefined) data.rating = payload.rating;
    return this.prisma.guide.update({ where: { id }, data: data as any, select: this.select });
  }

  remove(id: string) {
    return this.prisma.guide.delete({ where: { id }, select: { id: true, name: true } });
  }
}
