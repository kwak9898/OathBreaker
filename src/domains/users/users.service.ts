import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../../repositories/user.repository";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  // 유저 생성
  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto);
  }

  // 유저 전체 조회
  getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  // 특정 유저 조회
  getUserById(userId: string): Promise<User> {
    return this.userRepository.getUserById(userId);
  }

  // 특정 유저 수정
  updateUser(userId: string, user: User): Promise<User> {
    return this.userRepository.updateUser(userId, user);
  }

  // 특정 유저 삭제
  deleteUser(userId: string): Promise<void> {
    return this.userRepository.deleteUser(userId);
  }

  // DB에 발급받은 Refresh Token 암호화 저장
  setCurrentRefreshToken(refreshToken: string, userId: string) {
    return this.userRepository.setCurrentRefreshToken(refreshToken, userId);
  }

  getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    return this.userRepository.getUserIfRefreshTokenMatches(
      refreshToken,
      userId
    );
  }

  // Refresh Token 초기화
  removeRefreshToken(userId: string) {
    return this.userRepository.removeRefreshToken(userId);
  }

  // 로그인
  login(createUserDto: CreateUserDto) {
    return this.userRepository.login(createUserDto);
  }

  // 유저의 refreshToken 조회
  findRefreshToken(jwtToken: string): Promise<User> {
    return this.userRepository.findRefreshToken(jwtToken);
  }
}
