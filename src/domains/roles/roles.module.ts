import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { RoleEntity } from "./entities/role.entity";
import { RolesRepository } from "./roles.repository";

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RolesService, RolesRepository],
  controllers: [RolesController],
  exports: [RolesService, RolesRepository],
})
export class RolesModule {}
