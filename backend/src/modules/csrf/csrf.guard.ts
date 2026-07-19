import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { CsrfService } from "./csrf.service";

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private readonly csrf: CsrfService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const valid = this.csrf.validateRequest(req);
    if (!valid) {
      throw new ForbiddenException("CSRF token inválido");
    }
    return true;
  }
}
