import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "./entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: "127.0.0.1",
        port: 5432,
        username: "kwaktaemin",
        password: "ian123@",
        database: "test_data",
        entities: [User],
        synchronize: true,
        name: "default",
      }),
      // useFactory: (configService: ConfigService) => ({
      //   type: "postgres",
      //   host: configService.get("DB_HOST"),
      //   port: configService.get("DB_PORT"),
      //   username: configService.get("DB_USERNAME"),
      //   password: configService.get("DB_PASSWORD"),
      //   database: configService.get("DB_NAME"),
      //   entities: [User],
      //   synchronize: false,
      // }),
    }),
  ],
})
export class DatabaseModule {}
