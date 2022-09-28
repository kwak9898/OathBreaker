import { IsString } from "class-validator";

export class UpdateMgoImageMgObjectDto {
  /**
   * 대상 IMAGE ID
   * @example id1
   */
  @IsString()
  imageId: string;

  /**
   * 변경할 MG-OBJECT ID
   * @example id2
   */
  @IsString()
  mgObjectId: string;
}
