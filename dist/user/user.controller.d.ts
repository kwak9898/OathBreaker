import { UserService } from "./user.service";
import { UserLoginDto } from "./dto/userLogin.dto";
export declare class UserController {
    private oathUserService;
    constructor(oathUserService: UserService);
    login(userLoginDto: UserLoginDto): Promise<import("../entity/user.entity").user>;
}
