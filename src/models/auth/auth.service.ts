import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { User } from "../../database/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { ConfigService } from "@nestjs/config";

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
      const user = await this.usersService.getByUserId(userId);
      console.log(user);
      await this.verifyPassword(plainTextPassword, user.password);
      const { password, ...result } = user;
      console.log("비밀번호 유효성 검사", user.password, password, result);

      return result;
    } catch (err) {
      throw new HttpException("잘못된 인증입니다.", HttpStatus.BAD_REQUEST);
    }
  }

  // 회원가입
  // async register(user: User) {
  //   const hashedPassword = await hash(user.password, 12);
  //   try {
  //     user.password = hashedPassword;
  //
  //     const { password, ...returnUser } = await this.usersService.createUser(
  //       user
  //     );
  //
  //     return returnUser;
  //   } catch (err) {
  //     if (err?.code === "ER_DUP_ENTRY") {
  //       throw new HttpException(
  //         "이미 존재하는 아이디입니다..",
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }
  //   }
  // }

  // Access Token 발급
  getCookieWithJwtAccessToken(userId: string) {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
      expiresIn: `${this.configService.get(
        "JWT_ACCESS_TOKEN_EXPIRATION_TIME"
      )}s`,
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
      )}s`,
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
