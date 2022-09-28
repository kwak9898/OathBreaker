import { ArrayNotEmpty, IsArray, IsNotEmpty } from "class-validator";
import { ImageStatusFlag } from "../../entities/mgoImage.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateMgoImageStatusDto {
  /**
   * 대상 IMAGE ID 리스트
   * @example ["id1","id2"]
   */
  @IsArray()
  @ArrayNotEmpty()
  imageIds: string[];

  /**
   * 변경할 STATUS
   * @example 0
   */
  @IsNotEmpty()
  @ApiProperty({
    enum: ImageStatusFlag,
    name: "statusFlag",
    required: true,
  })
  statusFlag: ImageStatusFlag;
}
