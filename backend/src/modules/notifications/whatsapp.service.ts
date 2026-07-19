import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export type BookingDetails = {
  id: string;
  customerName: string;
  customerEmail: string;
  itemName: string;
  itemType: "tour" | "package";
  unitPrice: number;
  travelers: number;
  total: number;
  status: string;
  notes?: string;
  date: Date;
};

@Injectable()
export class WhatsAppService {
  private readonly businessPhone: string;

  constructor(config: ConfigService) {
    const phone = config.get<string>("WHATSAPP_PHONE");
    if (!phone) throw new Error("WHATSAPP_PHONE env var is required");
    this.businessPhone = phone;
  }

  formatBookingMessage(booking: BookingDetails): string {
    const lines = [
      `🆕 *Nueva Reserva - KusiQumir*`,
      `📅 Fecha: ${booking.date.toLocaleDateString("es-PE")}`,
      `👤 Cliente: ${booking.customerName} (${booking.customerEmail})`,
      `🎫 ${booking.itemType === "tour" ? "Tour" : "Paquete"}: ${booking.itemName}`,
      `💰 Precio Unitario: S/ ${booking.unitPrice.toFixed(2)}`,
      `👥 Viajeros: ${booking.travelers}`,
      `💵 *Total a pagar: S/ ${booking.total.toFixed(2)}*`,
      `📌 Estado: ${booking.status}`,
    ];

    if (booking.notes) {
      lines.push(`📝 Notas: ${booking.notes}`);
    }

    lines.push(
      ``,
      `🔑 *Código de reserva:* ${booking.id}`,
      ``,
      `*📲 Para completar el pago:*`,
      `1. Realiza la transferencia por S/ ${booking.total.toFixed(2)}`,
      `2. Envía el comprobante a este WhatsApp`,
      `3. Te confirmaremos la reserva en breve`,
    );

    return lines.join("\n");
  }

  generateWaLink(booking: BookingDetails): string {
    const message = this.formatBookingMessage(booking);
    return `https://wa.me/${this.businessPhone}?text=${encodeURIComponent(message)}`;
  }
}
