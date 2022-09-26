import { IsString } from "class-validator";

export class UpdateMgoImageObjectDto {
  @IsString()
  imageId: string;

  @IsString()
  mgObjectId: string;
}
