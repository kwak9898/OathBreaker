import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from "../user/user.entity";

export const typeormConfig: TypeOrmModuleOptions = {
    // DataBase Type
    type : 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'oathbreaker',
    password: 'Merge135!#%',
    database: 'oathbreaker',
    entities: [UserEntity],
    synchronize: true
}
