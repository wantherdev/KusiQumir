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
        httpOnly: false,
        sameSite: "lax",
        secure: this.config.get("NODE_ENV") === "production",
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
