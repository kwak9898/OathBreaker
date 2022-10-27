import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import { MyPaginationQuery } from "../base/pagination-query";
import { paginate, Pagination } from "nestjs-typeorm-paginate";
import { Role } from "../roles/enum/role.enum";
import { UserListResponseDto } from "./dto/UserListResponse.dto";
import { MyPagination } from "../base/pagination-response";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async initializeSuperUser() {
    const admin = await this.userRepository.findOne({
      where: { userId: "super" },
    });
    if (!admin) {
      const user = new User();
      user.userId = "super";
      user.password = await bcrypt.hash("super", 12);
      user.username = "super";
      user.roleName = "관리자";
      user.team = "super";
      await this.userRepository.save(user);
    }
  }

  // 유저 생성
  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto);
  }

  // 유저 전체 조회
  async getAllUsers(
    options: MyPaginationQuery,
    roleName?: Role,
    userId?: string
  ): Promise<Pagination<UserListResponseDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder("user");
    if (roleName) {
      queryBuilder.where("user.roleName = :roleName", { roleName: roleName });
    }

    if (userId) {
      queryBuilder.where("user.userId LIKE :userId", { userId: `%${userId}%` });
    }
    queryBuilder
      .innerJoinAndSelect("user.log", "log")
      .orderBy("log.accessAt", "ASC");
    const results = await paginate(queryBuilder, options);

    const data = results.items.map((item) => {
      const dto = new UserListResponseDto(item);
      const logAccess = item.log.slice(-1)[0];
      console.log(item);
      dto.accessAt = logAccess.accessAt;
      // console.log(logAccess.accessAt);
      // 2022-10-27T10:40:02.959Z
      // 2022-10-27T08:46:11.281Z
      return dto;
    });
    return new MyPagination<UserListResponseDto>(data, results.meta);
  }

  // 관리자인 유저 카운트 조회
  getAllByAdminCnt() {
    return this.userRepository.getAllByAdminCnt();
  }

  // 등록자인 유저 카운트 조회
  getAllByManagerCnt() {
    return this.userRepository.getAllByRegisterCnt();
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

  // 유저의 refreshToken 조회
  findRefreshToken(jwtToken: string): Promise<User> {
    return this.userRepository.findRefreshToken(jwtToken);
  }

  // 유저의 최종 접속일 업데이트
  async updateLastAccessAt(userId: string) {
    return this.userRepository.updateLastAccessAt(userId);
  }
}
