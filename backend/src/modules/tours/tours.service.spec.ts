import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { ToursService } from "./tours.service";
import { PrismaService } from "../../prisma/prisma.service";

const mockPrisma = {
  tour: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe("ToursService", () => {
  let service: ToursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToursService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ToursService>(ToursService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAllPublic", () => {
    it("should return paginated tours", async () => {
      const tours = [{ id: "1", name: "Test" }];
      mockPrisma.tour.findMany.mockResolvedValue(tours);

      const result = await service.findAllPublic({ take: "10" } as any);
      expect(result.items).toEqual(tours);
      expect(result.nextCursor).toBeNull();
    });

    it("should filter by status", async () => {
      mockPrisma.tour.findMany.mockResolvedValue([]);
      await service.findAllPublic({ status: "published" });
      expect(mockPrisma.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: "published" }),
        }),
      );
    });
  });

  describe("findOne", () => {
    it("should return a tour by id", async () => {
      const tour = { id: "1", name: "Test Tour" };
      mockPrisma.tour.findFirst.mockResolvedValue(tour);

      const result = await service.findOne("1");
      expect(result).toEqual(tour);
    });

    it("should throw NotFoundException when not found", async () => {
      mockPrisma.tour.findFirst.mockResolvedValue(null);
      await expect(service.findOne("nonexistent")).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    it("should create a tour", async () => {
      const payload = {
        slug: "test-tour",
        name: "New Tour",
        description: "A great tour",
        category: "Adventure",
        tourType: "Private",
        durationDays: 3,
        durationHours: 0,
        durationText: "3 días",
        country: "Perú",
        region: "Cusco",
        city: "Cusco",
        adultPrice: 100,
      };
      const created = { id: "1", ...payload };
      mockPrisma.tour.create.mockResolvedValue(created);

      const result = await service.create(payload);
      expect(result).toEqual(created);
    });
  });

  describe("update", () => {
    it("should update a tour", async () => {
      const existing = { id: "1", name: "Old" };
      mockPrisma.tour.findFirst.mockResolvedValue(existing);
      mockPrisma.tour.findUnique.mockResolvedValue(existing);
      mockPrisma.tour.update.mockResolvedValue({ ...existing, name: "Updated" });

      const result = await service.update("1", { name: "Updated" });
      expect(result.name).toBe("Updated");
    });
  });

  describe("remove", () => {
    it("should archive a tour (change status to archived)", async () => {
      const tour = { id: "1", name: "Test" };
      mockPrisma.tour.findFirst.mockResolvedValue(tour);
      mockPrisma.tour.findUnique.mockResolvedValue(tour);
      mockPrisma.tour.update.mockResolvedValue({ ...tour, status: "archived" });

      const result = await service.remove("1");
      expect(result.status).toBe("archived");
    });
  });
});