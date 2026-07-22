import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { doubleCsrf, DoubleCsrfConfigOptions } from "csrf-csrf";
import { Request, Response } from "express";

@Injectable()
export class CsrfService implements OnModuleInit {
  private _generateToken!: (req: Request, res: Response) => string;
  private _validateRequest!: (req: Request) => boolean;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const options: DoubleCsrfConfigOptions = {
      getSecret: () => {
        const csrf = this.config.get<string>("CSRF_SECRET");
        return csrf || this.config.get<string>("JWT_SECRET")!;
      },
      getSessionIdentifier: (req) => req.ip ?? "unknown",
      cookieName: "csrf-token",
      cookieOptions: {
        // httpOnly: false — SPA needs to read the token from the cookie
        // for the double-submit cookie pattern. In a future iteration this
        // could be replaced with a SameSite=Strict + CSRF token header pattern.
        httpOnly: false,
        sameSite: "lax",
        secure: this.config.get<string>("CSRF_SECURE") === "true",
        path: "/",
      },
      size: 64,
      ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    };

    const { generateCsrfToken, validateRequest } = doubleCsrf(options);
    this._generateToken = generateCsrfToken;
    this._validateRequest = validateRequest;
  }

  generateToken(req: Request, res: Response): string {
    return this._generateToken(req, res);
  }

  validateRequest(req: Request): boolean {
    return this._validateRequest(req);
  }
}
