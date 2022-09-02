import { NestFactory } from "@nestjs/core";
import * as dotenv from "dotenv";
import * as path from "path";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === "production"
      ? ".production.env"
      : process.env.NODE_ENV === "stage"
      ? ".stage.env"
      : ".development.env"
  ),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(3000);
}

bootstrap();
