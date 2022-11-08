import { AuthService } from "./auth.service";
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/entities/user.entity";
import { Public } from "../../dacorators/skip-auth.decorator";
import { LocalAuthGuard } from "../../guards/local-auth.guard";
import { UsersService } from "../users/users.service";
import { JwtRefreshGuard } from "../../guards/jwt-refresh.guard";
import { Roles } from "../../dacorators/role.decorator";
import { Role } from "../roles/enum/role.enum";
import { RolesGuard } from "../../guards/roles.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../dacorators/current-user.decorators";
import { ChangeUserDto } from "./dto/change-user.dto";
import { ApiImplicitBody } from "@nestjs/swagger/dist/decorators/api-implicit-body.decorator";
import { ImplicitLoginDto } from "./dto/implicit-login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { RefreshResponseDto } from "./dto/refresh-response.dto";
import { ImplicitRefreshDto } from "./dto/implicit-refresh.dto";

@Controller("auth")
@ApiTags("AUTH")
@UseGuards(RolesGuard)
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  /**
   * 유저 생성
   */
  @Roles(Role.admin)
  @ApiOperation({
    summary: "유저 생성",
  })
  @Post("/signup")
  @ApiBearerAuth("access-token")
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
  @ApiImplicitBody({
    name: "",
    type: ImplicitLoginDto,
    content: undefined,
  })
  @HttpCode(200)
  async signIn(@CurrentUser() user: User): Promise<LoginResponseDto> {
    const accessToken = this.authService.createAccessToken(user.userId);

    const refreshToken = this.authService.createRefreshToken(user.userId);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.userId);

    return { accessToken, refreshToken };
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
  @ApiBearerAuth("access-token")
  @HttpCode(200)
  async signOut(@CurrentUser() user: User) {
    await this.usersService.removeRefreshToken(user.userId);
  }

  /**
   * 리프레시
   */
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post("/refresh-token")
  @ApiOperation({
    summary: "토큰 리프레시",
  })
  @HttpCode(200)
  @ApiImplicitBody({
    name: "",
    type: ImplicitRefreshDto,
    content: undefined,
  })
  async refresh(@CurrentUser() user: User): Promise<RefreshResponseDto> {
    return { accessToken: this.authService.createAccessToken(user.userId) };
  }

  /**
   * 비밀번호 및 권한 변경
   */
  @Roles(Role.admin)
  @Patch("change-user/:userId")
  @ApiOperation({
    summary: "비밀번호 및 권한 변경",
  })
  @ApiBearerAuth("access-token")
  async changeByUser(
    @Param("userId") userId: string,
    @Body() dto: ChangeUserDto
  ) {
    return this.usersService.updateUser(userId, dto.password, dto.roleName);
  }
}
