import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../../user.service";

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      // 헤더 Authentication 에서 Bearer 토큰으로부터 Jwt를 추출하겠다는 의미
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "secret", // Jwt 생성시 비밀키로 사용할 텍스트
      ignoreExpiration: false, // Jwt 만료를 무시할 것인지 (기본값: false)
      usernameField: "userId",
    });
  }

  // async validate(payload: Payload): Promise<user> {
  //     const user = await this.userService.login(payload.userId, payload.password);
  //     if (!user) {
  //         throw new UnauthorizedException("접근 오류");
  //     } else {
  //         return user;
  //     }
  // }
}
