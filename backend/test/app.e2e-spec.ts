import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("App (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CACHE_MANAGER)
      .useValue({
        get: () => undefined,
        set: () => undefined,
        del: () => undefined,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api/v1");
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /health", () => {
    it("should return ok with database connected", () => {
      return request(app.getHttpServer())
        .get("/api/v1/health")
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.status).toBe("ok");
          expect(res.body.database).toBe("connected");
        });
    });
  });

  describe("POST /auth/register", () => {
    const email = `e2e_${Date.now()}_reg@test.com`;

    it("should register a new user", () => {
      return request(app.getHttpServer())
        .post("/api/v1/auth/register")
        .send({ email, password: "testpass123" })
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body.email).toBe(email);
          expect(res.body.role).toBe("CLIENTE");
        });
    });

    it("should reject duplicate email", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/register")
        .send({ email, password: "testpass123" })
        .expect(409);
    });
  });

  describe("POST /auth/login", () => {
    const email = `e2e_${Date.now()}_login@test.com`;

    beforeAll(async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/register")
        .send({ email, password: "testpass123" });
    });

    it("should login with valid credentials", () => {
      return request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({ email, password: "testpass123" })
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.user.email).toBe(email);
        });
    });

    it("should reject invalid password", () => {
      return request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({ email, password: "wrongpass" })
        .expect(401);
    });
  });

  describe("GET /tours", () => {
    it("should return paginated tours", () => {
      return request(app.getHttpServer())
        .get("/api/v1/tours")
        .expect(200)
        .expect((res: request.Response) => {
          expect(Array.isArray(res.body.items)).toBe(true);
          expect(res.body.nextCursor).toBeNull();
        });
    });
  });
});
