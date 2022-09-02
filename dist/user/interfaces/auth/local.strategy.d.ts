import { Strategy } from "passport-local";
import { UserService } from "../../user.service";
import { User } from "../../../entity/user.entity";
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(userId: string, password: string): Promise<User>;
}
export {};
