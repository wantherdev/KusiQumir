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

    it("should filter by availability", async () => {
      mockPrisma.tour.findMany.mockResolvedValue([]);
      await service.findAllPublic({ availability: "true" });
      expect(mockPrisma.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ availability: true }),
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
        name: "New Tour",
        description: "A great tour",
        price: 100,
        duration: "3 días",
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
    it("should soft delete a tour", async () => {
      const tour = { id: "1", name: "Test" };
      mockPrisma.tour.findFirst.mockResolvedValue(tour);
      mockPrisma.tour.findUnique.mockResolvedValue(tour);
      mockPrisma.tour.update.mockResolvedValue({ ...tour, deletedAt: new Date() });

      const result = await service.remove("1");
      expect(result.deletedAt).toBeDefined();
    });
  });
});
