import {
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { RequestWithUser } from "./interfaces/auth/requestWithUser.interface";
import { LocalAuthenticationGuard } from "../guard/localAuthentication.guard";
import { Response } from "express";

@Controller("oath-user")
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post("login")
  async login(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const cookie = this.userService.getCookieWithJwtToken(user.userId);
    response.setHeader("Set-Cookie", cookie);
    user.password = undefined;
    return response.send(user);
  }
}
