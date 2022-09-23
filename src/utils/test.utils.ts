import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { Test } from "supertest";

export class RequestHelper {
  constructor(private app: INestApplication, private token: string) {}

  async get(url: string, query?: any): Promise<Test> {
    return request(this.app.getHttpServer())
      .get(url)
      .query(query)
      .set({ Authorization: `Bearer ${this.token}` });
  }

  async post(url: string, body?: any): Promise<Test> {
    return request(this.app.getHttpServer())
      .post(url)
      .send(body)
      .set({ Authorization: `Bearer ${this.token}` });
  }

  async patch(url: string, body?: any): Promise<Test> {
    return request(this.app.getHttpServer())
      .patch(url)
      .send(body)
      .set({ Authorization: `Bearer ${this.token}` });
  }

  async delete(url: string): Promise<Test> {
    return request(this.app.getHttpServer())
      .delete(url)
      .set({ Authorization: `Bearer ${this.token}` });
  }
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
