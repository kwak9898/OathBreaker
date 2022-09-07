import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../database/entities/user.entity";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  // 관리자인지 등록자인지의 역할 관련 함수
  async rolesName() {
    return;
  }
}
