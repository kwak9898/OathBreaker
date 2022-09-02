import { UserService } from "./user.service";
import { RequestWithUser } from "./interfaces/auth/requestWithUser.interface";
import { Response } from "express";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    login(request: RequestWithUser, response: Response): Promise<Response<any, Record<string, any>>>;
    logOut(request: RequestWithUser, response: Response): Promise<Response<any, Record<string, any>>>;
    getByToken(request: RequestWithUser): Promise<import("../entity/user.entity").User>;
}
