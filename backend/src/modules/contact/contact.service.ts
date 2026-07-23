import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  create(payload: { name: string; email: string; phone?: string; message: string }) {
    return this.prisma.contact.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
      },
      select: { id: true, createdAt: true },
    });
  }
}
