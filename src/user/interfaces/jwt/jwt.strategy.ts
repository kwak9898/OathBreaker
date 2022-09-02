import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../../user.service";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { TokenPayload } from "./tokenpayload.interface";

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authenticator;
        },
      ]),
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.getByUserId(payload.userId);
  }
}
