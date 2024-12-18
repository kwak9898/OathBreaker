import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AUTH_EXCEPTION } from "../../exception";

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
  createAccessToken(userId: string) {
    const payload = { userId };
    return this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
      expiresIn: `${this.configService.get(
        "JWT_ACCESS_TOKEN_EXPIRATION_TIME"
      )}`,
    });
  }

  // Refresh Token 발급
  createRefreshToken(userId: string) {
    const payload = { userId };
    return this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: `${this.configService.get(
        "JWT_REFRESH_TOKEN_EXPIRATION_TIME"
      )}`,
    });
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatch = await compare(password, hashedPassword);
    if (!isPasswordMatch) {
      throw new BadRequestException(AUTH_EXCEPTION.AUTH_FAIL_VALIDATE);
    }
  }
}
