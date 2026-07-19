import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { CsrfService } from "./csrf.service";
import { CsrfMiddleware } from "./csrf.middleware";

@Module({
  providers: [CsrfService, CsrfMiddleware],
  exports: [CsrfService],
})
export class CsrfModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfMiddleware).forRoutes("*");
  }
}
