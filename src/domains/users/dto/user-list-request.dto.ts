import { Role } from "../../roles/enum/role.enum";

export class UserListRequestDto {
  userId?: string;
  roleName?: Role;
  username?: string;
}
