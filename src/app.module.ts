import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeormService } from "./config/database/typeorm.service";
import { TypeormModule } from "./config/database/typeorm.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        TypeOrmModule.forRootAsync({
            imports: [TypeormModule],
            useClass: TypeormService,
            inject: [TypeormService]
        })
    ],
    controllers: [],
    providers: []
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes("/users")
    }
}
