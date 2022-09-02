import { Strategy } from "passport-jwt";
import { UserService } from "../../user.service";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "./tokenpayload.interface";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private userService;
    constructor(configService: ConfigService, userService: UserService);
    validate(payload: TokenPayload): Promise<import("../../../entity/user.entity").User>;
}
export {};
