import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class GuidesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.guide.findMany({
      select: { id: true, name: true, languages: true, credential: true },
    });
  }

  findOne(id: string) {
    return this.prisma.guide.findUnique({
      where: { id },
      select: { id: true, name: true, languages: true, credential: true, createdAt: true },
    });
  }

  create(payload: { name: string; languages: string[]; credential: string }) {
    return this.prisma.guide.create({
      data: {
        name: payload.name,
        languages: payload.languages.join(","),
        credential: payload.credential,
      },
    });
  }
}
