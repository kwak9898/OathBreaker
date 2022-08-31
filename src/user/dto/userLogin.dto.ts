import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UserLoginDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    userId: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
    password: string;
}
