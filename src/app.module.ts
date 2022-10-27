import { join } from "path";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "@hapi/joi";
import { UsersModule } from "./domains/users/users.module";
import { AuthModule } from "./domains/auth/auth.module";
import { RolesModule } from "./domains/roles/roles.module";
import { MgObjectModule } from "./domains/mg-object/mg-object.module";
import { MgoImageModule } from "./domains/mgo-image/mgo-image.module";
import { AssignMgObjectModule } from "./domains/assign-mg-object/assign-mg-object.module";
import { UsersService } from "./domains/users/users.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AppInitializeModule } from "./config/app-initialize.module";
import { AppInitializeService } from "./config/app-initialize.service";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "client/dist"),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env?.NODE_ENV ?? "development"}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "production", "test", "staging")
          .default("development"),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    DatabaseModule,
    MgObjectModule,
    MgoImageModule,
    AssignMgObjectModule,
    AppInitializeModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {
  constructor(
    private userService: UsersService,
    private appInitializeService: AppInitializeService
  ) {
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "production"
    ) {
      userService.initializeSuperUser();
      appInitializeService.initializeMgObject();
    }
  }
}
