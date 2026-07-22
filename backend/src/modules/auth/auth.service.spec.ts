import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { PrismaService } from "../../prisma/prisma.service";

const mockPrisma = {
  role: { findUnique: jest.fn(), findFirst: jest.fn(), upsert: jest.fn() },
  user: { findUnique: jest.fn(), create: jest.fn(), findFirst: jest.fn() },
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue("mock-token"),
};

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
  compare: jest.fn(),
}));

import * as bcrypt from "bcryptjs";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("register", () => {
    it("should create a CLIENTE user", async () => {
      (mockPrisma.role.upsert as jest.Mock).mockResolvedValue({ id: "r1", name: "CLIENTE" });
      mockPrisma.user.create.mockResolvedValue({
        id: "u1",
        email: "new@test.com",
        role: { name: "CLIENTE" },
      });

      const result = await service.register("new@test.com", "password123");
      expect(result).toHaveProperty("id", "u1");
    });

    it("should throw if email already exists", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "u1", email: "existing@test.com" });

      await expect(
        service.register("existing@test.com", "pass"),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("login", () => {
    it("should return token for valid credentials", async () => {
      const user = {
        id: "u1",
        email: "admin@test.com",
        password: "hashed",
        role: { name: "ADMIN" },
      };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login("admin@test.com", "admin123");
      expect(result).toHaveProperty("accessToken", "mock-token");
      expect(result.user.role).toBe("ADMIN");
    });

    it("should throw for wrong password", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "u1",
        email: "test@test.com",
        password: "hashed",
        role: { name: "CLIENTE" },
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login("test@test.com", "wrong"),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
