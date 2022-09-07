import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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

  // 역할 생성 함수
  async createRoles(roles: string, userId: string) {
    const user = await this.usersService.getByUserId(userId);

    if (!user) {
      throw new HttpException(
        "존재하지 않는 유저입니다.",
        HttpStatus.NOT_FOUND
      );
    } else {
      await this.usersRepository.save({ roleName: roles });
    }

    return user;
  }
}
