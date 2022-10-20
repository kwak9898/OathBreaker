import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { Role } from "./enum/role.enum";

@Injectable()
export class RoleRepository extends Repository<User> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UsersService
  ) {
    super(User, dataSource.createEntityManager());
  }

  // 유저 역할 전체 조회
  async getAllByRole(): Promise<User[]> {
    const roles = await this.find({
      select: ["roleName", "createdAt", "updatedAt"],
    });

    if (!roles) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }

    return roles;
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

  // 유저의 역할 삭제
  async deleteRoleByUser(userId: string): Promise<User> {
    const user = await this.findOne({ where: { userId } });

    user.roleName = Role.choose;
    const changeRoleName = await this.save(user);
    return changeRoleName;
  }
}
