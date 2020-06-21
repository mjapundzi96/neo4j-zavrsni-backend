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
    async getListenHistory(user_id) {
        const history_results = (await this.neo4j.session().run(`match (u:User)-[r:HAS_VIEWED]-(s:Song) WHERE ID(u)=${user_id} return s,r.date_time ORDER BY r.date_time DESC;`)).records;
        let songs = [];
        history_results.forEach((result) => {
            const fields = result["_fields"][0];
            const date = result["_fields"][1];
            songs.push({
                id: fields.identity.low,
                title: fields.properties.title,
                views: fields.properties.views.low,
                date_listened: new Date(date.year.low, date.month.low, date.day.low, date.hour.low, date.minute.low, date.second.low)
            });
        });
        return songs;
    }
    async getRecommendendedAlbums(user_id, getRecommendedFilterDto) {
        const { offset, limit } = getRecommendedFilterDto;
        let albums = [];
        const albumsResults = (await this.neo4j.session().run(`MATCH (u:User)-[r:HAS_FAVORITE_GENRE]->(g:Genre)<-[r2:IS_GENRE]-(a:Artist)<-[r3:BY_ARTIST]-(al:Album)<-[r4:FROM_ALBUM]-(s:Song)
        where ID(u)=${user_id} RETURN al,sum(s.views),a ORDER BY sum(s.views) DESC SKIP ${offset} LIMIT ${limit};`)).records;
        albumsResults.forEach((result) => {
            const fields = result["_fields"][0];
            const views = result["_fields"][1].low;
            const artist = result["_fields"][2];
            albums.push({
                id: fields.identity.low,
                name: fields.properties.name,
                coverUrl: fields.properties.coverUrl,
                year: fields.properties.year.low,
                views: views,
                artist: Object.assign(artist.properties, { id: artist.identity.low })
            });
        });
        return albums;
    }
    async getRecommendedArtists(user_id, getRecommendedFilterDto) {
        const { offset, limit } = getRecommendedFilterDto;
        let artists = [];
        const artistsResults = (await this.neo4j.session().run(`MATCH (u:User)-[r:HAS_FAVORITE_GENRE]->(g:Genre)<-[r2:IS_GENRE]-(a:Artist)<-[r3:BY_ARTIST]-(al:Album)<-[r4:FROM_ALBUM]-(s:Song)
        where ID(u)=${user_id} RETURN a,sum(s.views),g ORDER BY sum(s.views) DESC SKIP ${offset} LIMIT ${limit};`)).records;
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
    __param(0, common_1.Inject("Neo4j")),
    __metadata("design:paramtypes", [Object])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map