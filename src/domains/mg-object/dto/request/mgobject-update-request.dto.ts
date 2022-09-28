import { PickType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { MgObject } from "../../entities/mg-object.entity";

export class MgobjectUpdateRequestDto extends PickType(MgObject, [
  "mainMgCategory",
  "mediumMgCategory",
  "subMgCategory",
  "mgName",
]) {
  /**
   * 대분류
   * @example 대분류
   */
  @IsString()
  @IsOptional()
  mainMgCategory?: string;

  /**
   * 중분류
   * @example 중분류
   */
  @IsOptional()
  @IsString()
  mediumMgCategory?: string;

  /**
   * 소분류
   * @example 소분류
   */
  @IsString()
  @IsOptional()
  subMgCategory?: string;

  /**
   * 명칭
   * @example 명칭
   */
  @IsString()
  @IsOptional()
  mgName?: string;
}
