import { Injectable } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { MgObjectRepository } from "../../domains/mg-object/mg-object.repository";
import { MgObject } from "../../domains/mg-object/entities/mg-object.entity";
import {
  ImageStatusFlag,
  MgoImage,
} from "../../domains/mgo-image/entities/mgoImage.entity";
import { MgoImageRepository } from "../../domains/mgo-image/mgo-image.repository";

@Injectable()
export class MgObjectFactory {
  constructor(
    private readonly repository: MgObjectRepository,
    private readonly imageRepository: MgoImageRepository
  ) {}

  async createBaseMgObject(): Promise<MgObject> {
    const imagePromise = [];
    const mgObject = new MgObject();
    mgObject.mgId = faker.name.fullName();
    mgObject.mgName = faker.music.songName();
    mgObject.mgoImages = [];
    mgObject.mainMgCategory = faker.name.lastName();
    mgObject.mediumMgCategory = faker.name.lastName();
    mgObject.subMgCategory = faker.name.lastName();

    const savedMgObject = await this.repository.save(mgObject);
    for (let i = 0; i < 8; i++) {
      let imageStatusFlag: ImageStatusFlag;
      if (i % 4 === 0) {
        imageStatusFlag = ImageStatusFlag.UNCOMPLETED;
      } else if (i % 4 === 1) {
        imageStatusFlag = ImageStatusFlag.COMPLETED;
      } else if (i % 4 === 2) {
        imageStatusFlag = ImageStatusFlag.TEMP;
      } else if (i % 4 === 3) {
        imageStatusFlag = ImageStatusFlag.OTHER;
      }
      imagePromise.push(
        this.createBaseMgoImage(savedMgObject, imageStatusFlag)
      );
    }
    savedMgObject.mgoImages = await Promise.all(imagePromise);
    return savedMgObject;
  }

  async createBaseMgoImage(
    mgObject: MgObject,
    statusFlag: ImageStatusFlag
  ): Promise<MgoImage> {
    const mgoImage = new MgoImage();
    mgoImage.imgId = faker.name.fullName();
    mgoImage.imgUrl = faker.internet.url();
    mgoImage.imgName = faker.music.songName();
    mgoImage.mgObject = mgObject;
    mgoImage.statusFlag = statusFlag;
    return this.imageRepository.save(mgoImage);
  }
}
