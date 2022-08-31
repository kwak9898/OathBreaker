import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import { MgoImage } from "../../entity/mgoImage.entity";
import { MgObject } from "../../entity/mgObject.entity";
import { user } from "../../entity/user.entity";

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {};

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type : 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [MgoImage, MgObject, user],
            synchronize: false,
            logging: true
        }
    }
}
