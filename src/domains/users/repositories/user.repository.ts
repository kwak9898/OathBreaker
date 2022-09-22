import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { Roles } from "../../../enum/roles.enum";
import { compare, hash } from "bcrypt";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  // 유저 생성
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { userId, password } = createUserDto;
    const existUser = this.create({ userId, password, roleName: Roles.choose });

    if (existUser !== null) {
      throw new BadRequestException("이미 존재하는 아이디입니다.");
    }

    return await this.save(existUser);
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
  async updateUser(userId: string, user: User): Promise<User> {
    user.updatedAt = new Date();
    const existUser = this.getUserById(userId);

    await this.save(user);
    return existUser;
  }

  // 특정 유저 삭제
  async deleteUser(userId: string): Promise<void> {
    const existUser = await this.delete(userId);

    if (!existUser) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }
  }

  // DB에 발급받은 Refresh Token 암호화 저장
  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const jwtToken = await hash(refreshToken, 12); // refreshToken
    await this.update(userId, { jwtToken });
  }

  // Id 값을 이용한 Refresh Token 유효한지 확인
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUserById(userId);

    const isRefreshTokenMatching = await compare(refreshToken, user.jwtToken);

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  // Refresh Token 초기화
  async removeRefreshToken(userId: string) {
    return this.update(userId, {
      jwtToken: null,
    });
  }
}
