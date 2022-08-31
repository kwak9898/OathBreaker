import { HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { user } from "../entity/user.entity";
import { Connection, Repository } from "typeorm";
import { UserLoginDto } from "./dto/userLogin.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(user)
        private oathUserRepository: Repository<user>, jwtService: JwtService, connection: Connection
    ) {
    }

    // 존재하는 유저 확인
    async checkUserExist (userId: string): Promise<user> {
        // TODO 로그인 API 구현하기
        // 1. userId, password를 가진 유저가 존재하는지 DB에서 확인 후 없다면 에러 처리하기.
        // 2. JWT 발급하기.
        const user = await this.oathUserRepository.findOne({where: {userId: userId}})

        if (user) {
            return user
        } else {
            throw new HttpException(
                "존재하지 않은 아이디입니다.",
                HttpStatus.NOT_FOUND
            )
        }
    }

    // 유저 생성
    async createUser(userId: string, password: string) {
        const existUser = await this.checkUserExist(userId)

        if (existUser) {
            throw new UnprocessableEntityException("해당 아이디로는 가입할 수 없습니다.")
        }
    }
}
