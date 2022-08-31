import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Transform } from "class-transformer";
import {BadRequestException} from "@nestjs/common";

export class UserLoginDto {
    @Transform(params => params.value.trim())
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    userId: string;

    @Transform(({ value, obj }) => {
        if (obj.password.includes(value.trim())) {
            throw new BadRequestException("password는 ID와 같은 문자열을 포함할 수 없습니다.")
        }

        return value.trim();
    })
    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
    password: string;
}
