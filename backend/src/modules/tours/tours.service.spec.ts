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
    delete: jest.fn(),
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
      const tours = [{ id: "1", title: "Test" }];
      mockPrisma.tour.findMany.mockResolvedValue(tours);

      const result = await service.findAllPublic({ take: "10" } as any);
      expect(result.items).toEqual(tours);
      expect(result.nextCursor).toBeNull();
    });

    it("should filter by difficulty", async () => {
      mockPrisma.tour.findMany.mockResolvedValue([]);
      await service.findAllPublic({ difficulty: "Easy" });
      expect(mockPrisma.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ difficulty: "Easy" }),
        }),
      );
    });
  });

  describe("findOne", () => {
    it("should return a tour by id", async () => {
      const tour = { id: "1", title: "Test Tour" };
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
        code: "T001",
        title: "New Tour",
        description: "A great tour",
        shortDescription: "Short desc",
        categoryId: "cat1",
        difficulty: "Easy" as any,
        groupType: "Shared" as any,
        serviceType: "FullDay" as any,
        durationDays: 3,
        durationHours: 8,
      };
      const created = { id: "1", ...payload };
      mockPrisma.tour.create.mockResolvedValue(created);

      const result = await service.create(payload as any);
      expect(result).toEqual(created);
    });
  });

  describe("update", () => {
    it("should update a tour", async () => {
      const existing = { id: "1", title: "Old" };
      mockPrisma.tour.findFirst.mockResolvedValue(existing);
      mockPrisma.tour.findUnique.mockResolvedValue(existing);
      mockPrisma.tour.update.mockResolvedValue({ ...existing, title: "Updated" });

      const result = await service.update("1", { title: "Updated" } as any);
      expect(result.title).toBe("Updated");
    });
  });

  describe("remove", () => {
    it("should delete a tour permanently (hard delete)", async () => {
      const tour = { id: "1", title: "Test" };
      mockPrisma.tour.findFirst.mockResolvedValue(tour);
      mockPrisma.tour.findUnique.mockResolvedValue(tour);
      mockPrisma.tour.delete.mockResolvedValue(tour);

      const result = await service.remove("1");
      expect(result.id).toBe("1");
      expect(mockPrisma.tour.delete).toHaveBeenCalledWith({ where: { id: "1" } });
    });
  });
});
