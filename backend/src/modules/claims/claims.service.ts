import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ClaimsService {
  constructor(private readonly prisma: PrismaService) {}

  create(payload: {
    nombre: string;
    documento: string;
    correo: string;
    telefono?: string;
    servicio?: string;
    reserva?: string;
    fechaServicio?: string;
    motivo: string;
    descripcion: string;
    documentos?: string;
    permitirContacto?: boolean;
  }) {
    return this.prisma.claim.create({
      data: {
        nombre: payload.nombre,
        documento: payload.documento,
        correo: payload.correo,
        telefono: payload.telefono,
        servicio: payload.servicio,
        reserva: payload.reserva,
        fechaServicio: payload.fechaServicio,
        motivo: payload.motivo,
        descripcion: payload.descripcion,
        documentos: payload.documentos,
        permitirContacto: payload.permitirContacto ?? true,
      },
      select: { id: true, createdAt: true },
    });
  }
}
