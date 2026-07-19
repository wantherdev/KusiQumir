import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MetricsInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.originalUrl || req.url;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const res = context.switchToHttp().getResponse();
        const status = res.statusCode;

        if (duration > 200) {
          this.logger.warn(`[METRICS] SLOW ${method} ${url} → ${status} (${duration}ms)`);
        } else {
          this.logger.log(`[METRICS] ${method} ${url} → ${status} (${duration}ms)`);
        }
      }),
    );
  }
}
