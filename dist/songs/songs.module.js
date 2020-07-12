"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const songs_controller_1 = require("./songs.controller");
const songs_service_1 = require("./songs.service");
const neo4j_module_1 = require("./../neo4j/neo4j.module");
const auth_module_1 = require("../auth/auth.module");
let SongsModule = class SongsModule {
};
SongsModule = __decorate([
    common_1.Module({
        imports: [neo4j_module_1.Neo4jModule, auth_module_1.AuthModule],
        controllers: [songs_controller_1.SongsController],
        providers: [songs_service_1.SongsService]
    })
], SongsModule);
exports.SongsModule = SongsModule;
//# sourceMappingURL=songs.module.js.map