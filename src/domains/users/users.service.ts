import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
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

  // 유저의 최종 접속일 업데이트
  async updateLastAccessAt(userId: string) {
    return this.userRepository.updateLastAccessAt(userId);
  }

  // 모든 유저의 접속 로그 전체 조회
  async getConnectLog(): Promise<User[]> {
    return this.userRepository.getConnectLog();
  }

  // 유저의 최초 접속일 업데이트
  async updateFirstAccessAt(userId: string) {
    return this.userRepository.updateFirstAccessAt(userId);
  }

  // 유저의 IP주소 저장
  async createIpByUser(userId: string, ip: string): Promise<User> {
    return this.userRepository.createIpByUser(userId, ip);
  }
}
