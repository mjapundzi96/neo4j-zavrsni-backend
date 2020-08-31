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
let GenresService = class GenresService {
    constructor(neo4j) {
        this.neo4j = neo4j;
    }
    async getGenres() {
        const genre_results = await this.neo4j.query(`MATCH (n:Genre) RETURN n {
            id:ID(n),
            name:n.name
        } as genre;`);
        let genres = [];
        genre_results.forEach((res) => {
            genres.push(Object.assign(Object.assign({}, res.get('genre')), { id: res.get('genre').id.low }));
        });
        return genres;
    }
    async getGenre(id) {
        const genre_result = await this.neo4j.query(`MATCH (n:Genre) WHERE ID(n)=${id} RETURN {
            id:ID(n),
            name:n.name
        } AS genre`);
        if (genre_result) {
            return Object.assign(Object.assign({}, genre_result[0].get('genre')), { id: genre_result[0].get('genre').id.low });
        }
        else
            throw new common_1.NotFoundException('Genre does not exist');
    }
    async getPopularAlbumsFromGenre(id, getPopularFilterDto) {
        const { offset, limit } = getPopularFilterDto;
        const albums_results = await this.neo4j.query(`
        MATCH (g:Genre)<-[:IS_GENRE]-(ar:Artist)<-[:BY_ARTIST]-(al:Album)<-[:FROM_ALBUM]-(s:Song)
        WHERE ID(g)=${id}
        RETURN DISTINCT al AS album, ar as artist, sum(s.views) ORDER BY sum(s.views) DESC SKIP ${offset} LIMIT ${limit};`);
        let albums = [];
        albums_results.forEach((result) => {
            const albumObj = result.get('album');
            const artistObj = result.get('artist');
            const { year } = albumObj.properties;
            albums.push(Object.assign(Object.assign({}, albumObj.properties), { id: albumObj.identity.low, year: year.low, artist: Object.assign(Object.assign({}, artistObj.properties), { id: artistObj.identity.low }) }));
        });
        return albums;
    }
};
GenresService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [neo4j_service_1.Neo4jService])
], GenresService);
exports.GenresService = GenresService;
//# sourceMappingURL=genres.service.js.map