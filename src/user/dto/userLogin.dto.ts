import {IsNotEmpty} from "class-validator";

export class UserLoginDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    password: string;
}
