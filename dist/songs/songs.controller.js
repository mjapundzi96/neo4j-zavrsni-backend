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
const common_1 = require("@nestjs/common");
const songs_service_1 = require("./songs.service");
const get_songs_filter_dto_1 = require("./dto/get-songs-filter.dto");
const passport_1 = require("@nestjs/passport");
const models_1 = require("../models");
let SongsController = class SongsController {
    constructor(SongsService) {
        this.SongsService = SongsService;
    }
    async getSongs(filterDto) {
        return this.SongsService.getSongs(filterDto);
    }
    async getSong(id) {
        return await this.SongsService.getSong(id);
    }
    async getUsersAlsoViewed(id, request) {
        return this.SongsService.getUsersAlsoViewed(id, request.user.id);
    }
    async viewSong(id, request) {
        return await this.SongsService.viewSong(id, request.user.id);
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Query(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_songs_filter_dto_1.GetSongsFilterDto]),
    __metadata("design:returntype", Promise)
], SongsController.prototype, "getSongs", null);
__decorate([
    common_1.Get('/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SongsController.prototype, "getSong", null);
__decorate([
    common_1.Get('/:id/users_also_viewed'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SongsController.prototype, "getUsersAlsoViewed", null);
__decorate([
    common_1.Post('/:id/view'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SongsController.prototype, "viewSong", null);
SongsController = __decorate([
    common_1.Controller('songs'),
    common_1.UseGuards(passport_1.AuthGuard()),
    __metadata("design:paramtypes", [songs_service_1.SongsService])
], SongsController);
exports.SongsController = SongsController;
//# sourceMappingURL=songs.controller.js.map