import { MgObject } from "../../entities/mg-object.entity";

export class MgObjectRecommendListResponseDto {
  /**
   * MG ID
   */
  mgId: string;
  /**
   * MG NAME
   */
  mgName: string;
  /**
   * 대표 IMAGE URL
   */
  imageUrl: string;

  constructor(item: Partial<MgObject>) {
    this.mgId = item.mgId;
    this.mgName = item.mgName;
    this.imageUrl = "http://placeimg.com/480/480/any";
  }
}
