import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MgoImage } from "../entity/mgoImage.entity";
import { MgObject } from "../entity/mgObject.entity";

export const typeormConfig: TypeOrmModuleOptions = {
    // DataBase Type
    type : 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [MgoImage, MgObject],
    synchronize: false,
    logging: true
}
