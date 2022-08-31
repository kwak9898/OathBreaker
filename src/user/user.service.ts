import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {OathUser} from "../entity/oathUser.entity";
import {Repository} from "typeorm";
import {UserLoginDto} from "./dto/userLogin.dto";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(OathUser)
        private oathUserRepository: Repository<OathUser>, jwtService: JwtService
    ) {
    }

    // 존재하는 유저 로그인
    async existUserLogin (userId: string, password: string): Promise<OathUser> {
        // TODO 로그인 API 구현하기
        // 1. userId, password를 가진 유저가 존재하는지 DB에서 확인 후 없다면 에러 처리하기.
        // 2. JWT 발급하기.

        return
    }
}
