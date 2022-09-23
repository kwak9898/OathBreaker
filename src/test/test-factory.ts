import { MgObject } from "../domains/mg-object/entities/mg-object.entity";
import { User } from "../domains/users/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { MgObjectRepository } from "../domains/mg-object/mg-object.repository";
import { faker } from "@faker-js/faker";

@Injectable()
export class MgObjectFactory {
  constructor(private readonly repository: MgObjectRepository) {}

  async createBaseMgObject(): Promise<MgObject> {
    const mgObject = new MgObject();
    mgObject.mgId = faker.name.fullName();
    mgObject.mgName = faker.music.songName();
    mgObject.isActive = true;
    return this.repository.save(mgObject);
  }
}

export class UserFactory {
  static createBaseUser() {
    const user = new User();
    user.userId = "userId";
    user.password = "password";
    user.isActive = true;
    return user;
  }
}
