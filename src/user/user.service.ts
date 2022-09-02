import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Connection, Repository } from "typeorm";
import { UserLoginDto } from "./dto/userLogin.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { ConfigType } from "@nestjs/config";
import * as jwt from "jsonwebtoken";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async getByUserId(userId: string) {
    const user = await this.usersRepository.findOne({ where: { userId } });

    if (!user) {
      throw new HttpException(
        "유저가 존재하지 않습니다.",
        HttpStatus.NOT_FOUND
      );
    }
    return user;
  }

  async signUp(userData: UserLoginDto) {
    const signUp = await this.usersRepository.create(userData);

    await this.usersRepository.save(signUp);
    return signUp;
  }
}
