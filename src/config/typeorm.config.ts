import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from "../user/user.entity";

export const typeormConfig: TypeOrmModuleOptions = {
    // DataBase Type
    type : 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [UserEntity],
    synchronize: true
}
