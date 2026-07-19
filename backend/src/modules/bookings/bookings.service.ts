import {
  BadRequestException, ForbiddenException,
  Injectable, NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { WhatsAppService } from "../notifications/whatsapp.service";
import { NotificationsService } from "../notifications/notifications.service";

const VALID_STATUSES = ["PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"] as const;
const CANCELLABLE = new Set(["PENDIENTE", "CONFIRMADA"]);

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsapp: WhatsAppService,
    private readonly notifications: NotificationsService,
  ) {}

  private bookingInclude = {
    tour: { select: { id: true, name: true, price: true, duration: true, images: true } },
    package: { select: { id: true, name: true, price: true } },
    customer: { select: { id: true, name: true, email: true } },
  } satisfies Prisma.BookingInclude;

  async findAllAdmin(query: {
    take?: string; cursor?: string; status?: string;
    customerId?: string; dateFrom?: string; dateTo?: string;
  }) {
    const take = Math.min(Math.max(1, Number(query.take) || 50), 100);
    const where: Prisma.BookingWhereInput = {};

    if (VALID_STATUSES.includes(query.status as any)) where.status = query.status;
    if (query.customerId) where.customerId = query.customerId;
    if (query.dateFrom || query.dateTo) {
      where.date = {} as any;
      if (query.dateFrom) (where.date as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.date as any).lte = new Date(query.dateTo);
    }

    const items = await this.prisma.booking.findMany({
      take: take + 1,
      where,
      orderBy: { date: "desc" },
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      include: this.bookingInclude,
    });

    const hasMore = items.length > take;
    if (hasMore) items.pop();
    return { items, nextCursor: hasMore ? items[items.length - 1]!.id : null };
  }

  async findAllMy(email: string) {
    return this.prisma.booking.findMany({
      where: { customer: { email } },
      orderBy: { date: "desc" },
      include: this.bookingInclude,
    });
  }

  async findOne(id: string, user?: { email?: string; role?: string }) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: this.bookingInclude,
    });
    if (!booking) throw new NotFoundException("Reserva no encontrada");

    if (user?.role !== "ADMIN") {
      if (booking.customer.email !== user?.email) {
        throw new ForbiddenException("Acceso denegado a esta reserva");
      }
    }
    return booking;
  }

  async create(
    payload: {
      tourId?: string;
      packageId?: string;
      travelers: number;
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      startDate?: string;
      notes?: string;
    },
    user?: { email?: string; role?: string },
  ) {
    if (!payload.tourId && !payload.packageId) {
      throw new BadRequestException("Debe especificar tourId o packageId, no ambos");
    }

    const bookingData: any = {
      travelers: payload.travelers,
      notes: payload.notes,
      status: "PENDIENTE",
    };

    if (payload.customerName) bookingData.customerName = payload.customerName;
    if (payload.customerEmail) bookingData.customerEmail = payload.customerEmail;
    if (payload.customerPhone) bookingData.customerPhone = payload.customerPhone;
    if (payload.startDate) bookingData.startDate = new Date(payload.startDate);

    const userEmail = user!.email!;
    let customer = await this.prisma.customer.findFirst({
      where: { email: userEmail },
    });

    if (!customer) {
      if (user?.role === "ADMIN" && payload.tourId) {
        throw new BadRequestException("customerId inválido");
      }
      const name = payload.customerName ?? userEmail.split("@")[0];
      const email = payload.customerEmail ?? userEmail;
      customer = await this.prisma.customer.create({
        data: { name, email, phone: payload.customerPhone },
      });
    } else if (payload.customerName || payload.customerPhone) {
      customer = await this.prisma.customer.update({
        where: { id: customer.id },
        data: {
          ...(payload.customerName && { name: payload.customerName }),
          ...(payload.customerPhone && { phone: payload.customerPhone }),
        },
      });
    }
    bookingData.customer = { connect: { id: customer.id } };

    let unitPrice = 0;
    if (payload.tourId) {
      const tour = await this.prisma.tour.findFirst({
        where: { id: payload.tourId, deletedAt: null, availability: true },
      });
      if (!tour) throw new NotFoundException("Tour no disponible");
      unitPrice = tour.price;
      bookingData.tour = { connect: { id: tour.id } };
    } else if (payload.packageId) {
      const pkg = await this.prisma.package.findUnique({ where: { id: payload.packageId } });
      if (!pkg) throw new NotFoundException("Paquete no encontrado");
      unitPrice = pkg.price;
      bookingData.package = { connect: { id: pkg.id } };
    }

    bookingData.unitPrice = unitPrice;
    bookingData.total = unitPrice * payload.travelers;

    const booking = await this.prisma.booking.create({
      data: bookingData,
      include: this.bookingInclude,
    }) as any;

    const itemName = booking.tour?.name ?? booking.package?.name ?? "";
    const waLink = this.whatsapp.generateWaLink({
      id: booking.id,
      customerName: booking.customer.name,
      customerEmail: booking.customer.email,
      itemName,
      itemType: booking.tour ? "tour" : "package",
      unitPrice: booking.unitPrice ?? 0,
      travelers: booking.travelers,
      total: booking.total ?? 0,
      status: booking.status,
      notes: payload.notes,
      date: booking.date,
    });

    await this.notifications.send({
      channel: "whatsapp",
      recipient: booking.customer.email,
      message: `Reserva creada. Enlace para pago: ${waLink}`,
    });

    return { ...booking, waLink };
  }

  async cancel(id: string, user?: { email?: string; role?: string }) {
    const booking = await this.findOne(id, user);
    if (!CANCELLABLE.has(booking.status as any)) {
      throw new BadRequestException(
        `No se puede cancelar una reserva en estado ${booking.status}`,
      );
    }
    return this.prisma.booking.update({
      where: { id },
      data: { status: "CANCELADA", canceledAt: new Date() },
      include: this.bookingInclude,
    });
  }

  async updateStatus(id: string, status: string) {
    if (!VALID_STATUSES.includes(status as any)) {
      throw new BadRequestException(`Estado inválido: ${status}`);
    }
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException("Reserva no encontrada");

    return this.prisma.booking.update({
      where: { id },
      data: { status: status as any },
      include: this.bookingInclude,
    });
  }
}
