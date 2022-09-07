import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../database/entities/user.entity";
import { Repository } from "typeorm";
import { compare, hash } from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  // 모든 유저 찾기
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // 특정 유저 찾기
  findOne(userId: string): Promise<User> {
    return this.userRepository.findOne({ where: { userId: userId } });
  }

  // 유저 삭제
  async remove(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }

  // 유저 생성
  async createUser(user?: User): Promise<User> {
    const createUser: User = this.userRepository.create(user);
    await this.userRepository.save(createUser);
    return createUser;
  }

  // 특정 사용자 이름 찾기
  async findByUserName(
    userId: string,
    username: string
  ): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { userId: userId, username: username },
    });
  }

  // Email 값을 이용한 User 정보 가져오기
  async getByUserId(userId: string) {
    const user = this.userRepository.findOne({ where: { userId: userId } });

    if (user) {
      return user;
    } else {
      throw new HttpException(
        "존재하지 않은 유저입니다.",
        HttpStatus.NOT_FOUND
      );
    }
  }

  // 유저 ID 가져오기
  async getById(userId: string) {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });

    if (user) {
      return user;
    }

    throw new HttpException("존재하지 않은 유저입니다.", HttpStatus.NOT_FOUND);
  }

  // DB에 발급받은 Refresh Token 암호화 저장
  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const jwtToken = await hash(refreshToken, 10); // refreshToken
    await this.userRepository.update(userId, { jwtToken });
  }

  // Id 값을 이용한 Refresh Token 유효한지 확인
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await compare(refreshToken, user.jwtToken);

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  // Refresh Token 초기화
  async removeRefreshToken(id: number) {
    return this.userRepository.update(id, {
      jwtToken: null,
    });
  }

  // 유저 없데이트
  async updateByUser(user: User): Promise<User> {
    user.updatedAt = new Date();
    return await this.userRepository.save(user);
  }

  // 유저 삭제
  async deleteByUser(userId: string) {
    return await this.userRepository.delete(userId);
  }
}
