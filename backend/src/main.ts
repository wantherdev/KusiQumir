import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { MetricsInterceptor } from "./common/metrics.interceptor";
import { GlobalExceptionFilter } from "./common/http-exception.filter";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService);
  const logger = new Logger("Bootstrap");

  Sentry.init({
    dsn: configService.get<string>("SENTRY_DSN"),
    environment: configService.get<string>("NODE_ENV", "development"),
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: configService.get<string>("NODE_ENV") === "production" ? 0.1 : 0,
    profilesSampleRate: configService.get<string>("NODE_ENV") === "production" ? 0.1 : 0,
    enabled: !!configService.get<string>("SENTRY_DSN"),
  });

  app.setGlobalPrefix("api/v1");
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string>("CORS_ORIGIN")!.split(","),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  });
  app.useGlobalFilters(new GlobalExceptionFilter(configService));
  app.useGlobalInterceptors(new MetricsInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = configService.get<number>("PORT")!;

  if (configService.get<string>("NODE_ENV") !== "production") {
    const config = new DocumentBuilder()
      .setTitle("Digital Travel Agency API")
      .setDescription("API base para reservas, clientes, tours y pagos")
      .setVersion("1.0")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document);
    logger.log(`Documentación disponible en http://localhost:${port}/api/v1/docs`);
  }
  const server = await app.listen(port);

  logger.log(`Servidor corriendo en http://localhost:${port}`);
  logger.log(
    `Documentación disponible en http://localhost:${port}/api/v1/docs`,
  );

  const signals = ["SIGTERM", "SIGINT"];
  for (const signal of signals) {
    process.on(signal, async () => {
      logger.log(`Recibida señal ${signal}, cerrando servidor...`);
      server.close(async () => {
        await app.close();
        logger.log("Servidor cerrado correctamente");
        process.exit(0);
      });
    });
  }
}

bootstrap();
