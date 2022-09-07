import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";
import { RolesService } from "./roles.service";
import { Public } from "../../dacorators/skipAuth.decorator";
import { LocalAuthGuard } from "../../guards/auth/localAuth.guard";

@Controller("roles")
export class RolesController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private rolesService: RolesService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("create-user")
  async createRole(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const { accessToken, ...accssOption } =
      this.authService.getCookieWithJwtAccessToken(user.userId);

    const { refreshToken, ...refreshOption } =
      this.authService.getCookieWithJwtRefreshToken(user.userId);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.userId);
    await this.rolesService.createRole(user.roleName, user.userId);

    res.cookie("Authentication", accessToken, accssOption);
    res.cookie("Refresh", refreshToken, refreshOption);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Get("get-user-role")
  async getByUserRole(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;

    const { accessToken, ...accssOption } =
      this.authService.getCookieWithJwtAccessToken(user.userId);

    const { refreshToken, ...refreshOption } =
      this.authService.getCookieWithJwtRefreshToken(user.userId);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.userId);
    await this.rolesService.getByUserRole(user.userId, user.roleName);

    res.cookie("Authentication", accessToken, accssOption);
    res.cookie("Refresh", refreshToken, refreshOption);
    res.json({ user });
  }
}
