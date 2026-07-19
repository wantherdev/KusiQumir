import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.provider.findMany({
      select: { id: true, name: true, type: true, contact: true },
    });
  }

  findOne(id: string) {
    return this.prisma.provider.findUnique({
      where: { id },
    });
  }

  create(payload: { name: string; type: string; contact: string }) {
    return this.prisma.provider.create({
      data: {
        name: payload.name,
        type: payload.type,
        contact: payload.contact,
      },
    });
  }
}
