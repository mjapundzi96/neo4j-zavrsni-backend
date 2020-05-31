"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const neo4j_config_1 = require("./config/neo4j.config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const genres_module_1 = require("./genres/genres.module");
const artists_module_1 = require("./artists/artists.module");
const songs_module_1 = require("./songs/songs.module");
const albums_module_1 = require("./albums/albums.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [auth_module_1.AuthModule, users_module_1.UsersModule, genres_module_1.GenresModule, artists_module_1.ArtistsModule, albums_module_1.AlbumsModule, songs_module_1.SongsModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, neo4j_config_1.neo4jProvider],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map