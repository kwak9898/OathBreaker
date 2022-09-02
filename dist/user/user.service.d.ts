import { User } from "../entity/user.entity";
import { Repository } from "typeorm";
import { UserLoginDto } from "./dto/userLogin.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
export declare class UserService {
    private usersRepository;
    private jwtService;
    private configService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService, configService: ConfigService);
    getByUserId(userId: string): Promise<User>;
    verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<void>;
    signUp(userData: UserLoginDto): Promise<User>;
    signIn(userId: string, hashedPassword: string): Promise<User>;
    signOut(): Promise<string>;
    getCookieWithJwtToken(userId: string): string;
}
