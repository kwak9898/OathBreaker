import { Injectable, Module, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UserModule } from "../user/user.module";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("Request...");
    next();
  }
}
