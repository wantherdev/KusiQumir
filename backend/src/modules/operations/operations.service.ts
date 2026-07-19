import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OperationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.operation.findMany({
      select: { id: true, status: true, transport: true, pickupTime: true, createdAt: true },
    });
  }

  findOne(id: string) {
    return this.prisma.operation.findUnique({
      where: { id },
    });
  }

  create(payload: {
    bookingId: string;
    guideId?: string;
    transport: string;
    pickupTime: string;
  }) {
    return this.prisma.operation.create({
      data: {
        bookingId: payload.bookingId,
        guideId: payload.guideId,
        transport: payload.transport,
        pickupTime: payload.pickupTime,
        status: "Confirmado",
      },
    });
  }
}
