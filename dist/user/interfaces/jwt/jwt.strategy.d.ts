import { Strategy } from "passport-jwt";
import { UserService } from "../../user.service";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private userService;
    constructor(userService: UserService);
}
export {};
