import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async getDashboard() {
    const [invoiceSum, bookingCount, customerCount, tourCount] =
      await Promise.all([
        this.prisma.invoice.aggregate({ _sum: { amount: true } }),
        this.prisma.booking.count(),
        this.prisma.customer.count(),
        this.prisma.tour.count(),
      ]);

    const totalSales = invoiceSum._sum.amount ?? 0;
    const totalBookings = bookingCount;
    const toursSold = tourCount;
    const clients = customerCount;
    const conversionRate =
      totalBookings > 0
        ? `${((totalBookings / Math.max(clients, 1)) * 100).toFixed(1)}%`
        : "0%";
    const commissionRate = this.config.get<number>("COMMISSION_RATE", 0.12);
    const commissions = Number((totalSales * commissionRate).toFixed(2));

    return {
      totalSales,
      totalBookings,
      toursSold,
      clients,
      conversionRate,
      commissions,
    };
  }
}
