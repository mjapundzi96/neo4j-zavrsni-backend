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
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const Neo4j = require("neo4j-driver");
const user_model_1 = require("./../users/user.model");
let AuthService = class AuthService {
    constructor(jwtService, neo4j) {
        this.jwtService = jwtService;
        this.neo4j = neo4j;
    }
    async signUp(authCredentialsDto) {
        const { username, password } = authCredentialsDto;
        const user = new user_model_1.User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        this.neo4j.session().run('CREATE (n: User {username: $username, password: $password, salt: $salt })', {
            username: user.username,
            password: user.password,
            salt: user.salt
        });
    }
    async signIn(authCredentialsDto) {
        const username = await this.validateUserPassword(authCredentialsDto);
        if (!username) {
            throw new common_1.BadRequestException('invalid credentials');
        }
        const payload = { username };
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken };
    }
    async validateUserPassword(authCredentialsDto) {
        const { username, password } = authCredentialsDto;
        const user = (await this.neo4j.session().run('MATCH (n:User {username: $username}) RETURN n', { username: username }));
        if (user.records.length) {
            const userProperties = user.records[0]["_fields"][0].properties;
            const hash = await bcrypt.hash(password, userProperties.salt);
            if (user && hash === userProperties.password) {
                return userProperties.username;
            }
            else {
                return null;
            }
        }
    }
    async hashPassword(password, salt) {
        return bcrypt.hash(password, salt);
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(1, common_1.Inject("Neo4j")),
    __metadata("design:paramtypes", [jwt_1.JwtService, Object])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map