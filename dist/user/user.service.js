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
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let UserService = class UserService {
    constructor(usersRepository, jwtService, configService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async getByUserId(userId) {
        const user = await this.usersRepository.findOne({ where: { userId } });
        if (!user) {
            throw new common_1.HttpException("유저가 존재하지 않습니다.", common_1.HttpStatus.NOT_FOUND);
        }
        return user;
    }
    async verifyPassword(plainTextPassword, hashedPassword) {
        const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
        if (!isPasswordMatching) {
            throw new common_1.HttpException("잘못된 인증 정보 입니다.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async signUp(userData) {
        const signUp = await this.usersRepository.create(userData);
        await this.usersRepository.save(signUp);
        return signUp;
    }
    async signIn(userId, hashedPassword) {
        try {
            const user = await this.getByUserId(userId);
            await this.verifyPassword(hashedPassword, user.password);
            user.password = undefined;
            return user;
        }
        catch (err) {
            throw new common_1.HttpException("잘못된 인증 정보입니다.", common_1.HttpStatus.BAD_REQUEST);
            console.log(err);
        }
    }
    async signOut() {
        return `Authentication=; HttpOnly; path=/; Max-Age=0`;
    }
    getCookieWithJwtToken(userId) {
        const payload = { userId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get("JWT_EXPIRATION_TIME")}`;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map