"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const dotenv = require("dotenv");
const path = require("path");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
dotenv.config({
    path: path.resolve(process.env.NODE_ENV === "production"
        ? ".production.env"
        : process.env.NODE_ENV === "stage"
            ? ".stage.env"
            : ".development.env"),
});
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map