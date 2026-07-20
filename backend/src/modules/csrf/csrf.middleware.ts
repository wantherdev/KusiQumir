import { Injectable, NestMiddleware, ForbiddenException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ConfigService } from "@nestjs/config";
import { CsrfService } from "./csrf.service";

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private readonly skipSegments: string[];

  constructor(
    private readonly csrf: CsrfService,
    private readonly config: ConfigService,
  ) {
    this.skipSegments = (this.config.get<string>("CSRF_SKIP_PATHS") || "auth/csrf,auth/login,auth/register,health")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  use(req: Request, _res: Response, next: NextFunction) {
    if (this.skipSegments.some((s) => req.path.includes(s))) {
      return next();
    }

    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      return next();
    }

    if (!this.csrf.validateRequest(req)) {
      throw new ForbiddenException("CSRF token inválido");
    }

    next();
  }
}
