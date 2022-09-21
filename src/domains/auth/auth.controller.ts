import { AuthService } from "./auth.service";
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { Public } from "../../dacorators/skip-auth.decorator";
import { UsersService } from "../users/users.service";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    // 쿠키 저장을 위한 res 생성
    const user = req.user;
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(user.userId);

    const { refreshToken, ...refreshOption } =
      this.authService.getCookieWithJwtRefreshToken(user.userId);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.userId);

    res.cookie("Authentication", accessToken, accessOption);
    res.cookie("Refresh", refreshToken, refreshOption);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post("logout")
  async logOut(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const { accessOption, refreshOption } =
      this.authService.getCookiesForLogOut();

    await this.usersService.removeRefreshToken(user.userId);

    res.cookie("Authentication", "", accessOption);
    res.cookie("Refresh", "", refreshOption);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Req() req) {
    return req.user;
  }

  // @Public()
  // @Post("register")
  // async register(@Body() user: User): Promise<any> {
  //   return this.authService.register(user);
  // }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get("refresh")
  refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(user.userId);

    res.cookie("Authentication", accessToken, accessOption);
    return user;
  }

  @Public()
  @Patch("change-password")
  async changePassword(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = await this.usersService.findOne(req.user.userId);

    if (!user) {
      throw new HttpException(
        "존재하지 않는 유저입니다.",
        HttpStatus.NOT_FOUND
      );
    }

    await this.authService.changePassword(user.userId, user.password);

    return res.status(HttpStatus.OK).json(user);
  }
}
