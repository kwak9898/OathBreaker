import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

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

  // 회원 로그인
  async login(createUserDto: CreateUserDto): Promise<{ accessToken }> {
    const { userId, password } = createUserDto;
    const user = await this.getUserById(userId);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { userId };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException("로그인 실패");
    }
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

  // 모든 유저의 접속 로그 전체 조회
  async getConnectLog(): Promise<User[]> {
    const userLog = this.find({
      select: ["userId", "username", "url", "ip", "firstAccessAt"],
    });

    if (!userLog) {
      throw new NotFoundException("모든 유저의 접속 로그가 존재하지 않습니다.");
    }

    return userLog;
  }

  // 유저의 최초 접속일 업데이트
  async updateFirstAccessAt(userId: string) {
    const updateDate = new Date();
    return this.update(userId, { firstAccessAt: updateDate });
  }

  // 유저의 IP주소 저장
  async createIpByUser(userId: string, ip: string): Promise<User> {
    const user = this.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }

    await this.update(userId, { ip });
    return user;
  }

  // 유저의 URL 저장
  async createUrlByUser(userId: string, url: string): Promise<User> {
    const user = this.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }

    await this.update(userId, { url });
    return user;
  }
}
