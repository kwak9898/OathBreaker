import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";
import { UserLoginDto } from "./dto/userLogin.dto";
import * as bcrypt from "bcrypt";

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

  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        "잘못된 인증 정보 입니다.",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async signUp(userData: UserLoginDto) {
    const signUp = await this.usersRepository.create(userData);

    await this.usersRepository.save(signUp);
    return signUp;
  }

  async signIn(userId: string, hashedPassword: string) {
    try {
      const user = await this.getByUserId(userId);
      await this.verifyPassword(hashedPassword, user.password);
      user.password = undefined;

      return user;
    } catch (err) {
      throw new HttpException(
        "잘못된 인증 정보입니다.",
        HttpStatus.BAD_REQUEST
      );
      console.log(err);
    }
  }
}
