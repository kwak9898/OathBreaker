import { ImageStatusFlag } from "../../entities/mgoImage.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class MgoImagePaginationQueryRequestDto {
  /**
   * 이미지 상태 값
   */
  @ApiProperty({
    example: [
      ImageStatusFlag.INCOMPLETE_AND_COMPLETE,
      ImageStatusFlag.UNCOMPLETED,
      ImageStatusFlag.COMPLETED,
      ImageStatusFlag.TEMP,
      ImageStatusFlag.OTHER,
    ],
    type: "number",
    required: false,
    description:
      "미완료 + 완료 : -1 ,미완료 : 0, 완료 : 1, 임시 : 2, OTHER : 3",
  })
  @IsOptional()
  statusFlag?: number;

  /**
   * MG-OBJECT ID
   * @example ID
   */
  @IsOptional()
  @IsString()
  mgObjectId?: string;
}
