import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {OathUser} from "../entity/oathUser.entity";
import {Repository} from "typeorm";
import {UserDto} from "../dto/user.dto";

@Injectable()
export class OathUserService {
    constructor(
        @InjectRepository(OathUser)
        private oathUserRepository: Repository<OathUser>
    ) {
    }

    async login(userId: string): Promise<OathUser> {
        const user = await this.oathUserRepository.findOne({})

        if (user) {
            return user;
        } else {
            throw new HttpException(
                "존재하지 않은 아이디입니다.",
                HttpStatus.NOT_FOUND
            );
        }
    }
}
