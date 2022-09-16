<<<<<<< HEAD
import { Controller, Delete, Get, Param } from "@nestjs/common";
=======
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
>>>>>>> acb1f7284f5d2ff2a45613df6cb98172de92c8c6
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

<<<<<<< HEAD
=======
  @Public()
  @Post()
  async createUser(@Body() user: User): Promise<User> {
    await this.usersService.createUser(user);
    return user;
  }

>>>>>>> acb1f7284f5d2ff2a45613df6cb98172de92c8c6
  @Delete(":userId")
  async deleteByUser(@Param() userId: string) {
    return await this.usersService.deleteByUser(userId);
  }
}
