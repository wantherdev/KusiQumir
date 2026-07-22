import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { PrismaService } from "../../prisma/prisma.service";
import { WhatsAppService } from "../notifications/whatsapp.service";
import { NotificationsService } from "../notifications/notifications.service";

const mockWhatsApp = {
  generateWaLink: jest.fn().mockReturnValue("https://wa.me/51999000000?text=test"),
};

const mockNotifications = {
  send: jest.fn().mockResolvedValue(undefined),
};

const mockPrisma = {
  booking: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  customer: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  tour: {
    findFirst: jest.fn(),
  },
  package: {
    findUnique: jest.fn(),
  },
};

describe("BookingsService", () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: WhatsAppService, useValue: mockWhatsApp },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAllAdmin", () => {
    it("should return paginated bookings", async () => {
      mockPrisma.booking.findMany.mockResolvedValue([{ id: "1" }]);
      const result = await service.findAllAdmin({ take: "10" });
      expect(result.items).toHaveLength(1);
    });

    it("should filter by status", async () => {
      mockPrisma.booking.findMany.mockResolvedValue([]);
      await service.findAllAdmin({ status: "CONFIRMADA" });
      expect(mockPrisma.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: "CONFIRMADA" }),
        }),
      );
    });
  });

  describe("findOne", () => {
    it("should throw NotFoundException for missing booking", async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(null);
      await expect(service.findOne("bad-id")).rejects.toThrow(NotFoundException);
    });

    it("should return booking for admin", async () => {
      const booking = { id: "1", customer: { email: "test@test.com" } };
      mockPrisma.booking.findUnique.mockResolvedValue(booking);
      const result = await service.findOne("1", { role: "ADMIN" });
      expect(result).toEqual(booking);
    });
  });

  describe("create", () => {
    it("should throw if neither tourId nor packageId", async () => {
      await expect(
        service.create({ travelers: 2 } as any, { email: "test@test.com", role: "CLIENTE" }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should create booking with tour", async () => {
      mockPrisma.customer.findFirst.mockResolvedValue({ id: "c1", email: "test@test.com" });
      mockPrisma.tour.findFirst.mockResolvedValue({ id: "t1", price: 100 });
      mockPrisma.booking.create.mockResolvedValue({
        id: "b1", travelers: 2, unitPrice: 100, total: 200,
        tour: { name: "Test Tour" }, package: null,
        customer: { name: "test", email: "test@test.com" },
        status: "PENDIENTE", date: new Date(), notes: null,
      });

      const result = await service.create(
        { tourId: "t1", travelers: 2 },
        { email: "test@test.com", role: "CLIENTE" },
      );
      expect(result).toBeDefined();
      expect(result.waLink).toContain("wa.me");
      expect(mockPrisma.booking.create).toHaveBeenCalled();
    });
  });

  describe("cancel", () => {
    it("should cancel a PENDIENTE booking", async () => {
      const booking = { id: "1", status: "PENDIENTE", customer: { email: "test@test.com" } };
      mockPrisma.booking.findUnique.mockResolvedValue(booking);
      mockPrisma.booking.update.mockResolvedValue({ ...booking, status: "CANCELADA" });

      const result = await service.cancel("1", { email: "test@test.com", role: "CLIENTE" });
      expect(result.status).toBe("CANCELADA");
    });

    it("should throw if already COMPLETADA", async () => {
      const booking = { id: "1", status: "COMPLETADA", customer: { email: "test@test.com" } };
      mockPrisma.booking.findUnique.mockResolvedValue(booking);
      await expect(
        service.cancel("1", { email: "test@test.com", role: "CLIENTE" }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
