export class ChangeUserDto {
  /**
   * 변경할 패스워드
   */
  password?: string;

  /**
   * 변경할 권한
   */
  roleName?: string;
}
