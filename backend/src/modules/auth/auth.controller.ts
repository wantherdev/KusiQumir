import { Controller, Get, Post, Body, Req, Res, UseGuards } from "@nestjs/common";
import { ApiProperty, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { Public } from "./public.decorator";
import { CsrfService } from "../csrf/csrf.service";
import { AuthenticatedRequest } from "../../common/authenticated-request";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

class LoginDto {
  @ApiProperty({ description: "Correo electrónico del usuario", required: true })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: "Contraseña del usuario", required: true })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}

class RegisterDto {
  @ApiProperty({ description: "Correo electrónico del usuario", required: true })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: "Contraseña del usuario", required: true })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly csrf: CsrfService,
  ) {}

  @Public()
  @Get("csrf")
  @ApiOperation({ summary: "Obtener token CSRF" })
  csrfToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = this.csrf.generateToken(req, res);
    return { csrfToken: token };
  }

  @Public()
  @Get("health")
  @ApiOperation({ summary: "Health check de autenticación" })
  health() {
    return this.authService.health();
  }

  @Public()
  @Post("register")
  @ApiOperation({ summary: "Registrar nuevo usuario" })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password);
  }

  @Public()
  @Post("login")
  @ApiOperation({ summary: "Login de usuario" })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(body.email, body.password);

    res.cookie("access_token", result.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: this.configService.get("NODE_ENV") === "production",
      path: "/",
      maxAge: this.configService.get<number>('JWT_COOKIE_MAX_AGE', 7 * 24 * 60 * 60 * 1000),
    });

    return {
      user: result.user,
      message: result.message,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("me")
  @ApiOperation({ summary: "Obtener usuario actual" })
  me(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @Public()
  @Post("logout")
  @ApiOperation({ summary: "Cerrar sesión" })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token", { path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
    return { message: "Sesión cerrada" };
  }
}
