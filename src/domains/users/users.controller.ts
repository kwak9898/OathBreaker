<<<<<<< HEAD
import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
=======
import { Controller, Delete, Get, Param } from "@nestjs/common";
>>>>>>> d83053e6 (사용하지 않은 함수 및 컨트롤러 정리 / 중복 아이디 처리)
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(":userId")
  async findOne(@Param("userId") userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  @Delete(":userId")
<<<<<<< HEAD
  async deleteByUser(@Param("userId") userId: string): Promise<void> {
    return await this.usersService.remove(userId);
=======
  async remove(@Param() userId: string): Promise<void> {
    return this.usersService.remove(userId);
  }

  @Delete(":userId")
  async deleteByUser(@Param() userId: string) {
    return await this.usersService.deleteByUser(userId);
>>>>>>> d83053e6 (사용하지 않은 함수 및 컨트롤러 정리 / 중복 아이디 처리)
  }
}
