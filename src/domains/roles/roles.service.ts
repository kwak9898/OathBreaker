import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "../users/users.service";
import { UserRepository } from "../../repositories/user.repository";

@Injectable()
export class RolesService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Ro)
    private usersRepository: UserRepository
  ) {}

  // 유저 역할 생ㅅ어
}
