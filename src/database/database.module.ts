import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "../domains/users/entities/user.entity";
import { MgObject } from "../domains/mg-object/entities/mg-object.entity";
import { MgoImage } from "../domains/mgo-image/entities/mgoImage.entity";
import { AssignMgObject } from "../domains/assign-mg-object/entities/assign-mg-object";
import { Log } from "../domains/oath-logs/entities/log.entity";
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
        entities: [User, MgObject, MgoImage, AssignMgObject, Log, RoleEntity],
        synchronize: configService.get("NODE_ENV") !== "production",
        dropSchema: configService.get("NODE_ENV") === "test",
      }),
    }),
  ],
})
export class DatabaseModule {}
