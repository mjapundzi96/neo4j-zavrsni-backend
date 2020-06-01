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
let SongsService = class SongsService {
    constructor(neo4j) {
        this.neo4j = neo4j;
    }
    async getSongs(filterDto) {
        const { title } = filterDto;
        const songs_results = (await this.neo4j.session().run(`Match (n:Song) Where toUpper(n.title) CONTAINS toUpper('${title}') return n;`)).records;
        let songs = [];
        songs_results.forEach(result => {
            const fields = result["_fields"][0];
            songs.push({
                id: fields.identity.low,
                title: fields.properties.title,
                views: fields.properties.views.low,
                songUrl: fields.properties.songUrl,
            });
        });
        return songs;
    }
    async getSong(id) {
        const song_result = (await this.neo4j.session().run(`Match (n:Song) Where ID(n)=${id} return n;`)).records[0];
        if (song_result) {
            const fields = song_result["_fields"][0];
            const song = {
                id: fields.identity.low,
                title: fields.properties.title,
                views: fields.properties.views.low,
                songUrl: fields.properties.songUrl,
            };
            return song;
        }
        else
            throw new common_1.NotFoundException('Song not found');
    }
    async viewSong(id, viewSongDto) {
        const { user_id } = viewSongDto;
        const song = await this.getSong(id);
        const query = (await this.neo4j.session().run(`MATCH (u:User),(s:Song)
        WHERE ID(u)=${user_id} and ID(s)=${id}
        CREATE (u)-[r:HAS_VIEWED{ date_time: datetime({timezone:'Europe/Zagreb'}) }]->(s)
        SET s.views = s.views + 1
        RETURN true`));
        if (query.records.length > 0) {
            return true;
        }
        else
            throw new common_1.NotFoundException('User does not exist');
    }
};
SongsService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject("Neo4j")),
    __metadata("design:paramtypes", [Object])
], SongsService);
exports.SongsService = SongsService;
//# sourceMappingURL=songs.service.js.map