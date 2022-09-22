import { UsersService } from "./users.service";
import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { User } from "./entities/user.entity";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  // 유저 전체 조회
  @Get("")
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  // 특정 유저 조회
  @Get(":userId")
  async getUserById(@Param("userId") userId: string): Promise<User> {
    return this.usersService.getUserById(userId);
  }

  // 특정 유저 수정
  @Patch(":userId")
  async updateUser(
    @Param("userId") userId: string,
    @Body() user: User
  ): Promise<User> {
    return this.usersService.updateUser(userId, user);
  }
}

//
//   @Delete(":userId")
// <<<<<<< HEAD
//   async deleteByUser(@Param("userId") userId: string): Promise<void> {
//     return await this.usersService.remove(userId);
// =======
//   async remove(@Param() userId: string): Promise<void> {
//     return this.usersService.remove(userId);
//   }
//
//   @Delete(":userId")
//   async deleteByUser(@Param() userId: string) {
//     return await this.usersService.deleteByUser(userId);
// >>>>>>> d83053e6 (사용하지 않은 함수 및 컨트롤러 정리 / 중복 아이디 처리)
//   }
