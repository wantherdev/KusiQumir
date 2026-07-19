import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.customer.findMany();
  }

  findOne(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { email },
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
    });
    if (!customer) {
      throw new NotFoundException("Perfil de cliente no encontrado");
    }
    return this.prisma.customer.update({
      where: { id: customer.id },
      data: payload,
    });
  }

  create(payload: { name: string; email: string; nationality?: string }) {
    return this.prisma.customer.create({
      data: {
        name: payload.name,
        email: payload.email,
        nationality: payload.nationality ?? "PE",
      },
    });
  }
}
