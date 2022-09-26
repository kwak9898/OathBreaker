import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { User } from "../users/entities/user.entity";
import { CreateUserDto } from "../users/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // 비밀번호 유효성 검사
  async validateUser(userId: string, plainTextPassword: string): Promise<any> {
    const user = await this.usersService.getUserById(userId);
    await this.verifyPassword(plainTextPassword, user.password);
    const { password, ...result } = user;
    return result;
  }

  // 유저 생성
  async signUp(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // Access Token 발급
  getCookieWithJwtAccessToken(userId: string) {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
      expiresIn: `${this.configService.get(
        "JWT_ACCESS_TOKEN_EXPIRATION_TIME"
      )}`,
    });

    return {
      accessToken: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      maxAge: 3600,
    };
  }

  // Refresh Token 발급
  getCookieWithJwtRefreshToken(userId: string) {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: `${this.configService.get(
        "JWT_REFRESH_TOKEN_EXPIRATION_TIME"
      )}`,
    });

    return {
      refreshToken: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      maxAge: 108000,
    };
  }

  // 로그아웃
  getCookiesForLogOut() {
    return {
      accessOption: {
        domain: "localhost",
        path: "/",
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: "localhost",
        path: "/",
        httpOnly: true,
        maxAge: 0,
      },
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const user = await this.usersService.findRefreshToken(refreshToken);

    if (!user) {
      throw new NotFoundException("토근이 유효하지 않습니다.");
    }

    user.jwtToken = "";

    await this.usersService.updateUser(user.userId, user);
    return;
  }

  async changePassword(userId: string, password: string, user?: User) {
    try {
      if (!user) {
        user = await this.usersService.getUserById(userId);
      }

      await user.setEncryptPassword(password);
      await this.usersService.updateUser(userId, user);

      return user;
    } catch (err) {
      if (err) {
        throw new HttpException("잘못된 경로입니다.", HttpStatus.BAD_REQUEST);
      }
      return err;
    }
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatch = await compare(password, hashedPassword);

    if (!isPasswordMatch) {
      throw new HttpException(
        "비밀번호가 일치하지 않습니다.",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
