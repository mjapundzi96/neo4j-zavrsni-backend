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
let UsersService = class UsersService {
    constructor(neo4j) {
        this.neo4j = neo4j;
    }
    async getUser(id) {
        const user_result = await this.neo4j.query(`MATCH (n:User) where ID(n)=${id} RETURN {
            id: ID(n),
            username: n.username
         } AS user;`);
        if (!user_result) {
            throw new common_1.NotFoundException('User not found');
        }
        return Object.assign(Object.assign({}, user_result[0].get('user')), { id: user_result[0].get('user').id.low });
    }
    async getListenHistory(user_id) {
        const history_results = await this.neo4j.query(`MATCH (u:User)-[r:HAS_VIEWED]-(s:Song) WHERE ID(u)=${user_id} RETURN {
            id:ID(s),
            title:s.title,
            views:s.views,
            songUrl:s.songUrl,
            date_listened:r.date_time
        } AS song ORDER BY r.date_time DESC;`);
        let songs = [];
        history_results.forEach((result) => {
            const songObj = result.get('song');
            const date = songObj.date_listened;
            songs.push({
                id: songObj.id.low,
                title: songObj.title,
                views: songObj.views.low,
                songUrl: songObj.songUrl,
                date_listened: new Date(date.year.low, date.month.low, date.day.low, date.hour.low, date.minute.low, date.second.low)
            });
        });
        return songs;
    }
    async getRecommendendedAlbums(user_id, getRecommendedFilterDto) {
        const { offset, limit } = getRecommendedFilterDto;
        const albumsResults = await this.neo4j.query(`MATCH (u:User)-[:HAS_FAVORITE_GENRE]->(g:Genre)<-[:IS_GENRE]-(ar:Artist)<-[:BY_ARTIST]-(al:Album)<-[:FROM_ALBUM]-(s:Song) where ID(u)=${user_id}
        return al as album,ar as artist,SUM(s.views) ORDER BY SUM(s.views) DESC SKIP ${offset} LIMIT ${limit};`);
        let albums = [];
        albumsResults.forEach((result) => {
            const albumObj = result.get('album');
            const artistObj = result.get('artist');
            albums.push(Object.assign(Object.assign({}, albumObj.properties), { id: albumObj.identity.low, year: albumObj.properties.year.low, artist: Object.assign(Object.assign({}, artistObj.properties), { id: artistObj.identity.low }) }));
        });
        return albums;
    }
    async getRecommendedArtists(user_id, getRecommendedFilterDto) {
        const { offset, limit } = getRecommendedFilterDto;
        const artistsResults = await this.neo4j.query(`MATCH (u:User)-[r:HAS_FAVORITE_GENRE]->(g:Genre)<-[r2:IS_GENRE]-(a:Artist)<-[r3:BY_ARTIST]-(al:Album)<-[r4:FROM_ALBUM]-(s:Song)
        where ID(u)=${user_id} RETURN a,sum(s.views),g ORDER BY sum(s.views) DESC SKIP ${offset} LIMIT ${limit};`);
        let artists = [];
        artistsResults.forEach((result) => {
            const fields = result["_fields"][0];
            const views = result["_fields"][1].low;
            const genre = result["_fields"][2];
            artists.push({
                id: fields.identity.low,
                name: fields.properties.name,
                imageUrl: fields.properties.imageUrl,
                country: fields.properties.country,
                type: fields.properties.type,
                views: views,
                genre: Object.assign(genre.properties, { id: genre.identity.low })
            });
        });
        return artists;
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [neo4j_service_1.Neo4jService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map