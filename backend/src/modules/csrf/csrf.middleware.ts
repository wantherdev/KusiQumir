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
    const configPaths = this.config.get<string>("CSRF_SKIP_PATHS") || "auth/csrf,auth/login,auth/register,health";
    this.skipSegments = [...configPaths.split(",").map((s: string) => s.trim()).filter(Boolean), "contact", "claims"];
  }

  use(req: Request, _res: Response, next: NextFunction) {
    const url = req.path || req.originalUrl || req.url || "";
    const apiUrl = req.originalUrl || req.url || "";

    if (this.skipSegments.some((s) => url.includes(s) || apiUrl.includes(s))) {
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
