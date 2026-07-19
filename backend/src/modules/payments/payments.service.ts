import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user?: { userId: string; email?: string; role?: string }) {
    if (!user || user.role === "ADMIN") {
      return this.prisma.payment.findMany({
        select: { id: true, amount: true, status: true, createdAt: true },
      });
    }

    return this.prisma.payment.findMany({
      select: { id: true, amount: true, status: true, createdAt: true },
      where: { booking: { customer: { email: user.email } } },
    });
  }

  async findOne(
    id: string,
    user?: { userId: string; email?: string; role?: string },
  ) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) return null;

    if (!user || user.role === "ADMIN") return payment;

    const booking = await this.prisma.booking.findUnique({
      where: { id: payment.bookingId },
      include: { customer: true },
    });
    if (!booking || booking.customer.email !== user.email) {
      throw new ForbiddenException("Acceso denegado");
    }

    return payment;
  }

  async create(
    payload: { bookingId: string; amount: number; currency: string },
    user?: { userId: string; email?: string; role?: string },
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: payload.bookingId },
      include: { customer: true },
    });
    if (!booking) throw new BadRequestException("Reserva no encontrada");

    if (user && user.role !== "ADMIN") {
      if (booking.customer.email !== user.email) {
        throw new ForbiddenException(
          "No puede pagar por una reserva que no es suya",
        );
      }
    }

    return this.prisma.payment.create({
      data: {
        bookingId: payload.bookingId,
        amount: payload.amount,
        currency: payload.currency,
      },
    });
  }
}
