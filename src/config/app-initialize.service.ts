import { Injectable } from "@nestjs/common";
import { MgObjectRepository } from "../domains/mg-object/mg-object.repository";
import { MgoImageRepository } from "../domains/mgo-image/mgo-image.repository";
import { MgObject } from "../domains/mg-object/entities/mg-object.entity";
import { faker } from "@faker-js/faker";
import {
  ImageStatusFlag,
  MgoImage,
} from "../domains/mgo-image/entities/mgoImage.entity";

const testMgObjectId = "testMgObjectId";

@Injectable()
export class AppInitializeService {
  constructor(
    private readonly mgObjectRepository: MgObjectRepository,
    private readonly imageRepository: MgoImageRepository
  ) {}

  async initializeMgObject() {
    const mgObjectInitPromise = [];
    const isInitialize = await this.isInitializedDefaultMgObject();
    if (!isInitialize) {
      console.log("Start  Initialize mgObject");
      for (let i = 0; i < 90; i++) {
        mgObjectInitPromise.push(this.createDefaultMgObjectForTest(i));
      }
      const results = await Promise.all(mgObjectInitPromise);
      console.log("Initialize MgObject : ", results);
    }
  }

  async isInitializedDefaultMgObject(): Promise<boolean> {
    const mgObject = await this.mgObjectRepository.findOne({
      where: { mgId: `${testMgObjectId}-0` },
    });
    return mgObject != null;
  }

  async createDefaultMgObjectForTest(index: number): Promise<MgObject> {
    const mgObject = new MgObject();
    mgObject.mgId = `${testMgObjectId}-${index}`;
    mgObject.mgName = faker.music.songName();
    mgObject.mgoImages = [];

    const savedMgObject = await this.mgObjectRepository.save(mgObject);
    const imagePromise = [];
    for (let i = 0; i < 90; i++) {
      imagePromise.push(this.createBaseMgoImage(savedMgObject, i));
    }
    savedMgObject.mgoImages = await Promise.all(imagePromise);
    return savedMgObject;
  }

  async createBaseMgoImage(
    mgObject: MgObject,
    index: number
  ): Promise<MgoImage> {
    let statusFlag;
    if (index % 3 === 0) {
      statusFlag = ImageStatusFlag.UNCOMPLETED;
    } else if (index % 3 === 1) {
      statusFlag = ImageStatusFlag.COMPLETED;
    } else if (index % 3 === 2) {
      statusFlag = ImageStatusFlag.TEMP;
    }
    const mgoImage = new MgoImage();
    mgoImage.imgId = faker.name.fullName();
    mgoImage.imgUrl = "https://picsum.photos/300/300";
    mgoImage.cropImgUrl = "https://picsum.photos/150/150";
    mgoImage.imgName = faker.music.songName();
    mgoImage.statusFlag = statusFlag;
    mgoImage.mgObject = mgObject;
    return this.imageRepository.save(mgoImage);
  }
}
