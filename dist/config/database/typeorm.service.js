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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeormService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mgoImage_entity_1 = require("../../entity/mgoImage.entity");
const mgObject_entity_1 = require("../../entity/mgObject.entity");
const user_entity_1 = require("../../entity/user.entity");
let TypeormService = class TypeormService {
    constructor(configService) {
        this.configService = configService;
    }
    createTypeOrmOptions() {
        return {
            type: "postgres",
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [mgoImage_entity_1.MgoImage, mgObject_entity_1.MgObject, user_entity_1.User],
            synchronize: false,
            logging: true,
        };
    }
};
TypeormService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TypeormService);
exports.TypeormService = TypeormService;
//# sourceMappingURL=typeorm.service.js.map