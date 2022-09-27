import { AuthService } from "./auth.service";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/entities/user.entity";
import { Response } from "express";
import { Public } from "../../dacorators/skip-auth.decorator";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { UsersService } from "../users/users.service";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  // 유저 생성
  @Public()
  @Post("/signup")
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signUp(createUserDto);
  }

  // 로그인
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("signin")
  async signIn(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(user.userId);

    const { refreshToken, ...refreshOption } =
      this.authService.getCookieWithJwtRefreshToken(user.userId);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.userId);

    res.cookie("Authentication", accessToken, accessOption);
    res.cookie("Refresh", refreshToken, refreshOption);
  }

  // 로그아웃
  @UseGuards(JwtRefreshGuard)
  @Post("signout")
  async signOut(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { accessOption, refreshOption } =
      this.authService.getCookiesForLogOut();

    console.log("지나가라");

    await this.usersService.removeRefreshToken(req.user.id);

    res.cookie("Authentication", "", accessOption);
    res.cookie("Refresh", "", refreshOption);
  }

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

  @Patch("change-password")
  async changePassword(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = await this.usersService.getUserById(req.user.userId);

    if (!user) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }

    await this.authService.changePassword(user.userId, user.password);
    return res.status(HttpStatus.OK).json(user);
  }
}
