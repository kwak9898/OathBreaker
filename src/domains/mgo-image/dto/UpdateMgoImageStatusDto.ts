import { ArrayNotEmpty, IsArray, IsBoolean } from "class-validator";

export class UpdateMgoImageStatusDto {
  @IsArray()
  @ArrayNotEmpty()
  imageIds: string[];

  @IsBoolean()
  isComplete: boolean;
}
