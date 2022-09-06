import {Body, Controller, Delete, Get, Param, Patch, Post} from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "../../database/entities/user.entity";
import { Public } from "../../dacorators/skipAuth.decorator";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(":userId")
  findOne(@Param() userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  @Delete(":userId")
  async remove(@Param() userId: string): Promise<void> {
    return this.usersService.remove(userId);
  }

  @Public()
  @Post()
  async createUser(@Body() user: User): Promise<User> {
    await this.usersService.createUser(user);
    return user;
  }

  @Public()
  @Patch("change-password")
  async deleteByUser(@Body() userId: string) {
    return await this.usersService.deleteByUser(userId);
  }
}
