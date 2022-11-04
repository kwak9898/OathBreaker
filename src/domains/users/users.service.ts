import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import { MyPaginationQuery } from "../base/pagination-query";
import { paginate, Pagination } from "nestjs-typeorm-paginate";
import { UserListResponseDto } from "./dto/user-list-response.dto";
import { MyPagination } from "../base/pagination-response";
import { USER_EXCEPTION } from "../../exception/error-code";

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
    roleName?: string,
    userId?: string,
    username?: string
  ): Promise<Pagination<UserListResponseDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder("user");

    // 권한 검색 Query
    if (roleName) {
      queryBuilder.where("user.roleName = :roleName", { roleName: roleName });
    }

    // 유저 아이디 검색 Query
    if (userId) {
      queryBuilder.where("user.userId = :userId", { userId: userId });
    }

    // 유저 이름 검색 Query
    if (username) {
      queryBuilder.where("user.username = :username", {
        username: username,
      });
    }

    queryBuilder
      .leftJoinAndSelect("user.logList", "logList")
      .orderBy("logList.accessAt", "DESC");
    const results = await paginate(queryBuilder, options);

    const data = results.items.map((item) => new UserListResponseDto(item));
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
  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }
    return user;
  }

  // 특정 유저 수정
  async updateUser(
    userId: string,
    plainPassword?: string,
    roleName?: string
  ): Promise<User> {
    const user = await this.getUserById(userId);
    if (plainPassword) {
      user.password = await bcrypt.hash(plainPassword, 12);
    }

    if (roleName) {
      user.roleName = roleName;
    }

    return this.userRepository.save(user);
  }

  // 특정 유저 삭제
  deleteUser(userId: string): Promise<void> {
    if (!userId) {
      throw new NotFoundException(USER_EXCEPTION.USER_NOT_FOUND);
    }

    return this.userRepository.deleteUser(userId);
  }

  // 특정 유저 조회
  async findOneByUser(userId: string): Promise<User> {
    return this.userRepository.findOneByUser(userId);
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
