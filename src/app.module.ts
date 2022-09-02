import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { TypeormService } from "./config/database/typeorm.service";
import { TypeormModule } from "./config/database/typeorm.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { UserController } from "./user/user.controller";
import * as Joi from "joi";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JET_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [TypeormModule],
      useClass: TypeormService,
      inject: [TypeormService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: "users", method: RequestMethod.GET })
      .forRoutes(UserController);
  }
}
