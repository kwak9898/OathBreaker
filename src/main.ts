import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ErrorsInterceptor } from "./exception/exception.interceptor";
import { HttpExceptionFilter } from "./exception/http-exception.filters";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useCookieParser(app);
  useValidationPipe(app);
  useGlobalError(app);
  useGlobalHttpExceptionFilter(app);
  useCors(app);
  useSwagger(app);
  await app.listen(process.env.NODE_ENV === "production" ? 8090 : 3000);
}

function useCookieParser(app: INestApplication): void {
  useValidationPipe(app);
}

function useValidationPipe(app: INestApplication): void {
  const pipe = new ValidationPipe({
    // whitelist: true,
    // forbidNonWhitelisted: true,
  });
  app.useGlobalPipes(pipe);
}

function useGlobalError(app: INestApplication): void {
  app.useGlobalInterceptors(new ErrorsInterceptor());
}

function useGlobalHttpExceptionFilter(app: INestApplication): void {
  app.useGlobalFilters(new HttpExceptionFilter());
}

function useCors(app: INestApplication): void {
  app.enableCors();
  // {
  //   origin: [
  //     'http://localhost:3000',
  //     'https://pay-web.jumpprop.com',
  //     'https://pay.jumpprop.com',
  //     '13.209.176.207',
  //     '3.34.85.149',
  //   ],
  // }
}

function useSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("Pumpkin NestJS API")
    .setDescription("API description")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "Bearer", bearerFormat: "JWT" },
      "JWT-token"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("swagger", app, document);
}

bootstrap();
