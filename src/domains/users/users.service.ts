import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./repositories/user.repository";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  // 유저 생성
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto);
  }

  // 유저 전체 조회
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  // 특정 유저 조회
  async getUserById(userId: string): Promise<User> {
    return this.userRepository.getUserById(userId);
  }

  // 특정 유저 수정
  async updateUser(userId: string, user: User): Promise<User> {
    return this.userRepository.updateUser(userId, user);
  }

  // // 특정 유저 찾기
  // findOne(userId: string): Promise<User> {
  //   return this.userRepository.findOne({
  //     where: { userId },
  //     select: ["userId", "username", "roleName", "team", "password"],
  //   });
  // }
  //
  // // 유저 삭제
  // async remove(userId: string): Promise<void> {
  //   // user.deletedAt = new Date();
  //   const deleteUser = await this.userRepository.delete(userId);
  //
  //   if (!deleteUser) {
  //     throw new HttpException(
  //       "존재하지 않는 유저입니다.",
  //       HttpStatus.NOT_FOUND
  //     );
  //   }
  // }
  //
  // // DB에 발급받은 Refresh Token 암호화 저장
  // async setCurrentRefreshToken(refreshToken: string, userId: string) {
  //   const jwtToken = await hash(refreshToken, 10); // refreshToken
  //   await this.userRepository.update(userId, { jwtToken });
  // }
  //
  // // Id 값을 이용한 Refresh Token 유효한지 확인
  // async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
  //   const user = await this.findOne(userId);
  //
  //   const isRefreshTokenMatching = await compare(refreshToken, user.jwtToken);
  //
  //   if (isRefreshTokenMatching) {
  //     return user;
  //   }
  // }
  //
  // // Refresh Token 초기화
  // async removeRefreshToken(userId: string) {
  //   return this.userRepository.update(userId, {
  //     jwtToken: null,
  //   });
  // }
  //
  // // 유저 없데이트
  // async updateByUser(user: User): Promise<User> {
  //   user.updatedAt = new Date();
  //
  //   return await this.userRepository.save(user);
  // }
}
