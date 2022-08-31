import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { MgObject } from "../entity/mgObject.entity";
import { MgObjectService } from "./mgObject.service";
import { MgObjectController } from "./mgObject.controller";


@Module({
    imports: [
        TypeOrmModule.forFeature([MgObject])
    ],
    controllers: [MgObjectController],
    providers: [MgObjectService]
})

export class MgObjectModule {}
