import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../roles/enum/role.enum";
import { USER_EXCEPTION } from "../../exception/error-code";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService
  ) {
    super(User, dataSource.createEntityManager());
  }

  // 유저 생성
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { userId, username, password, confirmPassword, team, roleName } =
      createUserDto;

    const user = this.create({
      userId,
      username,
      password,
      team,
      roleName,
    });

    const existUser = await this.findOne({ where: { userId } });

    if (existUser !== null) {
      throw new BadRequestException("이미 존재하는 아이디입니다.");
    }

    if (password !== confirmPassword) {
      throw new BadRequestException("비밀번호가 일치하지 않습니다.");
    }

    await user.hashPassword(password);
    return await this.save(user);
  }

  // 관리자인 유저 전체 카운트 조회
  async getAllByAdminCnt() {
    const findAdminUser = await this.count({ where: { roleName: Role.admin } });
    return findAdminUser;
  }

  // 등록자인 유저 전체 카운트 조회
  async getAllByRegisterCnt() {
    const findRegisterUser = await this.count({
      where: { roleName: Role.manager },
    });
    return findRegisterUser;
  }

  // 특정 유저 조회
  async findOneByUser(userId: string): Promise<User> {
    const findUser = await this.findOne({
      select: ["userId", "username", "roleName", "team", "lastAccessAt"],
      where: { userId },
    });

    if (!findUser) {
      throw new NotFoundException(USER_EXCEPTION.USER_NOT_FOUND);
    }

    return findUser;
  }

  // 비밀번호 및 로그인에 사용할 method
  async getUserById(userId: string): Promise<User> {
    const findUser = await this.findOne({
      select: [
        "userId",
        "password",
        "username",
        "roleName",
        "team",
        "lastAccessAt",
      ],
      where: { userId },
    });

    return findUser;
  }

  // 특정 유저 삭제
  async deleteUser(userId: string): Promise<void> {
    await this.delete(userId);
  }

  // DB에 발급받은 Refresh Token 암호화 저장
  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    await this.update(userId, { jwtToken: refreshToken });
  }

  // Id 값을 이용한 Refresh Token 유효한지 확인
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUserById(userId);

    if (refreshToken == user.jwtToken) {
      return user;
    } else {
      throw new BadRequestException("유효하지 않는 토큰입니다.");
    }
  }

  // Refresh Token 초기화
  async removeRefreshToken(userId: string) {
    return this.update(userId, {
      jwtToken: null,
    });
  }

  // 유저의 refreshToken 조회
  async findRefreshToken(jwtToken: string): Promise<User> {
    return await this.findOne({ where: { jwtToken } });
  }

  // 유저의 최종 접속일 업데이트
  async updateLastAccessAt(userId: string) {
    const updateDate = new Date();
    return this.update(userId, { lastAccessAt: updateDate });
  }
}
