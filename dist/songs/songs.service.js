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
const neo4j_service_1 = require("./../neo4j/neo4j.service");
let SongsService = class SongsService {
    constructor(neo4j) {
        this.neo4j = neo4j;
    }
    async getSongs(filterDto) {
    }
    async getSong(id) {
    }
    async viewSong(id, user_id) {
        await this.neo4j.query(`MATCH (u:User)-[r:HAS_VIEWED]-(s:Song) WHERE ID(u)=${user_id} AND ID(s)=${id} DELETE r;`);
        const create_query = await this.neo4j.query(`MATCH (u:User),(s:Song)
        WHERE ID(u)=${user_id} and ID(s)=${id}
        CREATE (u)-[r:HAS_VIEWED{ date_time: datetime({timezone:'Europe/Zagreb'}) }]->(s)
        SET s.views = s.views + 1
        RETURN true AS result`);
        if (create_query[0].get('result')) {
            return true;
        }
        else
            throw new common_1.NotFoundException('User does not exist');
    }
};
SongsService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [neo4j_service_1.Neo4jService])
], SongsService);
exports.SongsService = SongsService;
//# sourceMappingURL=songs.service.js.map