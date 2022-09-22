import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  // 유저 전체 조회
  async getAllUsers(): Promise<User[]> {
    const users = await this.find();

    if (!users) {
      throw new NotFoundException("유저들이 존재하지 않습니다.");
    }

    return users;
  }

  // 특정 유저 조회
  async getUserById(userId: string): Promise<User> {
    const findUser = await this.findOne({ where: { userId } });

    if (!findUser) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }

    return findUser;
  }

  // 특정 유저 수정
  async updateUser(user: User): Promise<User> {
    user.updatedAt = new Date();
    const userId = user.userId;
    const findUser = await this.findOne({ where: { userId } });

    if (!findUser) {
      throw new NotFoundException("존재하지 않은 유저입니다.");
    } else {
      await this.save(user);
    }

    return findUser;
  }
}
