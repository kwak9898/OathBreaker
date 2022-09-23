import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../../users/user.repository";
import { ConfigService } from "@nestjs/config";
import { User } from "../../users/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get("JWT_ACCESS_TOKEN_SECRET"),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any) {
    const { userId } = payload;
    const user: User = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
