import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Role } from "../../../enum/role.enum";

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  // 영문 + 숫자 유효성 체크
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: "영어와 숫자의 조합으로 다시 시도해 주세요.",
  })
  userId: string;

  @MinLength(4)
  @MaxLength(20)
  username: string;

  @MinLength(10)
  @MaxLength(20)
  // 영문 + 숫자 + 특수문자 유효성 체크
  @Matches(/^[a-zA-Z0-9`~!@#$%^&*()-_=+]*$/)
  password: string;

  roleName: Role[];
}
