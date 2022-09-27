import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

console.log("지나간다");

@Injectable()
export class JwtRefreshGuard extends AuthGuard("jwt-refresh-token") {}
