import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ErrorsInterceptor } from "./exception/exception.interceptor";
import { HttpExceptionFilter } from "./exception/http-exception.filters";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useCookieParser(app);
  useValidationPipe(app);
  useGlobalError(app);
  useGlobalHttpExceptionFilter(app);
  useCors(app);
  await app.listen(3000);
}

function useCookieParser(app: INestApplication): void {
  useValidationPipe(app);
}

function useValidationPipe(app: INestApplication): void {
  const pipe = new ValidationPipe({
    // whitelist: true,
    // forbidNonWhitelisted: true,/**/
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

bootstrap();
