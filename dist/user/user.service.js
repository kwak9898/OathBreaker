"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../entity/user.entity");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
let UserService = class UserService {
    constructor(oathUserRepository, jwtService, connection) {
        this.oathUserRepository = oathUserRepository;
    }
    async checkUserExist(userId) {
        const user = await this.oathUserRepository.findOne({ where: { userId: userId } });
        if (user) {
            return user;
        }
        else {
            throw new common_1.HttpException("존재하지 않은 아이디입니다.", common_1.HttpStatus.NOT_FOUND);
        }
    }
    async createUser(userId, password) {
        const existUser = await this.checkUserExist(userId);
        if (existUser) {
            throw new common_1.UnprocessableEntityException("해당 아이디로는 가입할 수 없습니다.");
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.user)),
    __metadata("design:paramtypes", [typeorm_2.Repository, jwt_1.JwtService, typeorm_2.Connection])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map