import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly select = {
    id: true, name: true, type: true, contact: true,
    contract: true, commission: true, services: true, createdAt: true,
  };

  findAll() {
    return this.prisma.provider.findMany({ select: this.select });
  }

  findOne(id: string) {
    return this.prisma.provider.findUnique({ where: { id }, select: this.select });
  }

  create(payload: {
    name: string; type: string; contact: string;
    contract?: string; commission?: string; services?: string;
  }) {
    return this.prisma.provider.create({
      data: {
        name: payload.name,
        type: payload.type,
        contact: payload.contact,
        contract: payload.contract,
        commission: payload.commission,
        services: payload.services,
      },
      select: this.select,
    });
  }

  update(id: string, payload: Partial<{
    name: string; type: string; contact: string;
    contract?: string; commission?: string; services?: string;
  }>) {
    const data: Record<string, unknown> = {};
    if (payload.name !== undefined) data.name = payload.name;
    if (payload.type !== undefined) data.type = payload.type;
    if (payload.contact !== undefined) data.contact = payload.contact;
    if (payload.contract !== undefined) data.contract = payload.contract;
    if (payload.commission !== undefined) data.commission = payload.commission;
    if (payload.services !== undefined) data.services = payload.services;
    return this.prisma.provider.update({ where: { id }, data: data as any, select: this.select });
  }

  remove(id: string) {
    return this.prisma.provider.delete({ where: { id }, select: { id: true, name: true } });
  }
}
