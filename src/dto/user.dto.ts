import {IsNotEmpty} from "class-validator";

export class UserDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    password: string;
}
