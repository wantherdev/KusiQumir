import { Injectable, NestMiddleware, ForbiddenException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { CsrfService } from "./csrf.service";

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private readonly skipSegments = ["auth/csrf", "auth/login", "auth/register", "auth/health", "health"];

  constructor(private readonly csrf: CsrfService) {}

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
