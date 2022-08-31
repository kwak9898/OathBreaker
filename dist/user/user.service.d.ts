import { user } from "../entity/user.entity";
import { Connection, Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
export declare class UserService {
    private oathUserRepository;
    constructor(oathUserRepository: Repository<user>, jwtService: JwtService, connection: Connection);
    checkUserExist(userId: string): Promise<user>;
    createUser(userId: string, password: string): Promise<void>;
}
