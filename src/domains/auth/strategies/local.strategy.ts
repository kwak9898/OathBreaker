import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private authService: AuthService) {
    super({
      usernameField: "userId",
    });
  }

  // 인증 전략 구현
  async validate(userId: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(userId, password);

    // console.log(user);
    // 유저가 일치하지 않으면
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
