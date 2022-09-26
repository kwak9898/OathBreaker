import { Injectable } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { MgObjectRepository } from "../../domains/mg-object/mg-object.repository";
import { MgObject } from "../../domains/mg-object/entities/mg-object.entity";
import { MgoImage } from "../../domains/mgo-image/entities/mgoImage.entity";
import { MgoImageRepository } from "../../domains/mgo-image/mgo-image.repository";

@Injectable()
export class MgObjectFactory {
  constructor(
    private readonly repository: MgObjectRepository,
    private readonly imageRepository: MgoImageRepository
  ) {}

  async createBaseMgObject(): Promise<MgObject> {
    const mgObject = new MgObject();
    mgObject.mgId = faker.name.fullName();
    mgObject.mgName = faker.music.songName();
    mgObject.isActive = true;
    mgObject.mgoImages = [];

    const savedMgObject = await this.repository.save(mgObject);
    for (let i = 0; i < 3; i++) {
      mgObject.mgoImages.push(await this.createBaseMgoImage(savedMgObject));
    }
    return savedMgObject;
  }

  async createBaseMgoImage(mgObject: MgObject): Promise<MgoImage> {
    const mgoImage = new MgoImage();
    mgoImage.imgId = faker.name.fullName();
    mgoImage.imgUrl = faker.internet.url();
    mgoImage.imgName = faker.music.songName();
    mgoImage.isActive = true;
    mgoImage.mgObject = mgObject;
    return this.imageRepository.save(mgoImage);
  }
}
