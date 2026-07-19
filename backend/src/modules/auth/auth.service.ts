import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  health() {
    return { status: "ok", module: "auth" };
  }

  async register(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true, password: true },
    });
    if (existing) {
      throw new ConflictException("El email ya está registrado");
    }

    const role = await this.prisma.role.upsert({
      where: { name: "CLIENTE" },
      update: {},
      create: { name: "CLIENTE" },
    });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        roleId: role.id,
      },
      select: { id: true, email: true, role: true },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role.name,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true, password: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role.name,
    });

    return {
      accessToken: token,
      user: {
        email: user.email,
        role: user.role.name,
      },
      message: "Login exitoso",
    };
  }
}
