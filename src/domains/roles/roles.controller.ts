import { Controller, UseGuards } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesGuard } from "../../guards/roles.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller("roles")
@UseGuards(RolesGuard)
@ApiTags("ROLES")
@ApiBearerAuth("access-token")
export class RolesController {
  constructor(private rolesService: RolesService) {}
}
