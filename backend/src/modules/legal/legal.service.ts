import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class LegalService {
  constructor(private readonly prisma: PrismaService) {}

  getDocuments() {
    return this.prisma.document.findMany();
  }

  async acceptDocument(
    payload: {
      documentId: string;
      clientId?: string;
      ip: string;
      version: string;
    },
    user?: { userId: string; email?: string; role?: string },
  ) {
    // If CLIENTE, bind clientId from user email
    let customerId = payload.clientId;
    if (user && user.role !== "ADMIN") {
      const customer = await this.prisma.customer.findFirst({
        where: { email: user.email },
      });
      if (!customer)
        throw new BadRequestException("Cliente no encontrado para el usuario");
      customerId = customer.id;
    }

    if (!customerId) throw new BadRequestException("clientId es requerido");

    return this.prisma.documentAcceptance.create({
      data: {
        documentId: payload.documentId,
        customerId,
        ip: payload.ip,
        version: payload.version,
      },
    });
  }

  async getAcceptance(
    id: string,
    user?: { userId: string; email?: string; role?: string },
  ) {
    const acceptance = await this.prisma.documentAcceptance.findUnique({
      where: { id },
    });
    if (!acceptance) return null;

    if (!user || user.role === "ADMIN") return acceptance;

    const customer = await this.prisma.customer.findUnique({
      where: { id: acceptance.customerId },
    });
    if (!customer || customer.email !== user.email)
      throw new ForbiddenException("Acceso denegado");

    return acceptance;
  }
}
