import { Injectable } from "@nestjs/common";
import { MgoImageRepository } from "../../domains/mgo-image/mgo-image.repository";
import { MgoImage } from "../../domains/mgo-image/entities/mgoImage.entity";

@Injectable()
export class MgObjectImageFactory {
  constructor(private readonly repository: MgoImageRepository) {}

  async createBaseMgObjectImage(): Promise<MgoImage> {
    const mgoImage = new MgoImage();
    // return this.repository.save(mgObject);
    return null;
  }
}
