import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../../../dacorators/role.decorator";
import { Role } from "../../roles/enum/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requireRole = this.reflector.get<Role>(
      ROLES_KEY,
      context.getHandler()
    );
    console.log(requireRole);
    if (!requireRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }
    if (requireRole.includes("등록자")) {
      return false;
    }

    return requireRole.includes(user.roleName);
  }
}
