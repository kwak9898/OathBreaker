import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  // 영문 + 숫자 유효성 체크
  @Matches(/^[a-zA-Z0-9~!@#$%^&*]*$/, {
    message:
      "10자 이상 20자 이하로 영어, 숫자, 특수문자의 조합으로 다시 시도해주세요",
  })
  userId: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(20)
  // 영문 + 숫자 + 특수문자 유효성 체크
  @Matches(/^[a-zA-Z0-9`~!@#$%^&*()-_=+]*$/)
  password: string;

  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9`~!@#$%^&*()-_=+]*$/)
  confirmPassword: string;

  @IsNotEmpty()
  team: string;

  roleName: string;
}
