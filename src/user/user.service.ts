import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";
import { UserLoginDto } from "./dto/userLogin.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "./interfaces/jwt/tokenpayload.interface";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // 존재하는 유저 기기
  async getByUserId(userId: string) {
    const user = await this.usersRepository.findOne({ where: { userId } });

    if (!user) {
      throw new HttpException(
        "유저가 존재하지 않습니다.",
        HttpStatus.NOT_FOUND
      );
    }
    return user;
  }

  // 비밀번호 확인
  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        "잘못된 인증 정보 입니다.",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // 회원가입
  async signUp(userData: UserLoginDto) {
    const signUp = await this.usersRepository.create(userData);

    await this.usersRepository.save(signUp);
    return signUp;
  }

  // 로그인
  async signIn(userId: string, hashedPassword: string) {
    try {
      const user = await this.getByUserId(userId);
      await this.verifyPassword(hashedPassword, user.password);
      user.password = undefined;

      return user;
    } catch (err) {
      throw new HttpException(
        "잘못된 인증 정보입니다.",
        HttpStatus.BAD_REQUEST
      );
      console.log(err);
    }
  }

  // 로그아웃
  async signOut() {
    return `Authentication=; HttpOnly; path=/; Max-Age=0`;
  }

  // 토큰 발급
  getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      "JWT_EXPIRATION_TIME"
    )}`;
  }
}
