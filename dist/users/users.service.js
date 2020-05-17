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
const Neo4j = require("neo4j-driver");
let UsersService = class UsersService {
    constructor(neo4j) {
        this.neo4j = neo4j;
    }
    async getUsers(filterDto) {
        const { username } = filterDto;
        let queryUser = "n:User";
        if (username) {
            queryUser += " {username:$username}";
        }
        const users = (await this.neo4j.session().run(`MATCH (${queryUser}) RETURN n`, { username: username })).records;
        return users;
    }
    async getUser(user_id) {
        const userResult = (await this.neo4j.session().run(`MATCH (n:User) where ID(n)=${user_id}
        RETURN n;`)).records[0];
        if (userResult) {
            const fields = userResult["_fields"][0];
            return {
                id: fields.identity.low,
                username: fields.properties.username,
            };
        }
    }
    async getFavoriteArtists(user_id) {
        let artists = [];
        const artistsResults = (await this.neo4j.session().run(`MATCH (n:User)-[r:HAS_FAVORITE_GENRE]->(g:Genre)<-[r2:IS_GENRE]-(a:Artist) where ID(n)=${user_id}
        RETURN a;`)).records;
        artistsResults.forEach(result => {
            const fields = result["_fields"][0];
            artists.push({
                id: fields.identity.low,
                name: fields.properties.name,
                type: fields.properties.type,
                country: fields.properties.country
            });
        });
        return artists;
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject("Neo4j")),
    __metadata("design:paramtypes", [Object])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map