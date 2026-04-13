"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommesseModule = void 0;
const common_1 = require("@nestjs/common");
const documenti_module_1 = require("../documenti/documenti.module");
const commesse_controller_1 = require("./commesse.controller");
const commesse_service_1 = require("./commesse.service");
let CommesseModule = class CommesseModule {
};
exports.CommesseModule = CommesseModule;
exports.CommesseModule = CommesseModule = __decorate([
    (0, common_1.Module)({
        imports: [documenti_module_1.DocumentiModule],
        controllers: [commesse_controller_1.CommesseController],
        providers: [commesse_service_1.CommesseService],
    })
], CommesseModule);
//# sourceMappingURL=commesse.module.js.map