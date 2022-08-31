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
        try {
            const user = await this.oathUserRepository.findOne({select: ["password"], where: {userId: userId}});
            const isPasswordMatching = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordMatching) {
                throw new HttpException(
                    "잘못된 인증 정보입니다.",
                    HttpStatus.BAD_REQUEST,
                );
            }
            user.password = undefined;

            return user
        } catch (err) {
            throw new HttpException(
                "잘못된 경로입니다.",
                HttpStatus.BAD_REQUEST,
            )
        }
    }
}

// const user = await this.oathUserRepository.findOne({select: ['password'], where: {userId: userId}})
//
// if (user) {
//     return user;
// } else {
//     throw new HttpException(
//         "존재하지 않은 아이디입니다.",
//         HttpStatus.NOT_FOUND
//     );
// }
