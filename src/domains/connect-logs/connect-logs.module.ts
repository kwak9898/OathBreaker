import { Module } from "@nestjs/common";
import { ConnectLogsService } from "./connect-logs.service";
import { ConnectLogsController } from "./connect-logs.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConnectLog } from "./entities/connect-log.entity";
import { ConnectLogsRepository } from "./connect-logs.repository";

@Module({
  imports: [TypeOrmModule.forFeature([ConnectLog])],
  providers: [ConnectLogsService, ConnectLogsRepository],
  controllers: [ConnectLogsController],
})
export class ConnectLogsModule {}
