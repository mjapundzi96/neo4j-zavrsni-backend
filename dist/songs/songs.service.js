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
        const song_result = await this.neo4j.query(`MATCH (s:Song)-[:FROM_ALBUM]->(al:Album)-[:BY_ARTIST]->(ar:Artist) WHERE ID(s)=${id} 
        RETURN s AS song, al AS album, ar AS artist;`);
        const songObj = song_result[0].get('song');
        const artistObj = song_result[0].get('artist');
        const albumObj = song_result[0].get('album');
        if (songObj) {
            return Object.assign(Object.assign({}, songObj.properties), { id: songObj.identity.low, views: songObj.properties.views.low, likes: songObj.properties.likes.low, album: Object.assign(Object.assign({}, albumObj.properties), { id: albumObj.identity.low, year: albumObj.properties.year.low, artist: Object.assign(Object.assign({}, artistObj.properties), { id: artistObj.identity.low }) }) });
        }
        else
            throw new common_1.NotFoundException('Song not found');
    }
    async getUsersAlsoViewed(id, user_id) {
        const song_results = await this.neo4j.query(`MATCH (s:Song)<-[:HAS_VIEWED]-(u:User)-[:HAS_VIEWED]->(rec:Song)-[:FROM_ALBUM]->(al:Album)-[:BY_ARTIST]->(ar:Artist)
        WHERE ID(u)<>${user_id} AND ID(s)=${id}
        RETURN rec AS song,ar AS artist,al AS album,COUNT(*) AS usersWhoAlsoViewed
        ORDER BY usersWhoAlsoViewed DESC LIMIT 25`);
        const songs = song_results.map(result => {
            const songObj = result.get('song');
            const albumObj = result.get('album');
            const artistObj = result.get('artist');
            return Object.assign(Object.assign({}, songObj.properties), { id: songObj.identity.low, views: songObj.properties.views.low, album: Object.assign(Object.assign({}, albumObj.properties), { id: albumObj.identity.low, year: albumObj.properties.low, artist: Object.assign(Object.assign({}, artistObj.properties), { id: artistObj.identity.low }) }) });
        });
        return songs;
    }
    async getRelatedSongs(id) {
        const song_results = await this.neo4j.query(`MATCH p=(s:Song)-[r*..6]-(s2:Song) WHERE id(s)=${id} AND NONE(rel in r WHERE type(rel)='HAS_VIEWED' OR type(rel)='LIKED' OR type(rel)='HAS_FAVORITE_GENRE' OR (type(rel)='FEATURING' AND length(p) > 1))
        WITH COUNT(r) as relationships,length(p) as length,s2 ORDER by relationships DESC,length ASC,s2.views DESC
        MATCH (s2)-[:FROM_ALBUM]->(al:Album)-[:BY_ARTIST]->(ar:Artist)
        RETURN DISTINCT s2 as song, al as album, ar as artist ORDER BY s2.views DESC LIMIT 12;`);
        const songs = song_results.map(result => {
            const songObj = result.get('song');
            const albumObj = result.get('album');
            const artistObj = result.get('artist');
            return Object.assign(Object.assign({}, songObj.properties), { id: songObj.identity.low, views: songObj.properties.views.low, album: Object.assign(Object.assign({}, albumObj.properties), { id: albumObj.identity.low, year: albumObj.properties.low, artist: Object.assign(Object.assign({}, artistObj.properties), { id: artistObj.identity.low }) }) });
        });
        return songs;
    }
    async viewSong(id, user_id) {
        const result = await this.neo4j.query(`MATCH (u:User),(s:Song)
        WHERE ID(u)=${user_id} and ID(s)=${id}
        MERGE (u)-[r:HAS_VIEWED]->(s)
        SET s.views = s.views + 1
        SET r.date_time = datetime({timezone:'Europe/Zagreb'})
        RETURN true AS result`);
        if (result[0].get('result')) {
            return true;
        }
        else
            throw new common_1.NotFoundException('User or song does not exist');
    }
    async likeSong(id, user_id) {
        const result = await this.neo4j.query(`MATCH (u:User),(s:Song)
        WHERE ID(u)=${user_id} and ID(s)=${id}
        CREATE (u)-[r:LIKED]->(s)
        set s.likes = s.likes + 1
        set r.date_time = datetime({timezone:'Europe/Zagreb'})
        RETURN true AS result`);
        if (result[0].get('result')) {
            return true;
        }
        else
            throw new common_1.NotFoundException('User or song does not exist');
    }
    async unLikeSong(id, user_id) {
        const result = await this.neo4j.query(`MATCH (u:User)-[r:LIKED]-(s:Song)
        WHERE ID(u)=${user_id} and ID(s)=${id}
        set s.likes = s.likes - 1
        DELETE r
        return true as result;`);
        if (result[0]) {
            return result[0].get('result');
        }
        else
            throw new common_1.NotFoundException('User or song does not exist');
    }
    async getHasLiked(id, user_id) {
        const result = await this.neo4j.query(`MATCH (u:User)-[r:LIKED]-(s:Song)
        WHERE ID(u)=${user_id} and ID(s)=${id}
        DELETE r
        return true as result;`);
        if (result[0]) {
            return result[0].get('result');
        }
        return false;
    }
};
SongsService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [neo4j_service_1.Neo4jService])
], SongsService);
exports.SongsService = SongsService;
//# sourceMappingURL=songs.service.js.map