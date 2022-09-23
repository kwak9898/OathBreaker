import { PickType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { MgObject } from "../../entities/mg-object.entity";

export class MgObjectUpdateDto extends PickType(MgObject, [
  "mainMgCategory",
  "mediumMgCategory",
  "subMgCategory",
]) {
  @IsString()
  @IsOptional()
  mainMgCategory?: string;

  @IsOptional()
  @IsString()
  mediumMgCategory?: string;

  @IsString()
  @IsOptional()
  subMgCategory?: string;
}
