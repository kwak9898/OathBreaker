import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh-token"
) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_REFRESH_TOKEN_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    console.log("여기");
    const refreshToken = req.token;
    const token = await this.usersService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId
    );
    console.log("토큰", token);

    return token;
  }
}
