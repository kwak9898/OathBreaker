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
  async createRole(userId: string, roles: string): Promise<User> {
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

  // 역할 조회 함수
  async getByUserRole(userId: string, roles: string): Promise<User> {
    const user = await this.usersService.getByUserId(userId);

    if (!user) {
      throw new HttpException(
        "존재하지 않는 유저입니다.",
        HttpStatus.NOT_FOUND
      );
    } else {
      await this.usersRepository.findOne({
        where: { userId: userId, roleName: roles },
      });
    }

    return;
  }
}
