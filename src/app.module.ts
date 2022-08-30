import {Module} from "@nestjs/common";
import {OathUserModule} from "./oathuser/oathUser.module";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRoot()
    ],
    controllers: [],
    providers: []
})

export class AppModule {}
