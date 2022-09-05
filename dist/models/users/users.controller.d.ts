import { UsersService } from "./users.service";
import { User } from "../../database/entities/user.entity";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<User[]>;
    findOne(userId: string): Promise<User>;
    remove(userId: string): Promise<void>;
    createUser(user: User): Promise<User>;
}
