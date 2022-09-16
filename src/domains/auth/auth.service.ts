import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // 비밀번호 유효성 검사
  async validateUser(userId: string, plainTextPassword: string): Promise<any> {
    try {
      const user = await this.usersService.findOne(userId);
      await this.verifyPassword(plainTextPassword, user.password);
      const { password, ...result } = user;
      console.log("비밀번호 유효성 검사", user.password, password, result);

      return result;
    } catch (err) {
      throw new HttpException("잘못된 인증입니다.", HttpStatus.BAD_REQUEST);
    }
  }

  // 회원가입
  async register(user: User) {
    const { password, ...returnUser } = await this.usersService.createUser(
      user
    );

    console.log("회원가입 성공 유저", returnUser);
    console.log("회원가입 성공 유저의 비밀번호", password);

    return returnUser;
  }

  // Access Token 발급
  getCookieWithJwtAccessToken(userId: string) {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
      expiresIn: `${this.configService.get(
        "JWT_ACCESS_TOKEN_EXPIRATION_TIME"
      )}h`,
    });

    return {
      accessToken: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      maxAge:
        Number(this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME")) *
        1000,
    };
  }

  // Refresh Token 발급
  getCookieWithJwtRefreshToken(userId: string) {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: `${this.configService.get(
        "JWT_REFRESH_TOKEN_EXPIRATION_TIME"
      )}d`,
    });

    return {
      refreshToken: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      maxAge:
        Number(this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME")) *
        1000,
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

  async changePassword(userId: string, password: string, user?: User) {
    try {
      if (!user) {
        user = await this.usersService.findOne(userId);
      }

      await user.setEncryptPassword(password);
      await this.usersService.updateByUser(user);

      return user;
    } catch (err) {
      if (err) {
        throw new HttpException("잘못된 경로입니다.", HttpStatus.BAD_REQUEST);
      }
      return err;
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ) {
    const isPasswordMatch = await compare(plainTextPassword, hashedPassword);
    console.log("verifyPassword", isPasswordMatch);
    if (!isPasswordMatch) {
      throw new HttpException(
        "비밀번호가 일치하지 않습니다.",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
