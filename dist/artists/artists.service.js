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
const neo4j_service_1 = require("../neo4j/neo4j.service");
let ArtistsService = class ArtistsService {
    constructor(neo4j) {
        this.neo4j = neo4j;
    }
    async getArtists(filterDto) {
        const { name } = filterDto;
        const artist_results = await this.neo4j.query(`Match (n:Artist) Where toUpper(n.name) CONTAINS toUpper('${name}') return {
            id:ID(n),
            name:n.name,
            country:n.country,
            type:n.type,
            imageUrl: n.imageUrl
        } as artist;`);
        const artists = artist_results.map(result => {
            const artistObj = result.get('artist');
            return Object.assign(Object.assign({}, artistObj), { id: artistObj.id.low });
        });
        return artists;
    }
    async getArtist(id) {
        const artist_result = await this.neo4j.query(`MATCH (ar:Artist)<-[:BY_ARTIST]-(al:Album)
        WITH ar, collect({ id: id(al), name: al.name,coverUrl:al.covercoverUrl }) AS album
        WITH { id: id(ar), name: ar.name,imageUrl:ar.imageUrl,albums: album } AS artist
        WHERE ID(ar)=${id}
        RETURN {artists: collect(artist) } AS artist_return;`);
        const artistObj = artist_result[0].get('artist_return').artists[0];
        if (artistObj) {
            return Object.assign(Object.assign({}, artistObj), { id: artistObj.id.low, albums: artistObj.albums.map(album => {
                    return Object.assign(Object.assign({}, album), { id: album.id.low });
                }) });
        }
        else
            throw new common_1.NotFoundException('Artist not found');
    }
};
ArtistsService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [neo4j_service_1.Neo4jService])
], ArtistsService);
exports.ArtistsService = ArtistsService;
//# sourceMappingURL=artists.service.js.map