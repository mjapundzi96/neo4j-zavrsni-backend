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
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_model_1 = require("../models/user.model");
const neo4j_service_1 = require("./../neo4j/neo4j.service");
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
        try {
            await this.neo4j.query(`
            CREATE (n: User {
                username: '${user.username}', 
                password: '${user.password}', 
                salt: '${user.salt}' })
            `);
            return true;
        }
        catch (err) {
            throw new common_1.BadRequestException(err);
        }
    }
    async signIn(authCredentialsDto) {
        const user = await this.validateUserPassword(authCredentialsDto);
        if (!user) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        const username = user.username;
        const id = user.id;
        const payload = { username, id };
        const accessToken = await this.jwtService.sign(payload);
        const user_result = await this.neo4j.query(`MATCH (n:User {username: '${username}'}) RETURN { id: ID(n) } AS user`);
        const user_id = user_result[0].get('user').id.low;
        return {
            accessToken: accessToken,
            user_id: user_id
        };
    }
    async validateUserPassword(authCredentialsDto) {
        const { username, password } = authCredentialsDto;
        const user_result = await this.neo4j.query(`MATCH (n:User {username: '${username}'}) RETURN {
            id: ID(n),
            username:n.username,
            password: n.password,
            salt: n.salt
        } as user;`);
        if (user_result.length) {
            const user = Object.assign(Object.assign({}, user_result[0].get("user")), { id: user_result[0].get("user").id.low });
            const hash = await bcrypt.hash(password, user.salt);
            if (user && hash === user.password) {
                return user;
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
    __metadata("design:paramtypes", [jwt_1.JwtService,
        neo4j_service_1.Neo4jService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map