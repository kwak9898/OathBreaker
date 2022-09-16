import { Controller, Delete, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";

@Controller("users")
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
  async deleteByUser(@Param("userId") userId: string): Promise<void> {
    return await this.usersService.remove(userId);
  }
}
