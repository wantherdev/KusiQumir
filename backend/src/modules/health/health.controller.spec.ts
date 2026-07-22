import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "./health.controller";
import { PrismaService } from "../../prisma/prisma.service";

describe("HealthController", () => {
  let controller: HealthController;

  const mockPrisma = {
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("check", () => {
    it("should return ok when database is connected", async () => {
      mockPrisma.$queryRaw.mockResolvedValue([{ 1: 1 }]);
      const result = await controller.check();
      expect(result.status).toBe("ok");
      expect(result.database).toBe("connected");
      expect(result.timestamp).toBeDefined();
    });

    it("should return error when database is disconnected", async () => {
      mockPrisma.$queryRaw.mockRejectedValue(new Error("connection error"));
      const result = await controller.check();
      expect(result.status).toBe("error");
      expect(result.database).toBe("disconnected");
      expect(result.timestamp).toBeDefined();
    });
  });
});
