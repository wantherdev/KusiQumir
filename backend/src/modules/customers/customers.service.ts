import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CustomersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  findAll() {
    return this.prisma.customer.findMany({
      select: { id: true, name: true, email: true, nationality: true, phone: true, passport: true, preferences: true, createdAt: true },
    });
  }

  findOne(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, nationality: true, phone: true, passport: true, preferences: true, createdAt: true },
    });
  }

  async findByEmail(email: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { email },
      select: { id: true, name: true, email: true, nationality: true, phone: true, passport: true, preferences: true, createdAt: true },
    });
    if (!customer) {
      throw new NotFoundException("Perfil de cliente no encontrado. Crea una reserva primero.");
    }
    return customer;
  }

  async updateByEmail(
    email: string,
    payload: {
      name?: string;
      phone?: string;
      nationality?: string;
      passport?: string;
      preferences?: string;
    },
  ) {
    const customer = await this.prisma.customer.findFirst({
      where: { email },
      select: { id: true },
    });
    if (!customer) {
      throw new NotFoundException("Perfil de cliente no encontrado");
    }
    return this.prisma.customer.update({
      where: { id: customer.id },
      data: payload,
      select: { id: true, name: true, email: true, nationality: true, phone: true, passport: true, preferences: true, createdAt: true },
    });
  }

  create(payload: { name: string; email: string; nationality?: string }) {
    return this.prisma.customer.create({
      data: {
        name: payload.name,
        email: payload.email,
        nationality: payload.nationality ?? this.config.get<string>("DEFAULT_NATIONALITY", "PE"),
      },
      select: { id: true, name: true, email: true, nationality: true, createdAt: true },
    });
  }
}
