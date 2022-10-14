import { Injectable } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { MgObject } from "../../domains/mg-object/entities/mg-object.entity";
import { MgoImage } from "../../domains/mgo-image/entities/mgoImage.entity";
import { MgoImageRepository } from "../../domains/mgo-image/mgo-image.repository";
import { MgObjectRepository } from "../../domains/mg-object/mg-object.repository";
import { AssignMgRepository } from "../../domains/assign-mg-object/assign-mg-repository";
import { AssignMgObject } from "../../domains/assign-mg-object/entities/assign-mg-object";
import { User } from "../../domains/users/entities/user.entity";

@Injectable()
export class AssignMgobjectFactory {
  constructor(
    private readonly assignRepository: AssignMgRepository,
    private readonly mgObjectRepository: MgObjectRepository,
    private readonly imageRepository: MgoImageRepository
  ) {}

  async createBaseAssignMgObject(
    mgObject: MgObject,
    user: User
  ): Promise<AssignMgObject> {
    const assignMgObject = new AssignMgObject();
    assignMgObject.mgObject = mgObject;
    assignMgObject.user = user;
    return this.assignRepository.save(assignMgObject);
  }

  async createBaseMgObject(): Promise<MgObject> {
    const mgObject = new MgObject();
    mgObject.mgId = faker.name.fullName();
    mgObject.mgName = faker.music.songName();
    mgObject.mgoImages = [];

    const savedMgObject = await this.mgObjectRepository.save(mgObject);
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
    mgoImage.mgObject = mgObject;
    return this.imageRepository.save(mgoImage);
  }
}
