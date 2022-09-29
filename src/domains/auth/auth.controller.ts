import { AuthService } from "./auth.service";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
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
import { Roles } from "../../dacorators/role.decorator";
import { Role } from "../roles/enum/role.enum";
import { RolesGuard } from "./guards/roles.guard";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../dacorators/current-user.decorators";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Controller("auth")
@ApiTags("AUTH")
@UseGuards(RolesGuard)
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  // 유저 생성
  @Roles(Role.admin)
  /**
   * 유저 생성
   */
  @ApiOperation({
    summary: "유저 생성",
  })
  @Post("/signup")
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signUp(createUserDto);
  }

  /**
   * 로그인
   */
  @ApiOperation({
    summary: "로그인",
  })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("signin")
  async signIn(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(user.userId);

    const { refreshToken, ...refreshOption } =
      this.authService.getCookieWithJwtRefreshToken(user.userId);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.userId);

    res.cookie("Authentication", accessToken, accessOption);
    res.cookie("Refresh", refreshToken, refreshOption);
  }

  /**
   * 로그아웃
   */
  @ApiOperation({
    summary: "로그아웃",
  })
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post("signout")
  async signOut(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessOption, refreshOption } =
      this.authService.getCookiesForLogOut();

    await this.usersService.removeRefreshToken(user.userId);

    res.cookie("Authentication", "", accessOption);
    res.cookie("Refresh", "", refreshOption);
  }

  /**
   * 리프레시
   */
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get("refresh")
  @ApiOperation({
    summary: "토큰 리프레시",
  })
  refresh(
    @CurrentUser() user: User,
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, ...refreshOption } =
      this.authService.getCookieWithJwtRefreshToken(user.userId);

    res.cookie("Authentication", refreshToken, refreshOption);
    return user;
  }

  /**
   * 비밀번호 변경
   */
  @Roles(Role.admin)
  @Patch("change-password")
  @ApiOperation({
    summary: "비밀번호 변경",
  })
  async changePassword(
    @CurrentUser() user: User,
    @Body() dto: ChangePasswordDto,
    @Res({ passthrough: true }) res: Response
  ) {
    if (!user) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }

    const changedPasswordUser = await this.authService.changePassword(
      user.userId,
      dto.password
    );
    return res.status(HttpStatus.OK).json(changedPasswordUser);
  }
}
