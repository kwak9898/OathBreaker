import {Module} from "@nestjs/common";
import {OathUserModule} from "./oathuser/oathUser.module";

@Module({
    imports: [OathUserModule],
    controllers: [],
    providers: []
})

export class AppModule {}
