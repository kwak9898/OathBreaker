import { MgObject } from "../../entities/mg-object.entity";

export class MgobjectAiSearchListResponseDto {
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

  /**
   * 대분류
   */
  mainMgCategory: string;

  /**
   * 중분류
   */
  mediumMgCategory: string;

  /**
   * 소분류
   */
  subMgCategory: string;

  constructor(item: Partial<MgObject>) {
    this.mgId = item.mgId;
    this.mgName = item.mgName;
    this.imageUrl = "http://placeimg.com/480/480/any";
    this.mainMgCategory = item.mainMgCategory;
    this.mediumMgCategory = item.mediumMgCategory;
    this.subMgCategory = item.subMgCategory;
  }
}
