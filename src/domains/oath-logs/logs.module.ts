import { Module } from "@nestjs/common";
import { LogsService } from "./logs.service";
import { LogsController } from "./logs.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Log } from "./entities/log.entity";
import { LogsRepository } from "./logs.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [LogsService, LogsRepository],
  controllers: [LogsController],
})
export class LogsModule {}
