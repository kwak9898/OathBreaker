import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    NotFoundException,
    UnprocessableEntityException
} from '@nestjs/common';
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
        private userRepository: Repository<User>, jwtService: JwtService, connection: Connection,

        @Inject(authConfig.KEY)
        private config: ConfigType<typeof authConfig>
    ) {
    }

    // 존재하는 유저 확인
    async checkUserExist (userId: string): Promise<User> {
        // TODO 로그인 API 구현하기
        // 1. userId, password를 가진 유저가 존재하는지 DB에서 확인 후 없다면 에러 처리하기.
        // 2. JWT 발급하기.
        const user = await this.userRepository.findOne({where: {userId: userId}})

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

    // JWT 발급
    private async getByJwt(user: UserLoginDto) {
        const payload = { ...user }

        return jwt.sign(payload, this.config.jwtSecret, {
            expiresIn: "1d",
            audience: "exampleId",
            issuer: "exampleId"
        })
    }

    // 회원 로그인
    async login(userID: string, password: string): Promise<string> {
        const user = await this.userRepository.findOne({where: {userId: userID, password: password}});

        if (!user) {
            throw new NotFoundException("유저가 존재하지 않습니다.");
        } else {
            return this.getByJwt({
                userId: user.userId,
                password: user.password
            })
        }
    }
}
