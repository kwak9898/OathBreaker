import { Controller, Delete, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Public } from "../../dacorators/skip-auth.decorator";
import { User } from "./entities/user.entity";

@Controller("users")
@Public()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(":userId")
  async findOne(@Param("userId") userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  @Delete(":userId")
  remove(@Param() userId: string): Promise<void> {
    return this.usersService.remove(userId);
  }

  @Delete(":userId")
  async deleteByUser(@Param() userId: string) {
    return await this.usersService.remove(userId);
  }
}
