import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OperationsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly select = {
    id: true, bookingId: true, guideId: true, transport: true,
    pickupTime: true, status: true, createdAt: true,
    guide: { select: { id: true, name: true, languages: true } },
  };

  findAll() {
    return this.prisma.operation.findMany({
      select: {
        ...this.select,
        booking: {
          select: { id: true, customerName: true, customer: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  findOne(id: string) {
    return this.prisma.operation.findUnique({ where: { id }, select: this.select });
  }

  create(payload: {
    bookingId: string;
    guideId?: string;
    transport: string;
    pickupTime: string;
    status?: string;
  }) {
    return this.prisma.operation.create({
      data: {
        bookingId: payload.bookingId,
        guideId: payload.guideId,
        transport: payload.transport,
        pickupTime: payload.pickupTime,
        status: payload.status ?? "Confirmado",
      },
      select: this.select,
    });
  }

  update(id: string, payload: {
    guideId?: string;
    transport?: string;
    pickupTime?: string;
    status?: string;
  }) {
    const data: Record<string, unknown> = {};
    if (payload.guideId !== undefined) data.guideId = payload.guideId;
    if (payload.transport !== undefined) data.transport = payload.transport;
    if (payload.pickupTime !== undefined) data.pickupTime = payload.pickupTime;
    if (payload.status !== undefined) data.status = payload.status;
    return this.prisma.operation.update({ where: { id }, data: data as any, select: this.select });
  }
}
