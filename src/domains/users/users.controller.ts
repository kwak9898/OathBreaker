import { UsersService } from "./users.service";
import { Controller, Get } from "@nestjs/common";
import { User } from "./entities/user.entity";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("")
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(":userId")
  async getUserById(userId: string): Promise<User> {
    return this.usersService.getUserById(userId);
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
