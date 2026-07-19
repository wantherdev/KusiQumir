import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  getInvoices() {
    return this.prisma.invoice.findMany({
      select: { id: true, amount: true, status: true, createdAt: true },
    });
  }

  getInvoice(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id },
      select: { id: true, bookingId: true, customerId: true, amount: true, currency: true, status: true, createdAt: true },
    });
  }

  createInvoice(payload: {
    bookingId: string;
    amount: number;
    currency: string;
    customerId: string;
  }) {
    return this.prisma.invoice.create({
      data: {
        bookingId: payload.bookingId,
        customerId: payload.customerId,
        amount: payload.amount,
        currency: payload.currency,
      },
      select: { id: true, bookingId: true, customerId: true, amount: true, currency: true, status: true, createdAt: true },
    });
  }
}
