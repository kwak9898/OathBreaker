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
      jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
      // ignoreExpiration: false,
      // secretOrKey: configService.get("JWT_REFRESH_TOKEN_SECRET"),
      // passReqToCallback: true,
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (request) => {
      //     return request?.cookies?.Refresh;
      //   },
      // ]),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_REFRESH_TOKEN_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const refreshToken = req.token;
    const token = await this.usersService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId
    );

    return token;
  }
}
