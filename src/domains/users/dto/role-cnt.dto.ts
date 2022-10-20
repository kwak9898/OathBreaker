export class RoleCntDto {
  adminCnt: number;
  registerCnt: number;

  constructor(adminCnt: number, registerCnt: number) {
    this.adminCnt = adminCnt;
    this.registerCnt = registerCnt;
  }
}
