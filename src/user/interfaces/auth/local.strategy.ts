import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { UserService } from "../../user.service";
import { User } from "../../../entity/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: "userId",
    });
  }

  async validate(userId: string, password: string): Promise<User> {
    return this.userService.signIn(userId, password);
  }
}
