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
const models_1 = require("../models");
let SongsService = class SongsService {
    constructor(neo4j) {
        this.neo4j = neo4j;
    }
    async getSongs(filterDto) {
        const { title } = filterDto;
        const songs_results = await this.neo4j.query(`MATCH (n:Song) WHERE toUpper(n.title) CONTAINS toUpper('${title}') RETURN {
            id: ID(n),
            title:n.title,
            songUrl:n.songUrl,
            views:n.views
        } AS song;`);
        const songs = songs_results.map(result => {
            const songObj = result.get('song');
            return Object.assign(Object.assign({}, songObj), { id: songObj.id.low, views: songObj.views.low });
        });
        return songs;
    }
    async getSong(id) {
        const song_result = (await this.neo4j.query(`Match (s:Song)-[:FROM_ALBUM]->(al:Album)-[:BY_ARTIST]->(ar:Artist) Where ID(s)=${id} return {
            id: ID(s),
            title: s.title,
            views: s.views,
            songUrl: s.songUrl,
            album: {
                id: ID(al),
                name: al.name,
                coverUrl: al.coverUrl,
                artist: {
                    id: ID(ar),
                    name: ar.name,
                    imageUrl: ar.imageUrl
                }
            }
        } as song;`));
        const songObj = song_result[0].get('song');
        if (songObj) {
            const album = songObj.album;
            const artist = album.artist;
            return Object.assign(Object.assign({}, songObj), { id: songObj.id.low, views: songObj.views.low, album: Object.assign(Object.assign({}, album), { id: album.id.low, artist: Object.assign(Object.assign({}, artist), { id: artist.id.low }) }) });
        }
        else
            throw new common_1.NotFoundException('Song not found');
    }
    async viewSong(id, user_id) {
        const result = await this.neo4j.query(`MATCH (u:User),(s:Song)
        WHERE ID(u)=${user_id} and ID(s)=${id}
        MERGE (u)-[r:HAS_VIEWED]->(s)
        ON CREATE SET s.views = s.views + 1
        SET r.date_time = datetime({timezone:'Europe/Zagreb'})
        RETURN true AS result`);
        if (result[0].get('result')) {
            return true;
        }
        else
            throw new common_1.NotFoundException('User or song does not exist');
    }
};
SongsService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [neo4j_service_1.Neo4jService])
], SongsService);
exports.SongsService = SongsService;
//# sourceMappingURL=songs.service.js.map