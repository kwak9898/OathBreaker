import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "../domains/users/entities/user.entity";
import { MgObject } from "../domains/mg-object/entities/mg-object.entity";
import { MgoImage } from "../domains/mgo-image/entities/mgoImage.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: "127.0.0.1",
        port: 5432,
        username: "postgres",
        password: "dbMerge135!#%",
        database: "merge_main_db",
        entities: [User, MgObject, MgoImage],
        synchronize: true,
        retryAttempts: 2,
        logging: true,
      }),
      // useFactory: (configService: ConfigService) => ({
      //   type: "postgres",
      //   host: configService.get("DB_HOST"),
      //   port: configService.get("DB_PORT"),
      //   username: configService.get("DB_USERNAME"),
      //   password: configService.get("DB_PASSWORD"),
      //   database: configService.get("DB_NAME"),
      //   entities: [User, MgObject, MgoImage],
      //   synchronize: false,
      // }),
    }),
  ],
})
export class DatabaseModule {}
