import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "../domains/users/entities/user.entity";
import { MgObject } from "../domains/mg-object/entities/mg-object.entity";
import { MgoImage } from "../domains/mgo-image/entities/mgoImage.entity";
import { AssignMgObject } from "../domains/assign-mg-object/entities/assign-mg-object";
import { ConnectLog } from "../domains/connect-logs/entities/connect-log.entity";
import { RoleEntity } from "../domains/roles/entities/role.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        entities: [
          User,
          MgObject,
          MgoImage,
          AssignMgObject,
          ConnectLog,
          RoleEntity,
        ],
        synchronize: configService.get("NODE_ENV") !== "production",
        dropSchema:
          configService.get("NODE_ENV") === "test" ||
          configService.get("NODE_ENV") === "ci",
      }),
    }),
  ],
})
export class DatabaseModule {}
