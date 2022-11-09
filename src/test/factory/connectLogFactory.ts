import { Injectable } from "@nestjs/common";
import { ConnectLog } from "../../domains/connect-logs/entities/connect-log.entity";
import { faker } from "@faker-js/faker";
import { ConnectLogsRepository } from "../../domains/connect-logs/connect-logs.repository";
import { User } from "../../domains/users/entities/user.entity";
import { hash } from "bcryptjs";
import { Role } from "../../domains/roles/enum/role.enum";
import { UserRepository } from "../../domains/users/user.repository";

@Injectable()
export class ConnectLogFactory {
  constructor(
    private readonly repository: ConnectLogsRepository,
    readonly usersRepository: UserRepository
  ) {}

  async createBaseUser() {
    const user = new User();
    user.userId = "createUser123";
    user.username = faker.name.middleName();
    user.password = await hash("thispassword11@", 12);
    user.team = faker.company.name();
    user.roleName = Role.manager;
    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  async createBaseLog(log?: ConnectLog): Promise<ConnectLog> {
    const connectLog = new ConnectLog();
    connectLog.url = faker.internet.url();
    connectLog.ip = faker.internet.ip();
    connectLog.accessAt = faker.date.recent();
    connectLog.user = await this.createBaseUser();
    return await this.repository.save(connectLog);
  }

  async createBaseLogList(): Promise<ConnectLog> {
    const connectLog = new ConnectLog();
    connectLog.url = faker.internet.url();
    connectLog.ip = faker.internet.ip();
    connectLog.accessAt = faker.date.recent();
    connectLog.user = await this.createBaseUser();

    const connectLogList = [];
    const savedLog = await this.repository.save(connectLog);

    for (let i = 0; i < 10; i++) {
      connectLogList.push(await this.createBaseLog(savedLog));
    }
    return savedLog;
  }
}
