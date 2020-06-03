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
const users_service_1 = require("./users.service");
const get_users_filter_dto_1 = require("./dto/get-users-filter.dto");
const passport_1 = require("@nestjs/passport");
const get_recommended_filter_dto_1 = require("./dto/get-recommended-filter.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getUsers(filterDto) {
        return this.usersService.getUsers(filterDto);
    }
    async getUser(id) {
        return this.usersService.getUser(id);
    }
    async getListenHistory(user_id) {
        return this.usersService.getListenHistory(user_id);
    }
    async getRecommendedAlbums(user_id, getRecommendedFilterDto) {
        return this.usersService.getRecommendendedAlbums(user_id, getRecommendedFilterDto);
    }
    async getRecommendedArtists(user_id, getRecommendedFilterDto) {
        return this.usersService.getRecommendedArtists(user_id, getRecommendedFilterDto);
    }
};
__decorate([
    common_1.UseGuards(passport_1.AuthGuard()),
    common_1.Get(),
    __param(0, common_1.Query(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_users_filter_dto_1.GetUsersFilterDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    common_1.Get('/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUser", null);
__decorate([
    common_1.Get('/:id/listen_history'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getListenHistory", null);
__decorate([
    common_1.Get('/:id/recommended_albums'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Query(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, get_recommended_filter_dto_1.GetRecommendedFilterDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRecommendedAlbums", null);
__decorate([
    common_1.Get('/:id/recommended_artists'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Query(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, get_recommended_filter_dto_1.GetRecommendedFilterDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRecommendedArtists", null);
UsersController = __decorate([
    common_1.Controller('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map