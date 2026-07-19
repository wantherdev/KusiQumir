import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import * as Sentry from "@sentry/node";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly config: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const isProduction =
      this.config.get<string>("NODE_ENV") === "production";

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Error interno del servidor";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === "string"
          ? res
          : (res as Record<string, unknown>).message as string ?? message;
    }

    // Reportar errores 5xx a Sentry
    if (status >= 500) {
      Sentry.withScope((scope) => {
        scope.setExtra("url", request?.url);
        scope.setExtra("method", request?.method);
        scope.setExtra("body", request?.body);
        scope.setTag("http.status", String(status));
        Sentry.captureException(exception);
      });
    }

    const body: Record<string, unknown> = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    };

    if (!isProduction) {
      body.stack =
        exception instanceof Error ? exception.stack : undefined;
    }

    response.status(status).json(body);
  }
}
