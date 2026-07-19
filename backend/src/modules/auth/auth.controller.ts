import { Controller, Get, Post, Body, Req, Res, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { Public } from "./public.decorator";
import { CsrfService } from "../csrf/csrf.service";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

class LoginDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}

class RegisterDto {
  @IsEmail()
  email!: string;

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
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password);
  }

  @Public()
  @Post("login")
  @ApiOperation({ summary: "Login de usuario" })
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(body.email, body.password);

    res.cookie("access_token", result.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: this.configService.get("NODE_ENV") === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
  me(@Req() req: Request) {
    return (req as any).user;
  }

  @Public()
  @Post("logout")
  @ApiOperation({ summary: "Cerrar sesión" })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token", { path: "/" });
    return { message: "Sesión cerrada" };
  }
}
