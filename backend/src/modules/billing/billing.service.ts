import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  getInvoices() {
    return this.prisma.invoice.findMany();
  }

  getInvoice(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id },
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
    });
  }
}
