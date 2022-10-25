import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { RoleEntity } from "./entities/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RolesService],
  controllers: [RolesController],
})
export class LogsModule {}
