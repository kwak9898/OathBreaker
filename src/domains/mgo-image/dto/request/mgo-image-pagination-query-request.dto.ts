import { ImageStatusFlag } from "../../entities/mgoImage.entity";

export class MgoImagePaginationQueryRequestDto {
  /**
   * 이미지 상태 값
   * @example 1
   */
  statusFlag?: ImageStatusFlag;
  /**
   * MG-OBJECT ID
   * @example ID
   */
  mgObjectId?: string;
}
