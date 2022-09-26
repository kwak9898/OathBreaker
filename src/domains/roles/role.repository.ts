import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class RoleRepository extends Repository<User> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UsersService
  ) {
    super(User, dataSource.createEntityManager());
  }

  // 유저 역할 조회
  async getRoleByUser(userId: string, roleName: string): Promise<User> {
    const user = await this.findOne({ where: { userId, roleName } });

    if (!user.userId) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }

    return user;
  }

  // 유저 역할 수정
  async updateRoleByUser(userId: string, roleName: string): Promise<User> {
    try {
      const user = await this.userService.getUserById(userId);
      user.roleName = roleName;
      user.updatedAt = new Date();
      return await this.save(user);
    } catch (err) {
      console.log(err);
    }
  }

  // 유저 역할 삭제
  async deleteRoleByUser(userId: string, roleName: string): Promise<void> {
    const user = await this.userService.getUserById(userId);

    if (user) {
      await this.delete(roleName);
    } else {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }
  }
}
