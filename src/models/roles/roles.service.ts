import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../database/entities/user.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class RolesService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(User)
    private usersRepository: Repository<User>
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

  // 역할 수정
  async updateByUserRole(user: User, roles: string) {
    user.updatedAt = new Date();
    return await this.usersRepository.update(user.roleName, {
      roleName: roles,
    });
  }

  // 역할 삭제
  async deleteByUserRole(user: User, userId, roles: string) {
    user.deletedAt = new Date();
    return await this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("userId = :userId", { userId })
      .execute();
  }
}
