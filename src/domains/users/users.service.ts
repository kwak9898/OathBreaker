import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { compare, hash } from "bcrypt";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  // 모든 유저 찾기
  async findAll(): Promise<User[]> {
    // const roleName = await this.userRepository.findOne({where: {roleName: }})
    const findUser = await this.userRepository.find();
    return findUser;
  }

  // 특정 유저 찾기
  findOne(userId: string): Promise<User> {
    return this.userRepository.findOne({
      where: { userId },
      select: ["userId", "username", "roleName", "team", "password"],
    });
  }

  // 유저 삭제
  async remove(user: User): Promise<void> {
    user.deletedAt = new Date();
    const deleteUser = await this.userRepository.delete(user.userId);

    if (!deleteUser) {
      throw new HttpException(
        "존재하지 않는 유저입니다.",
        HttpStatus.NOT_FOUND
      );
    }
  }

  // 유저 생성
  async createUser(user: User): Promise<User> {
    const createUser: User = this.userRepository.create(user);
    const existUser = await this.userRepository.findOne({
      where: { userId: user.userId },
    });

    if (existUser !== null) {
      throw new HttpException(
        "이미 존재하는 아이디 입니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    return await this.userRepository.save(createUser);
  }

  // DB에 발급받은 Refresh Token 암호화 저장
  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const jwtToken = await hash(refreshToken, 10); // refreshToken
    await this.userRepository.update(userId, { jwtToken });
  }

  // Id 값을 이용한 Refresh Token 유효한지 확인
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.findOne(userId);

    const isRefreshTokenMatching = await compare(refreshToken, user.jwtToken);

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  // Refresh Token 초기화
  async removeRefreshToken(userId: string) {
    return this.userRepository.update(userId, {
      jwtToken: null,
    });
  }

  // 유저 없데이트
  async updateByUser(user: User): Promise<User> {
    user.updatedAt = new Date();

    return await this.userRepository.save(user);
  }
}
