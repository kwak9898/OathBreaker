import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Public } from "../../dacorators/skip-auth.decorator";
import { User } from "./entities/user.entity";
import { ApiTags } from "@nestjs/swagger";

@Controller("users")
@ApiTags("USERS")
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
  @Patch("delete-user")
  async deleteByUser(@Body() userId: string) {
    return await this.usersService.deleteByUser(userId);
  }
}
