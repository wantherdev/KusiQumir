import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { LoggerModule } from "nestjs-pino";
import { envValidationSchema } from "./common/env.validation";
import { HealthModule } from "./modules/health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { ToursModule } from "./modules/tours/tours.module";
import { BookingsModule } from "./modules/bookings/bookings.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { PackagesModule } from "./modules/packages/packages.module";
import { ProvidersModule } from "./modules/providers/providers.module";
import { OperationsModule } from "./modules/operations/operations.module";
import { GuidesModule } from "./modules/guides/guides.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { LegalModule } from "./modules/legal/legal.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { BillingModule } from "./modules/billing/billing.module";
import { ArticlesModule } from "./modules/articles/articles.module";
import { ExperiencesModule } from "./modules/experiences/experiences.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { DestinationsModule } from "./modules/destinations/destinations.module";
import { CsrfModule } from "./modules/csrf/csrf.module";
import { UploadsModule } from "./modules/uploads/uploads.module";
import { JwtAuthGuard } from "./modules/auth/jwt-auth.guard";
import { RolesGuard } from "./modules/auth/roles.guard";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: true },
    }),
    ThrottlerModule.forRoot([
      { name: "short", ttl: 1000, limit: 10 },
      { name: "medium", ttl: 10000, limit: 50 },
      { name: "long", ttl: 60000, limit: 200 },
    ]),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          level: config.get<string>("NODE_ENV") === "production" ? "info" : "debug",
          transport:
            config.get<string>("NODE_ENV") !== "production"
              ? { target: "pino-pretty", options: { colorize: true } }
              : undefined,
        },
      }),
    }),
    CacheModule.register({ isGlobal: true, ttl: 30, max: 200 }),
    PrismaModule,
    HealthModule,
    AuthModule,
    CustomersModule,
    ToursModule,
    BookingsModule,
    PaymentsModule,
    PackagesModule,
    ProvidersModule,
    OperationsModule,
    GuidesModule,
    AnalyticsModule,
    LegalModule,
    NotificationsModule,
    BillingModule,
    ArticlesModule,
    ExperiencesModule,
    CsrfModule,
    UploadsModule,
    CategoriesModule,
    DestinationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
